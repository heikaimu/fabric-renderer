/*
 * @Date: 2022-05-17 10:47:11
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2023-01-03 12:12:15
 * @FilePath: /fabric-renderer-js/lib/Renderer.js
 */
import { fabric } from 'fabric';
import Loading from './Loading';
import { customControl, normalControl, customControlStyle } from './control';
import { handleRect, handleImage, handleSVG, handleText, handleBackground, handleOverlay } from './layer';
import { actionHandler } from './actions';
import OperationBoard from './OperationBoard';
import { getBoolean } from './util';

export {
  fabric
}

export default class Renderer {
  // fabric实列
  instance = null;
  // 激活的对象
  activeObject = null;
  // 加载中
  loading = null;
  // 操作板
  operationBoard = null;
  // 是否可以配置（后台一般开启）
  configurable = false;
  // 是否可以完全选择
  selection = false;

  constructor(id, { textureSize, width, height, scale, active = true, backgroundColor = '#ffffff', configurable, selection }) {
    this.textureSize = textureSize;
    // canvas id
    this.canvasId = id;
    // 画布宽
    this.canvasWidth = width;
    // 画布高
    this.canvasHeight = height;
    // 缩放比
    this.scale = scale ? scale : 1;
    // 是否是活动画布
    this.active = active;
    // 画布背景色
    this.backgroundColor = backgroundColor;
    // 是否完全定制
    this.configurable = configurable;
    // 多选
    this.selection = selection;
    // 创建fabric画布
    this.initial();
  }


  // 初始化fabric画布
  initial() {
    if (this.textureSize) {
      fabric.textureSize = this.textureSize;
    }

    // 初始化
    this.instance = new fabric.Canvas(this.canvasId, {
      width: this.canvasWidth,
      height: this.canvasHeight,
      selection: this.selection,
      backgroundColor: this.backgroundColor
    });
    this.instance.preserveObjectStacking = true;

    // 如果初始化的缩放比例不为1，则调用缩放方法
    if (this.scale !== 1) {
      this.setZoom(this.scale);
    }

    // 定制控制器样式
    if (!this.configurable) {
      customControl(fabric, this.instance);
    } else {
      normalControl(fabric, this.instance);
    }

    // 创建加载层实例
    this.loading = new Loading(this.instance.wrapperEl);

    // 绑定点击打开操控面板
    if (this.configurable) {
      this.operationBoard = new OperationBoard(this.instance.wrapperEl);
      this.operationBoard.listenClick((action) => {
        actionHandler(action, this);
      })
      this.instance.on('mouse:down', (e) => {
        this.openOperationBoard(e.target);
      })
    }
  }

  /**
   * 处理激活图层
   * @param {string} action - 行为
   */
  handleObject(action) {
    actionHandler(action, this);
  }

  /**
   * 缩放画布整体
   * @param {number} ratio - 缩放比例
   */
  setZoom(ratio) {
    // 重新设置画布大小
    this.instance.setDimensions({ width: this.instance.getWidth() * ratio, height: this.instance.getHeight() * ratio });
    // 所有内容缩放
    this.instance.setZoom(ratio);
  }

  /**
   * 修改背景色
   * @param {string} color 
   */
  setBackgroundColor(color) {
    this.instance.setBackgroundColor(color, this.instance.renderAll.bind(this.instance));
  }

  /**
   * 添加矩形
   * @param {*} options 
   */
  async addRect(options) {
    await handleRect(this, options);
    console.log('矩形添加成功');
  }

  /**
   * 添加图片
   * @param {string} url - 图片地址
   * @param {object} options - 配置参数
   * @param {object} finishOptions - 添加完成后的参数
   */
  async addImage(url, options, finishOptions) {
    const obj = await handleImage(this, url, options);
    this._commonObjectHandler(obj, finishOptions);
    console.log('背景附件成功');
  }

  /**
   * 添加SVG
   * @param {string} url - 图片地址
   * @param {object} options - 配置参数
   * @param {object} finishOptions - 添加完成后的参数
   */
  async addSVG(url, options, finishOptions) {
    const obj = await handleSVG(this, url, options);
    this._commonObjectHandler(obj, finishOptions);
    console.log('SVG成功');
  }

  /**
   * 添加文字
   * @param {string} text - 文字内容
   * @param {object} options - 配置参数
   * @param {object} finishOptions - 添加完成后的参数
   */
  async addText(text, options, finishOptions) {
    const obj = await handleText(this, text, options);
    this._commonObjectHandler(obj, finishOptions);
    console.log('背景文字成功');
  }

  /**
   * 添加背景
   * @param {string} url - 图片地址
   */
  async addBackground(url, options) {
    await handleBackground(this, url, options);
    console.log('背景添加成功');
  }

  /**
   * 添加背景
   * @param {*} url - 图片地址
   * @param {*} fit - 布局
   */
  setBackground(url, fit = 'cover') {
    return new Promise((resolve, reject) => {

      fabric.Image.fromURL(url, (img) => {
        const cWidth = this.instance.width;
        const cHeight = this.instance.height;

        const imgRatio = img.width / img.height;
        const canvasRatio = cWidth / cHeight;

        let scaleX;
        let scaleY;
        let left = 0;
        let top = 0;

        if (fit === 'cover') {
          if (imgRatio > canvasRatio) {
            // 上下对齐，左右裁剪，左右偏移居中
            scaleX = cHeight / img.height;
            scaleY = cHeight / img.height;
            // 通过当前canvas的高度计算出图片的宽度
            const imgWidth = cHeight * imgRatio;
            left = (cWidth - imgWidth) / 2;
          } else {
            // 左右对齐，上下裁剪，上下偏移居中
            scaleX = cWidth / img.width;
            scaleY = cWidth / img.width;
            // 通过当前canvas的宽度计算出图片的高度
            const imgHeight = cWidth / imgRatio;
            top = (cHeight - imgHeight) / 2;
          }
        } else {
          scaleX = cWidth / img.width;
          scaleY = cHeight / img.height;
        }

        this.instance.setBackgroundImage(img, () => {
          this.instance.renderAll();
          resolve(img);
        }, {
          scaleX,
          scaleY,
          left,
          top
        });
      }, {
        crossOrigin: 'Anonymous'
      });

    })
  }

  /**
   * 添加遮盖
   * @param {string} url - 图片地址
   */
  async addOverlay(url, options) {
    await handleOverlay(this, url, options);
    console.log('背景遮盖成功');
  }

  /**
   * 打开操作板，改变图层的多个属性
   * @param {object} obj - 图层对象
   */
  openOperationBoard(obj) {
    this.activeObject = obj;

    if (obj) {
      const { type } = obj;
      switch (type) {
        case 'image':
          this.operationBoard.show(obj, { url: obj.getSrc() });
          break;

        case 'text':
          this.operationBoard.show(obj, { text: 'T' });
          break;

        case 'path':
          this.operationBoard.show(obj, { text: 'SVG' });
          break;

        default:
          this.operationBoard.show(obj, {});
          break;

      }
    } else {
      this.operationBoard.hide();
    }
  }

  /**
   * 序列化
   * @returns {object}
   */
  toJSON(expends = []) {
    return this.instance.toJSON(['selectable', 'customId', 'customName', 'customType', 'customTL', 'customBL'].concat(expends));
  }

  /**
   * 反序列化
   * @param {object} data - 画布object
   * @param {function} objCallback - 单个对象回调
   * @param {boolean} finishCallback - 全部渲染完成后的回调
   */
  loadFromJSON(data, objCallback, finishCallback) {
    objCallback = objCallback ? objCallback : () => { };
    finishCallback = finishCallback ? finishCallback : () => { };
    this.loading.show();
    this.instance.loadFromJSON(data, () => {
      this.instance.renderAll();
      this.loading.hide();
      finishCallback();
    }, (o, object) => {
      // 如果是矩形，不添加自定义控制器
      // 添加自定义控制器样式
      if (!this.configurable && object.type !== 'rect') {
        customControlStyle(this.instance, object);
      }
      // 回调
      objCallback(this.instance, object);
    });
  }

  /**
   * 生成图片
   * @param {number} multiplier - 缩放倍数
   * @returns {string}
   */
  toDataURL(multiplier = 1, format = 'png') {
    const dataURL = this.instance.toDataURL({
      format,
      multiplier
    });
    return dataURL;
  }

  /**
   * 通用的图层添加完成后处理规则
   * @param {object} obj - 图层对象
   * @param {object} finishOptions - 添加后配置
   */
  _commonObjectHandler(obj, finishOptions = {}) {
    // 激活
    if (getBoolean(finishOptions.active, true)) {
      this.instance.setActiveObject(obj);
    }

    // 居中
    if (getBoolean(finishOptions.center, true)) {
      this.instance.centerObject(obj);
    }

    // 打开操作板
    if (getBoolean(finishOptions.boardOpen, true) && this.operationBoard) {
      this.openOperationBoard(obj);
    }

    // 自定义控制器样式
    if (!this.configurable && getBoolean(finishOptions.controlStyle, true)) {
      customControlStyle(this.instance, obj);
    }
  }
}
