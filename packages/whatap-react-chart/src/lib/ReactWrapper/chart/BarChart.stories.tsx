import { Meta, StoryObj } from '@storybook/react-vite';
import dayjs from 'dayjs';

import ChartWrapper from './ChartWrapper';

const meta: Meta<typeof ChartWrapper> = {
  title: 'ChartWrapper',
  component: ChartWrapper,
};

export default meta;

const time = {
  stime: 1713452400000,
  etime: 1713538799999,
};

const list = [
  {
    time: 1713470400000,
    sqlcnt: 1,
  },
  {
    time: 1713474000000,
    sqlcnt: 1,
  },
];

/** 1시간 단위로 데이터가 없다면 0 채우기 */
export const fillDataGaps = (time: any, data: any): Array<[number, number]> => {
  const { stime, etime } = time;
  const result = [];

  for (let timestamp = stime; timestamp <= etime; timestamp += 3600000) {
    // 데이터 배열에서 현재 timestamp를 찾습니다.
    const found = data.find((d) => d.time === timestamp);

    // 해당 timestamp에 대한 데이터가 있는지 확인하고, 없다면 sqlcnt 0으로 할당합니다.
    result.push([timestamp, found && found.sqlcnt ? found.sqlcnt : 0] as [number, number]);
  }

  console.log(result);

  return result;
};

export const formatBarChartData = (data: Array<[number, number]>) => {
  /** id가 다른 경우 차트가 다른 색상으로 표시됨 */
  const chartId = 'accessCount';

  if (!(data && Array.isArray(data))) {
    return [];
  }
  return data.map(([time, value]) => ({
    key: time,
    data: [
      {
        id: chartId,
        key: time,
        data: value,
      },
    ],
  }));
};

const barChartManipulator = (data: any) => {
  const fillAllTimeData = fillDataGaps(time, data);
  return formatBarChartData(fillAllTimeData);
};

const options = {
  common: {
    postRender: {
      startTime: time.stime,
      endTime: time.etime,
    },
    plotMaxValue: true,
    plotMaxText: true,
  },
  xAxis: {
    tick: {
      display: true,
      format: (time: number) => dayjs(time).format('HH'),
    },
  },
  tooltip: {
    format: (key: string, data: object) => {
      return `${dayjs(key).format('HH')} - ${data.data}`;
    },
  },
};

type Story = StoryObj<typeof ChartWrapper>;
export const Default: Story = {
  render: () => (
    <ChartWrapper id='barChart' type='BarChart' data={list} options={options} manipulator={barChartManipulator} />
  ),
};
