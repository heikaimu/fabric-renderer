/*
 * @Date: 2022-05-17 11:21:10
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-06-24 14:37:24
 * @FilePath: /fabric-renderer-js/lib/control.js
 */
import { ICON_REPLACE, ICON_SCALE, ICON_FLIP, ICON_ROTATE, ICON_DELETE } from './config';
import 'fabric-customise-controls';

export function customControl(fabric, instance) {
  fabric.Canvas.prototype.customiseControls({
    // 左上
    tl: {
      action: (e, target) => {
        strategyTL(target.customTL).action(instance, e, target);
      },
      cursor: 'pointer'
    },
    // 右上
    tr: {
      action: 'scale',
      cursor: 'pointer'
    },
    // 右下
    br: {
      action: 'rotate',
      cursor: 'pointer'
    },
    // 左下
    bl: {
      action: (e, target) => {
        strategyBL(target.customBL).action(instance, e, target);
      },
      cursor: 'pointer'
    }
  });
}

/**
 * 对象样式
 * @param {object} instance - 画布实列
 * @param {object} obj - 图层对象
 */
export function customControlStyle(instance, obj) {
  // 显示
  obj.setControlsVisibility({
    mtr: false,
    ml: false,
    mr: false,
    mt: false,
    mb: false
  });

  // 重构控制器样式
  obj.customiseCornerIcons({
    settings: {
      borderColor: '#e02433',
      cornerSize: 25,
      cornerBackgroundColor: '#e02433',
      cornerShape: 'circle',
      cornerPadding: 10
    },
    tl: {
      icon: strategyTL(obj.customTL).icon
    },
    tr: {
      icon: ICON_SCALE
    },
    bl: {
      icon: strategyBL(obj.customBL).icon
    },
    br: {
      icon: ICON_ROTATE
    }
  }, () => {
    instance.renderAll();
  });
}

// 左上
function strategyTL(key) {
  const fun = calculateStrategy(key) || deleteStrategy;
  return fun();
}

// 左下
function strategyBL(key) {
  const fun = calculateStrategy(key) || flipStrategy;
  return fun();
}

// 策略
const strategies = {
  replace: replaceStrategy,
  delete: deleteStrategy
}

// 查找策略
function calculateStrategy(key) {
  return strategies[key];
}

// 替换
function replaceStrategy() {
  const icon = ICON_REPLACE;
  const action = (instance, e, target) => {
    alert();
  }
  return {
    icon,
    action
  }
}

// 删除
function deleteStrategy() {
  const icon = ICON_DELETE;
  const action = (instance, e, target) => {
    instance.remove(target);
  }
  return {
    icon,
    action
  }
}

// 镜像
function flipStrategy() {
  const icon = ICON_FLIP;
  const action = (instance, e, target) => {
    const scaleX = target.scaleX;
    target.set({
      scaleX: -Math.abs(scaleX)
    });
    instance.renderAll();
  }
  return {
    icon,
    action
  }
}

export function normalControl(fabric, instance) {
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = 'blue';
  fabric.Object.prototype.cornerStyle = 'circle';
}
