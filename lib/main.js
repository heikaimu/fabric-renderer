/*
 * @Date: 2022-05-17 10:05:16
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-11-19 13:10:12
 * @FilePath: /fabric-renderer-js/lib/main.js
 */
import Renderer, {fabric} from './index';
import { data } from './mock';

const annexUrl = 'https://cdn.shopifycdn.net/s/files/1/0510/1423/8379/files/4_3816223d-a04c-469c-9225-7ca488db2a5d.png?v=1622082533';
const bgUrl = 'https://sunzi7n.myuxc.com/sunzi/1594866172095.png';
const bgAnimalUrl = 'https://cdn.shopifycdn.net/s/files/1/0510/1423/8379/files/1598957ed24441c515af24f3bc5faac2_e7e99901-8ca6-48d6-b483-7c218e9703fd.png?v=1623061440';
// const overUrl = 'https://cdn.shopifycdn.net/s/files/1/0510/1423/8379/files/1_7b4f59fb-ecaf-4624-8c81-ece02730b0f0.png?v=1622082533';
const avatarUrl = 'https://cdn.shopify.com/s/files/1/0343/0275/4948/files/yanzhu.png?v=1652770760';
const svgUrl = 'https://cdn.shopifycdn.net/s/files/1/0510/1423/8379/files/c9ab3de818e54ee83338537021b4e538_85035b24-be5e-4184-aefb-e2de3ef48312.svg?v=1623061439';
const virtualUrl = 'https://cdn.shopifycdn.net/s/files/1/0343/0275/4948/files/vFace.png?v=1634089968';

const testShadow = 'https://assets.sunzi.cool/preload/movie-poster/mask/BL1499/BL1499-4.png?imageMogr2/thumbnail/800x|imageslim';
const testBg = 'https://assets.sunzi.cool/preload/movie-poster/BL1499/BL1499-4.jpg?imageMogr2/thumbnail/800x|imageslim';
const testPerson = 'https://cdn.shopify.com/s/files/1/0343/0275/4948/files/b97e5505-96bd-45a2-b13a-5e7b477fce9c.png?v=1664267441';

const renderer = new Renderer('canvas', {
  width: 400,
  height: 500,
  scale: 1,
  configurable: true,
  selection: true
})

renderer.instance.on('mouse:down', (e) => {
  console.log(e.target && e.target.customType);
})

document.getElementById('imageButton').addEventListener('click', () => {
  renderer.addImage(testShadow, {
    customType: 'annex',
    customTL: 'delete',
    width: 100
  }, {
    active: false,
    center: false,
    boardOpen: false,
    controlStyle: true
  });
})

document.getElementById('avatarButton').addEventListener('click', () => {
  renderer.addImage(testPerson, {
    customType: 'avatar',
    customTL: 'replace'
  });
})

document.getElementById('virtualButton').addEventListener('click', () => {
  renderer.addImage(virtualUrl, {
    customType: 'virtual',
    customTL: 'replace'
  });
})

document.getElementById('textButton').addEventListener('click', () => {
  renderer.addText('Hello World', {
    customType: 'text',
    customActive: true,
    customTL: 'delete'
  });
})

document.getElementById('rectButton').addEventListener('click', () => {
  renderer.addRect({

  });
})

document.getElementById('bgButton').addEventListener('click', () => {
  renderer.addBackground(testBg);
})

document.getElementById('overButton').addEventListener('click', () => {
  renderer.addOverlay(testBg, {
    globalCompositeOperation: 'destination-over'
  });
})

document.getElementById('svgButton').addEventListener('click', () => {
  renderer.addSVG(svgUrl, {
    customActive: true
  });
})

document.getElementById('toJSON').addEventListener('click', () => {
  console.log(renderer.toJSON());
})

document.getElementById('toDataURL').addEventListener('click', () => {
  console.log(renderer.toDataURL(2));
})

document.getElementById('scaleUp').addEventListener('click', () => {
  renderer.setZoom(2);
})

document.getElementById('scaleDown').addEventListener('click', () => {
  renderer.setZoom(1);
})

document.getElementById('brightness').addEventListener('click', () => {
  console.log('fabric', fabric)
  // applyFilterValue(1, 'brightness', val);
  // const f = fabric.Image.filters;
  // applyFilter(1, new f.Brightness({
  //   brightness: 0.3
  // }));
})


renderer.loadFromJSON(data, (instance, object) => {
  // if (['path', 'rect', 'text'].includes(object.type)) {
  //   object.set({
  //     selectable: false
  //   })
  // }
});


function applyFilter(index, filter) {
  var obj = renderer.instance.getActiveObject();
  obj.filters[index] = filter;
  obj.applyFilters();
  console.log(obj.filters)
  renderer.instance.renderAll();
}

function applyFilterValue(index, prop, value) {
  var obj = renderer.instance.getActiveObject();
  if (obj.filters[index]) {
    obj.filters[index][prop] = value;
    obj.applyFilters();
    renderer.instance.getActiveObject().height;
    renderer.instance.renderAll();
  }
}
