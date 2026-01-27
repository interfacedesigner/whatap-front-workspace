import { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';

import ChartWrapperV2 from './ChartWrapperV2';

const meta: Meta<typeof ChartWrapperV2> = {
  title: 'EqualizerChart',
  component: ChartWrapperV2,
};

const manipulator = (datas?) => {
  if (!datas) {
    return [];
  }
  const returnData = [];
  returnData.push({
    id: 'method',
    key: 'METHOD',
    data: [{ id: 'method', data: datas.method }],
  });

  returnData.push({
    id: 'sql',
    key: 'SQL',
    data: [{ id: 'sql', data: datas.sql }],
  });

  returnData.push({
    id: 'httpc',
    key: 'HTTPC',
    data: [{ id: 'httpc', data: datas.httpc }],
  });

  returnData.push({
    id: 'dbc',
    key: 'DBC',
    data: [{ id: 'dbc', data: datas.dbc }],
  });

  returnData.push({
    id: 'socket',
    key: 'SOCKET',
    data: [{ id: 'socket', data: datas.socket }],
  });

  return returnData;
};

export default meta;

const Comp = (props) => {
  const [data, setData] = useState({});
  useEffect(() => {
    setInterval(() => {
      setData({
        dbc: Math.floor(Math.random() * 100),
        httpc: Math.floor(Math.random() * 100),
        method: Math.floor(Math.random() * 100),
        socket: Math.floor(Math.random() * 100),
        sql: Math.floor(Math.random() * 100),
      });
    }, 2000);
  }, []);
  return <ChartWrapperV2 {...props} data={data} />;
};

type Story = StoryObj<typeof ChartWrapperV2>;
export const Default: Story = {
  render: (args) => <Comp {...args} />,
  args: {
    type: 'EqualizerChart',
    manipulator,
    data: {
      dbc: 7,
      httpc: 24,
      method: 16,
      socket: 0,
      sql: 1,
    },
  },
};
