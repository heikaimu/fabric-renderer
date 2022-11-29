/*
 * @Date: 2022-11-24 10:29:18
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-11-24 17:40:38
 * @FilePath: /fabric-renderer-js/lib/math.js
 */
export class Matrix {
  constructor() {
    this.grid = [];
  }

  forEach(callback) {
    this.grid.forEach((column, x) => {
      column.forEach((value, y) => {
        callback(value, x, y);
      });
    });
  }

  get(x, y) {
    const col = this.grid[x];
    if (col) {
      return col[y];
    }
    return undefined;
  }

  set(x, y, value) {
    if (!this.grid[x]) {
      this.grid[x] = [];
    }

    this.grid[x][y] = value;
  }

  clear() {
    this.grid = [];
  }
}
