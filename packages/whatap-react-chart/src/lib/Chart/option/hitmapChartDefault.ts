import dayjs from 'dayjs';

const defaultOptions = {
  type: 'HitmapChart',
  xAxis: {
    tick: {
      display: true,
      format: (d: number) => {
        return dayjs(d).format('HH:mm');
      },
    },
    gridLine: {
      display: true,
      interval: 4,
    },
  },
  yAxis: {
    maxValue: 10000,
    tick: {
      display: true,
      maxTicks: 5,
      format: (d: number) => {
        return d / 1000 || 0;
      },
    },
    gridLine: {
      display: true,
      interval: 4,
    },
  },
  common: {
    postRender: false,
  },
  hitmap: {
    isStatic: false,
    onSelect: false,
    interval: 5000,
    duration: 10 * 60 * 1000,
    endTime: new Date().getTime(),
    columnBlockCount: 40,
    errorOnly: false,
    level: {
      hit: [0, 150, 300],
      err: [0, 3, 6],
    },
    color: {
      hit: ['#2196f3', '#1565c0', '#1a237e'],
      err: ['#f9a825', '#ef6c00', '#d50000'],
    },
    autoScale: false,
  },
};

export default defaultOptions;
