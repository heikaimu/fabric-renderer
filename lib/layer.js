/**
 * 添加矩形
 * @param {*} renderer 
 * @param {*} options 
 * @returns 
 */
export function handleRect(renderer, options = {}) {
  const { instance, canvasWidth } = renderer;
  return new Promise((resolve) => {
    const rect = new fabric.Rect({
      left: 100,
      top: 50,
      fill: 'red',
      width: 200,
      height: 100,
      opacity: 0.6
    });
    instance.add(rect);
    resolve();
  })
}

/**
 * 添加图片
 * @param {string} url - 图片地址
 * @param {object} options - 配置
 * @param {function} callback - 回调函数
 */
export function handleImage(renderer, url, options = {}) {
  const { instance, canvasWidth } = renderer;
  return new Promise((resolve) => {
    fabric.Image.fromURL(url, img => {
      // 如果设置了宽度，则直接缩放到指定宽度，如果没有设置则使用画布的80%宽度
      const width = options.width ? options.width : instance.width * 0.8;
      const scale = width / img.width;
      const newOptions = { ...options };
      delete newOptions.width;
      delete newOptions.height;
      img.set(Object.assign({
        scaleX: scale,
        scaleY: scale
      }, newOptions));
      instance.add(img);
      resolve(img);
    }, {
      crossOrigin: 'Anonymous'
    })
  })
}

/**
 * 添加SVG
 * @param {string} url - SVG地址
 * @param {object} options - 配置
 * @param {function} callback - 回调函数
 */
export function handleSVG(renderer, url, options = {}) {
  const { instance, canvasWidth } = renderer;
  return new Promise((resolve) => {
    fabric.loadSVGFromURL(url, (objects, params) => {
      const mask = fabric.util.groupSVGElements(objects, params);
      mask.scaleToWidth(canvasWidth)
      mask.set(Object.assign({}, options));
      instance.add(mask);
      resolve(mask);
    });
  })
}

/**
 * 添加文字
 * @param {string} text - SVG地址
 * @param {object} options - 配置
 * @param {function} callback - 回调函数
 */
export function handleText(renderer, text, options = {}) {
  const { instance } = renderer;
  return new Promise((resolve) => {
    const t = new fabric.Text(text, Object.assign({
      fontSize: 30,
      fill: '#000000'
    }, options))
    instance.add(t);
    resolve(t);
  })
}

/**
 * 添加背景图
 * @param {string} url - 图片地址
 * @param {object} options - 配置
 * @param {function} callback - 回调函数
 */
export function handleBackground(renderer, url, options = {}) {
  return _handleBackgroundAndOverlay(renderer, url, options, 'background');
}

/**
 * 添加遮盖图
 * @param {string} url - 图片地址
 * @param {object} options - 配置
 * @param {function} callback - 回调函数
 */
export function handleOverlay(renderer, url, options = {}) {
  return _handleBackgroundAndOverlay(renderer, url, options, 'overlay');
}

function _handleBackgroundAndOverlay(renderer, url, options = {}, type) {
  return new Promise((resolve) => {
    const { instance, canvasWidth } = renderer;
    fabric.Image.fromURL(url, img => {
      img.scaleToWidth(canvasWidth)
      img.set(Object.assign({
        left: 0,
        top: 0,
        globalCompositeOperation: 'source-over'
      }, options));

      // 背景
      if (type === 'background') {
        instance.setBackgroundImage(img, instance.renderAll.bind(instance));
      }

      // 遮盖
      if (type === 'overlay') {
        instance.setOverlayImage(img, instance.renderAll.bind(instance));
      }

      resolve(img);
    }, {
      crossOrigin: 'Anonymous'
    });
  })
}
