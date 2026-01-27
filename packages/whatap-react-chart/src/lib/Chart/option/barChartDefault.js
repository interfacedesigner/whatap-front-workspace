const defaultOptions = {
  type: 'BarChart',
  horizontally: false,
  xAxis: {
    tick: {
      display: true,
      color: '#000000',
      borderWidth: 0,
      borderColor: '#FFFFFF',
    },
  },
  yAxis: {
    tick: {
      display: true,
    },
  },
  tooltip: {
    format: false,
  },
  common: {
    plotMaxValue: false,
    offset: {
      right: 0,
      left: 0,
      top: 3,
      bottom: 0,
    },
  },
};

export default defaultOptions;
