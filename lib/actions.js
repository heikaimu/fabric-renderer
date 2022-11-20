/*
 * @Date: 2022-05-18 17:20:06
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-09-27 16:53:38
 * @FilePath: /fabric-renderer-js/lib/actions.js
 */
export function actionHandler(action, renderer) {
  const { instance, activeObject, operationBoard } = renderer;
  if (!activeObject) {
    return;
  }

  calculateStrategy(action)(renderer);
}

// 策略
const strategies = {
  lock: lockStrategy,
  unlock: unlockStrategy,
  up: topStrategy,
  down: downStrategy,
  left: leftStrategy,
  right: rightStrategy,
  forward: forwardStrategy,
  backward: backwardStrategy,
  delete: deleteStrategy,
  'source-over': sOverStrategy,
  'source-atop': sAtopStrategy,
  'source-in': sInStrategy,
  'source-out': sOutStrategy,
  'destination-over': dOverStrategy,
  'destination-atop': dAtopStrategy,
  'destination-in': dInStrategy,
  'destination-out': dOutStrategy,
  'x-left': xLeftStrategy,
  'x-center': xCenterStrategy,
}

// 查找策略
function calculateStrategy(key) {
  return strategies[key];
}

/*
锁住图层
取消画布中的所有对象的选中状态。
*/
function lockStrategy({ instance, activeObject }) {
  activeObject.selectable = false;
  instance.discardActiveObject().renderAll();
}

// 解锁
function unlockStrategy({ instance, activeObject }) {
  activeObject.selectable = true;
  instance.setActiveObject(activeObject).renderAll();
}

// 上
function topStrategy({ instance, activeObject }) {
  _move(instance, activeObject, { y: -1 });
}

// 下
function downStrategy({ instance, activeObject }) {
  _move(instance, activeObject, { y: 1 });
}

// 左
function leftStrategy({ instance, activeObject }) {
  _move(instance, activeObject, { x: -1 });
}

// 右
function rightStrategy({ instance, activeObject }) {
  _move(instance, activeObject, { x: 1 });
}

// 前
function forwardStrategy({ activeObject }) {
  activeObject.bringForward();
}

// 后
function backwardStrategy({ activeObject }) {
  activeObject.sendBackwards();
}

// 删除
function deleteStrategy({ instance, activeObject, operationBoard }) {
  instance.remove(activeObject);
  operationBoard.hide();
}

// 基点
function xLeftStrategy({ instance, activeObject }) {
  activeObject.originX = 'left';
  instance.setActiveObject(activeObject).renderAll();
}

function xCenterStrategy({ instance, activeObject }) {
  activeObject.originX = 'center';
  instance.setActiveObject(activeObject).renderAll();
}

// 叠加
function sOverStrategy({ instance, activeObject }) {
  _globalCompositeOperation(instance, activeObject, 'source-over');
}

function sAtopStrategy({ instance, activeObject }) {
  _globalCompositeOperation(instance, activeObject, 'source-atop');
}

function sInStrategy({ instance, activeObject }) {
  _globalCompositeOperation(instance, activeObject, 'source-in');
}

function sOutStrategy({ instance, activeObject }) {
  _globalCompositeOperation(instance, activeObject, 'source-out');
}

function dOverStrategy({ instance, activeObject }) {
  _globalCompositeOperation(instance, activeObject, 'destination-over');
}

function dAtopStrategy({ instance, activeObject }) {
  _globalCompositeOperation(instance, activeObject, 'destination-atop');
}

function dInStrategy({ instance, activeObject }) {
  _globalCompositeOperation(instance, activeObject, 'destination-in');
}

function dOutStrategy({ instance, activeObject }) {
  _globalCompositeOperation(instance, activeObject, 'destination-out');
}

function _move(instance, activeObject, { x = 0, y = 0 }) {
  const { left, top } = activeObject;
  activeObject.set({
    left: left + x,
    top: top + y
  })
  instance.renderAll();
}

function _globalCompositeOperation(instance, activeObject, globalCompositeOperation) {
  activeObject.set({
    globalCompositeOperation
  })
  instance.renderAll();
}
