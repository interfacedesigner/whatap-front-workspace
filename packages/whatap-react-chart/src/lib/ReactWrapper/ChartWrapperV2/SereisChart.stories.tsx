import { Meta, StoryObj } from '@storybook/react-vite';
import { cloneDeep } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';

import ChartWrapperV2 from './ChartWrapperV2';

const DATA_COUNT = 5;
const INTERVAL = 5000;
const DURATION = INTERVAL * 12 * 10;

const createData = (duration: number = DURATION, interval: number = INTERVAL, dataCount = DATA_COUNT) => {
  const now = Math.floor(Date.now() / interval) * interval;

  const data = [];
  for (let i = 1; i <= dataCount; i++) {
    data.push({
      id: `Chart-Item-${i}`,
      key: `Chart-Item-${i}`,
      data: [] as Array<[number, number]>,
    });
    for (let time = now - duration; time <= now; time += interval) {
      data[i - 1].data.push([time, Math.floor(Math.random() * 100)]);
    }
  }

  return data;
};

const meta: Meta<typeof ChartWrapperV2> = {
  title: 'SeriesChart',
  component: ChartWrapperV2,
};

export default meta;

const Comp = (props) => {
  const [data, setData] = useState();
  const [updateData, setUpdateData] = useState();
  const options = useMemo(() => {
    const nextOptions = cloneDeep(props.options || {});
    // const endTime = Date.now();
    // const postRender = { startTime: endTime - DURATION, endTime };
    // if (nextOptions.common) {
    //   nextOptions.common.postRender = postRender;
    // } else {
    //   nextOptions.common = { postRender };
    // }
    return nextOptions;
  }, [props.options, updateData]);

  useEffect(() => {
    setData(createData());
    setInterval(() => {
      setUpdateData(createData(INTERVAL));
    }, INTERVAL);
  }, []);
  return <ChartWrapperV2 {...props} data={data} updateData={updateData} options={options} />;
};

type Story = StoryObj<typeof ChartWrapperV2>;
export const LineChart: Story = {
  render: (args) => <Comp {...args} />,
  args: {
    type: 'LineChartV2',
    data: [],
    options: {
      xAxis: {
        tick: {
          format: () => {
            return 'aa';
          },
        },
        timeDiff: DURATION,
        isLive: true,
      },
      common: {
        updateAnimation: true,
      },
    },
  },
};

export const StackChart: Story = {
  render: (args) => <Comp {...args} />,
  args: {
    type: 'LineChartV2',
    data: [],
    options: {
      xAxis: {
        timeDiff: DURATION,
        isLive: true,
      },
      tooltip: {
        selectAll: true,
      },
      common: {
        stack: true,
        updateAnimation: true,
      },
    },
  },
};

export const AreaChart = {
  render: (args) => <Comp {...args} />,
  args: {
    type: 'LineChartV2',
    data: [],
    options: {
      xAxis: {
        timeDiff: DURATION,
        isLive: true,
      },
      common: {
        area: true,
        updateAnimation: true,
      },
    },
  },
};

const HOUR_24 = 24 * 60 * 60 * 1000;
const MIN = 60 * 1000;
const MIN_5 = MIN * 5;

const timeToDayStart = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};
const timeToDayEnd = (timestamp: number) => {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
};

const createDayDiffData = (diffDay: number = 1, interval: number = INTERVAL) => {
  const now = Math.floor(Date.now() / interval) * interval;

  const refDayStart = timeToDayStart(now);
  // const refDayEnd = timeToDayEnd(now)

  const data = [
    {
      id: `Chart-Item-reference`,
      key: `Chart-Item-reference`,
      data: [],
    },
  ];

  for (let time = refDayStart; time <= now; time += interval) {
    data[0].data.push([time, Math.floor(Math.random() * 100)]);
  }

  if (diffDay > 0) {
    const diffDayTime = now - diffDay * HOUR_24;

    const diffDayStart = timeToDayStart(diffDayTime);
    const diffDayEnd = timeToDayEnd(diffDayTime);

    data.push({
      id: `Chart-Item-diff`,
      key: `Chart-Item-diff`,
      data: [],
    });

    for (let time = diffDayStart; time <= diffDayEnd; time += interval) {
      data[1].data.push([time, Math.floor(Math.random() * 100)]);
    }
  }

  return data;
};

export const DayDiffChart = {
  render: (props) => {
    const [data, setData] = useState();
    const [updateData, setUpdateData] = useState();

    const options = useMemo(() => {
      const nextOptions = cloneDeep(props.options || {});
      return nextOptions;
    }, [props.options, updateData]);

    useEffect(() => {
      setData(createDayDiffData(1, MIN_5));
      setInterval(() => {
        setUpdateData(createDayDiffData(0, MIN_5));
      }, MIN_5);
    }, []);
    return <ChartWrapperV2 {...props} data={data} updateData={updateData} options={options} />;
  },
  args: {
    type: 'LineChartV2',
    data: [],
    options: {
      xAxis: {
        dayDiff: true,
      },
      common: {
        area: true,
      },
      tooltip: {
        selectAll: true,
      },
    },
  },
};
