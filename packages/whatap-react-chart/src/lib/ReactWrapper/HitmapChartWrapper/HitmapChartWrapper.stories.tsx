import { HitmapDataset } from '@lib/Chart/interfaces/HitmapInterface';
import { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useRef, useState } from 'react';

import HitmapChartWrapper, { type HitmapChartProps } from './HitmapChartWrapper';
import getHitmapData, { type HitmapResData } from './HitmapChartWrapper.mock';

const meta: Meta<HitmapChartProps<HitmapResData>> = {
  title: 'HitmapChartWrapper',
  component: HitmapChartWrapper,
};

export default meta;

type Story = StoryObj<HitmapChartProps<HitmapResData>>;

export const Default: Story = {
  render: HitmapChartWrapper,
  argTypes: {},
  args: {
    shiftFunc: console.log,
    manipulator: (data) => {
      const hitmapData: HitmapDataset = { hit: [], err: [] };
      (data as HitmapResData).forEach(([time, hit, err]) => {
        if (hit) {
          hitmapData.hit.push([time, hit]);
        }
        if (err) {
          hitmapData.err.push([time, err]);
        }
      });
      return hitmapData;
    },
    storageId: 'Storybook',
    autoScale: true,
    showCount: true,
    data: getHitmapData(),
    options: {
      hitmap: { isStatic: true, onSelect: console.log },
    },
  },
};

export const Shift: Story = {
  render: (props) => {
    const [time, setTime] = useState(() => {
      const etime = Date.now();
      const stime = etime - 1000 * 60 * 10;

      return { etime, stime };
    });

    const hitmapData = useMemo(() => {
      const data: Array<[number, Array<number>, Array<number> | undefined]> = [];
      let curTime = time.stime;

      while (curTime <= time.etime) {
        curTime += 5000;
        const hit: Array<number> = [];
        const err: Array<number> | undefined = Math.random() > 0.1 ? [] : undefined;
        for (let idx = 0; idx < 120; idx++) {
          hit[idx] = Math.floor(Math.random() * 1.1);
          if (err) {
            err[idx] = Math.floor(Math.random() * 1.01);
          }
        }
        data.push([curTime, hit, err]);
      }

      return data;
    }, [time]);

    return (
      <HitmapChartWrapper
        {...props}
        shiftFunc={(direction) => {
          let etime = time.etime;
          if (direction === 'left') {
            etime -= 1000 * 60 * 10;
          } else {
            etime += 1000 * 60 * 10;
          }

          const stime = etime - 1000 * 60 * 10;

          setTime({ etime, stime });
        }}
        data={hitmapData}
      />
    );
  },
  argTypes: {},
  args: {
    manipulator: (data) => {
      const hitmapData: HitmapDataset = { hit: [], err: [] };
      (data as HitmapResData).forEach(([time, hit, err]) => {
        if (hit) {
          hitmapData.hit.push([time, hit]);
        }
        if (err) {
          hitmapData.err.push([time, err]);
        }
      });
      return hitmapData;
    },
    storageId: 'Storybook',
    autoScale: true,
    showCount: true,
    options: {
      hitmap: { isStatic: true, onSelect: console.log },
    },
  },
};

export const Update: Story = {
  render: (props) => {
    const [time, setTime] = useState(() => {
      const etime = Date.now();
      const stime = etime - 1000 * 60 * 10;

      return { etime, stime };
    });

    const prevData = useRef<Array<[number, Array<number>, Array<number> | undefined]>>();
    const hitmapData = useMemo(() => {
      const data: Array<[number, Array<number>, Array<number> | undefined]> = [];

      let curTime = time.stime;
      if (prevData.current) {
        prevData.current.forEach((d) => {
          const [dataTime] = d;
          if (dataTime < time.stime) {
            return;
          }

          data.push(d);
          curTime = dataTime;
        });
      }

      while (curTime <= time.etime) {
        curTime += 5000;
        const hit: Array<number> = [];
        const err: Array<number> | undefined = Math.random() > 0.1 ? [] : undefined;
        for (let idx = 0; idx < 120; idx++) {
          hit[idx] = Math.floor(Math.random() * 1.1);
          if (err) {
            err[idx] = Math.floor(Math.random() * 1.01);
          }
        }
        data.push([curTime, hit, err]);
      }

      prevData.current = data;
      return data;
    }, [time]);

    useEffect(() => {
      const timmer = setInterval(() => {
        setTime((time) => {
          return {
            etime: time.etime + 5000,
            stime: time.stime + 5000,
          };
        });
      }, 1000);

      return () => clearInterval(timmer);
    }, []);

    return <HitmapChartWrapper {...props} data={hitmapData} />;
  },
  argTypes: {},
  args: {
    manipulator: (data) => {
      const hitmapData: HitmapDataset = { hit: [], err: [] };
      (data as HitmapResData).forEach(([time, hit, err]) => {
        if (hit) {
          hitmapData.hit.push([time, hit]);
        }
        if (err) {
          hitmapData.err.push([time, err]);
        }
      });
      return hitmapData;
    },
    storageId: 'Storybook',
    autoScale: true,
    showCount: true,
    options: {
      hitmap: { isStatic: true, onSelect: console.log },
    },
  },
};
