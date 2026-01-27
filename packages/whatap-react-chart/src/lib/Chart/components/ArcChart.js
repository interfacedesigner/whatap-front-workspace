/**
 * Whatap ArcChart
 * created by SungChul Won
 * All rights reserved to WhaTap Labs 2018
 */
import { CoreFunc } from '../../core';
import { getColorVariation } from '../helper/helper.color';
import { FONT_SIZE, FONT_TYPE } from '../meta/globalMeta';
import { getScreenRatio } from '../util/displayModulator';
import AbstractChart from './AbstractChart';

class ArcChart extends AbstractChart {
  constructor(bindId, options) {
    super(bindId, options);

    this.initCanvas();
  }

  initCanvas = () => {
    this.wGetBoundingClientRect(this.canvas);
    this.ratio = getScreenRatio(this.ratio);

    let width = this.bcRect.width;
    let height = this.bcRect.height;

    this.canvas.width = width * this.ratio;
    this.canvas.height = height * this.ratio;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.ctx.scale(this.ratio, this.ratio);
  };

  changeTheme = (theme) => {
    this.setTheme(theme);
  };

  setTheme = (theme) => {
    if (typeof theme === 'undefined' || this.themePalette[theme] === 'undefined') {
      theme = 'wh';
    }

    this.theme = this.themePalette[theme];
    this.themeId = theme;
  };

  loadData = (dataset) => {
    const that = this;
    const themeId = this.themeId;
    this.total = 0;
    this.maxValue = 0;

    if (dataset.length > 0) {
      this.data.clear();
      dataset.forEach((ds, idx) => {
        let colorValue = that.palette.getChartColorFromId(ds.id, themeId);
        let strokeValue = colorValue;
        let fillValue = getColorVariation(colorValue, { a: 0.2 });
        if (ds.data > this.maxValue) {
          this.maxValue = ds.data;
        }
        this.total += ds.data;
        that.data.put(ds.key, { id: ds.id, label: ds.label, data: ds.data, color: strokeValue, fill: fillValue });
      });
    }

    this.drawChart();
  };

  drawChart = () => {
    const { ctx, config, total, bcRect, data, maxValue } = this;
    const semiCircle = config.semiCircle;
    const title = config.title || 'Data';
    ctx.save();
    const width = bcRect.width; // Canvas Width
    const circleWidth = 0.3; // Cirle weight 0 ~ 1
    const halfWidth = width / 2;
    const x = halfWidth; // Center of circle xAxis
    const height = bcRect.height; // Canvas Height
    const halfHeight = height / 2;
    const y = semiCircle ? height : halfHeight; // Center of circle yAxis
    const diameter = semiCircle ? (width > height * 2 ? height * 2 : width) : width > height ? height : width; // Diameter of circle
    const textMax = diameter * (0.9 - circleWidth); // Text Wrapper Width
    const lengthPI = semiCircle ? Math.PI : Math.PI * 2;
    const radius = diameter / 2;
    const circleInner = radius * 0.7; // Use to draw the inner line of circle

    ctx.clearRect(0, 0, width, height);
    let en = data.keys();

    let thisRadian = semiCircle ? Math.PI : -(Math.PI / 2);
    if (!total) {
      // totla === 0 || data empty
      ctx.beginPath();
      ctx.fillStyle = 'rgba(216, 216, 216, 1)';
      const nextRadian = thisRadian + Math.PI * 2;
      ctx.arc(x, y, radius, thisRadian, nextRadian, false);
      ctx.fill();
    } else {
      while (en.hasMoreElements()) {
        //Draw arc
        const key = en.nextElement();
        const value = data.get(key);
        const dataValue = value.data >= 0 ? value.data : 0;
        const percent = dataValue / total;
        const maxValPercent = dataValue / maxValue;
        const nextRadian = thisRadian + lengthPI * percent;
        ctx.beginPath();
        ctx.fillStyle = value.color;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius * 0.75 + maxValPercent * (radius * 0.25), thisRadian, nextRadian, false);
        // ctx.arc(x, y, circleInner, nextRadian, thisRadian, true);
        ctx.lineTo(x, y);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        thisRadian = nextRadian;
      }
    }

    ctx.font = `13px ${FONT_TYPE}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';

    let lineHeight = 13 * 1.2;
    let words = title.split(' ');
    let line = '';
    let textY = y + (semiCircle ? -15 : 5);
    const wordsLength = words.length;
    let newLine = false;
    for (let i = 0; i < wordsLength; i++) {
      //Long text \n function
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > textMax && line !== '') {
        // max 2 line
        ctx.save();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.strokeText(line, x, textY - lineHeight / 2);
        ctx.strokeText(title.replace(line, ''), x, textY + lineHeight / 2);
        ctx.restore();
        ctx.fillText(line, x, textY - lineHeight / 2);
        ctx.fillText(title.replace(line, ''), x, textY + lineHeight / 2);
        newLine = true;
        break;
      } else {
        line = testLine;
      }
    }

    if (!newLine) {
      ctx.save();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.strokeText(title, x, textY);
      ctx.restore();
      ctx.fillText(title, x, textY);
    }

    ctx.restore();
  };

  // resizeCanvas = (mainDiv, cvHeight) => {
  //   console.log('resizeCanvas !!! ', mainDiv, cvHeight);
  // }
}

export default ArcChart;
