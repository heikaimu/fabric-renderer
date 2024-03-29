import { Matrix } from './math'
import { fabric } from 'fabric'
import dayjs from 'dayjs';

// 周
const WEEKS = [
  { text: 'Sun', fullText: 'Sunday' },
  { text: 'Mon', fullText: 'Monday' },
  { text: 'Tue', fullText: 'Tuesday' },
  { text: 'Wed', fullText: 'Wednesday' },
  { text: 'Thu', fullText: 'Thursday' },
  { text: 'Fri', fullText: 'Friday' },
  { text: 'Sat', fullText: 'Saturday' },
]

// 月
const MONTHS = [
  { text: 'Jan', fullText: 'January' },
  { text: 'Feb', fullText: 'February' },
  { text: 'Mar', fullText: 'March' },
  { text: 'Apr', fullText: 'April' },
  { text: 'May', fullText: 'May' },
  { text: 'Jun', fullText: 'June' },
  { text: 'Jul', fullText: 'July' },
  { text: 'Aug', fullText: 'August' },
  { text: 'Sept', fullText: 'September' },
  { text: 'Oct', fullText: 'October' },
  { text: 'Nov', fullText: 'November' },
  { text: 'Dec', fullText: 'December' },
]

/**
 * 日历矩阵渲染
 */
export class CalendarMatrix {
  grid = new Matrix();
  weeks = WEEKS;
  months = MONTHS;
  ratio = 0.7;
  date;
  icon;
  size;
  fontSize;
  color;
  fontFamily;
  canvas;

  constructor({ icon, size = 50, color = '#ffffff', fontFamily }) {
    this.icon = icon;
    this.size = size;
    this.fontSize = size / 3;
    this.color = color;
    this.fontFamily = fontFamily;
  }

  async render(date) {
    this.date = date;
    this.grid.clear();
    this.setMatrix();
    this.instanceCanvas();
    await this.renderMatrix();
    this.renderMonth();
    this.renderYear();
    return Promise.resolve(this.generateUrl());
  }

  // 构造网格
  setMatrix() {
    this._setMatrixWeek();
    this._setMatrixDay();
  }

  // 实例化fabric
  instanceCanvas() {
    this.canvas = new fabric.Canvas('', {
      width: this.size * this.grid.grid.length,
      height: this.size * this.ratio * this.grid.grid[0].length
    });
  }

  // 渲染网格
  renderMatrix() {
    return new Promise((resolve) => {
      fabric.Image.fromURL(this.icon, img => {

        this.grid.forEach((value, x, y) => {
          // 标记日期添加图标
          if (value.mark) {
            this._renderIcon(img, x, y);
          }

          // 日期周渲染
          if (value.text) {
            this._renderText(value, x, y);
          }
        })

        resolve()

      }, {
        crossOrigin: 'Anonymous'
      });
    })
  }

  // 渲染月
  renderMonth() {
    const curMonth = this.months[dayjs().get('month')];
    if (curMonth) {
      this._addText(curMonth.fullText, this.weeks.length * this.size / 3, this.size * this.ratio / 2, 1.4);
    }
  }

  // 渲染周
  renderWeek() {
    const curWeek = this.weeks[dayjs().get('day') - 1];
    if (curWeek) {
      this._addText(curWeek.fullText, this.weeks.length * this.size / 3 * 2, this.size * this.ratio / 2, 1.4);
    }
  }

  // 渲染年
  renderYear() {
    const curYear = dayjs(this.date).get('year')
    if (curYear) {
      this._addText(curYear, this.weeks.length * this.size / 3 * 2, this.size * this.ratio / 2, 1.4);
    }
  }

  // 生成图片
  generateUrl() {
    return this.canvas.toDataURL();
  }

  _renderIcon(img, x, y) {
    img.scaleToWidth(this.size);
    img.set({
      originX: 'center',
      originY: 'center',
      left: x * this.size + this.size / 2,
      top: y * (this.size * this.ratio) + (this.size * this.ratio) / 2,
    });

    this.canvas.add(img);
  }

  _renderText(value, x, y) {
    this._addText(
      value.text,
      x * this.size + this.size / 2,
      y * (this.size * this.ratio) + (this.size * this.ratio) / 2
    );
  }

  _setMatrixWeek() {
    this.weeks.forEach((text, x) => {
      const y = 1;
      this.grid.set(x, y, text);
    });
  }

  _setMatrixDay() {
    let start = dayjs(this.date).startOf('month').get('day');
    let len = dayjs(this.date).daysInMonth();
    let selectDay = dayjs(this.date).get('date');
    let cols = this.weeks.length;

    for (let i = start; i < len + start; i++) {
      const x = i % cols;
      const y = Math.floor(i / cols) + 2;
      const dayVal = i - start + 1;
      this.grid.set(x, y, {
        text: dayVal,
        mark: dayVal === selectDay
      });
    }
  }

  _addText(text, left, top, scale = 1) {
    const t = new fabric.Text(String(text), {
      left,
      top,
      fontSize: this.fontSize * scale,
      fontFamily: this.fontFamily,
      originX: 'center',
      originY: 'center',
      fill: this.color,
    });
    this.canvas.add(t);
  }

}
