import dayjs from 'dayjs';

const UNIX_TIMESTAMP = 1000;
const MINUTE_IN_SECONDS = 60;
const TEN_MINUTE_IN_MILLIS = 10 * MINUTE_IN_SECONDS * UNIX_TIMESTAMP;

const defaultOptions = {
  type: 'LineChart',
  xAxis: {
    maxPlot: 140, // 5 seconds interval for 10 minutes
    axisLine: {
      display: true,
      color: '#000000',
    },
    plotLine: {
      display: false,
      color: '#d9e2eb',
    },
    tick: {
      display: true,
      color: '#000000',
      borderWidth: 0,
      borderColor: '#FFFFFF',
    },
    isFixed: false,
    timeDiff: TEN_MINUTE_IN_MILLIS,
  },
  yAxis: {
    maxPlots: false,
    maxValue: 0,
    minValue: 0,
    plotCount: 10,
    autoPlotEnabled: true,
    fixedMin: true,
    fixedMax: true,
    textPosition: 'default',
    horizontalLine: false,
    tickFocusValue: false,
    axisLine: {
      display: false,
      color: '#000000',
    },
    plotLine: {
      display: true,
      color: '#d9e2eb',
    },
    tick: {
      display: true,
      color: '#000000',
      borderWidth: 0,
      borderColor: '#FFFFFF',
      format: function (d) {
        return d > 0 ? d.toFixed(0) : 0;
      },
    },
    unitDivider: 1000,
    integerOnly: false,
  },
  tooltip: {
    range: 1000,
    selectAll: false,
    // selectPattern: "id",
    time: {
      format: function (d) {
        return dayjs.unix(d / 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    label: {
      format: function (d) {
        return d;
      },
    },
    value: {
      format: function (d) {
        return d.toFixed(1);
      },
    },
    customTooltip: false,
  },
  common: {
    isStatic: false,
    disconnectThreshold: 20 * UNIX_TIMESTAMP,
    identicalDataBehavior: 'avg',
    offset: {
      right: 0,
      left: 0,
      top: 0,
      bottom: 0,
    },
    focus: false,
    drawHelper: false,
    area: false,
    areaByData: false,
    bringFocusFront: true,
    onTimeSelect: false,
    plotVerticalLine: false,
    plotMaxValue: false,
    drag: false,
    dragCallback: (x1, x2) => {
      console.log(x1, x2);
    },
    lineOptions: {},
    postRender: false,
  },
};

export default defaultOptions;
