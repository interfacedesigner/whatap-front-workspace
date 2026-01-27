const defaultOptions = {
  type: 'EqualizerChart',
  xAxis: {
    tick: {
      display: true,
    },
    width: false,
  },
  yAxis: {
    tick: {
      display: true,
    },
    maxValue: false,
    plots: false,
    height: false,
  },
  format: {
    value: (value: number) => {
      return value;
    },
  },
  common: {
    singleLine: false,
    highLightMaxValue: true,
    maxValueText: false,
    textCuttingDirection: true,
    animate: true,
    offset: {
      top: 15,
      bottom: 5,
    },
  },
};

export default defaultOptions;
