import { addClass, removeClass } from './dom';
import './style.css';

export default class OperationBoard {
  queue = [];
  boardEl = null;

  constructor(container) {
    this.container = container;
    this.createBoardEl();
  }

  show(object, { url, text }) {
    this.container.appendChild(this.boardEl);

    // 添加当前图层标题
    this.setLayerTitle({ url, text });

    // 点亮图层的叠加模式
    this._forEachMenus((node) => {
      if (node.getAttribute('_action') === object.globalCompositeOperation) {
        addClass(node, 'active');
      } else {
        removeClass(node, 'active');
      }
    }, 'gop')
  }

  hide() {
    if (!this.boardEl.parentElement) {
      return;
    }

    this.container.removeChild(this.boardEl);
  }

  listenClick(fun) {
    this.queue.push(fun);
  }

  setLayerTitle({ url, text }) {
    const avatarStr = `<span class="operation__menu avatar"><img src="${url}"/></span>`;
    const textStr = `<span class="operation__menu text">${text}</span>`;
    if (url) {
      document.getElementById('layerBox').innerHTML = avatarStr;
    } else if (text) {
      document.getElementById('layerBox').innerHTML = textStr;
    } else {
      document.getElementById('layerBox').innerHTML = '';
    }
  }

  createBoardEl() {
    this.boardEl = document.createElement('div');
    this.boardEl.className = 'operation-board';
    // <span class="menu" _action="up">上</span>
    // <span class="menu" _action="down">下</span>
    // <span class="menu" _action="left">左</span>
    // <span class="menu" _action="right">右</span>
    this.boardEl.innerHTML = `
    <div id="layerBox"></div>
    <span class="operation__menu" _action="lock">锁</span>
    <span class="operation__menu" _action="unlock">解锁</span>
    <span class="operation__menu" _action="forward">前</span>
    <span class="operation__menu" _action="backward">后</span>
    <span class="operation__menu" _action="delete">删除</span>
    <span class="operation__menu" _action="x-left">x-left</span>
    <span class="operation__menu" _action="x-center">x-center</span>
    <span class="operation__menu" _action="source-over" _type="gop">s-over</span>
    <span class="operation__menu" _action="source-atop" _type="gop">s-atop</span>
    <span class="operation__menu" _action="source-in" _type="gop">s-in</span>
    <span class="operation__menu" _action="source-out" _type="gop">s-out</span>
    <span class="operation__menu" _action="destination-over" _type="gop">d-over</span>
    <span class="operation__menu" _action="destination-atop" _type="gop">d-atop</span>
    <span class="operation__menu" _action="destination-in" _type="gop">d-in</span>
    <span class="operation__menu" _action="destination-out" _type="gop">d-out</span>
    `;

    this.boardEl.addEventListener('click', (e) => {
      const action = e.target.getAttribute('_action');
      for (const fun of this.queue) {
        if (action) fun.call(null, action);
      }

      if (e.target.getAttribute('_type') === 'gop') {
        this._forEachMenus((node) => {
          if (node.getAttribute('_action') === action && node.getAttribute('_type') === 'gop') {
            addClass(node, 'active');
          } else {
            removeClass(node, 'active');
          }
        }, 'gop')
      }
    })
  }

  _forEachMenus(cb, type) {
    const nodes = document.getElementsByClassName('operation__menu');
    for (const node of nodes) {
      if (type) {
        if (node.getAttribute('_type') === type) {
          cb(node);
        }
      } else {
        cb(node);
      }
    }
  }
}
