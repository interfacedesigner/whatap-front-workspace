import { Meta, StoryObj } from '@storybook/react-vite';

import ChartWrapperV2 from './ChartWrapperV2';

const meta: Meta<typeof ChartWrapperV2> = {
  title: 'HorizontalBarChart',
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

type Story = StoryObj<typeof ChartWrapperV2>;
export const Default: Story = {
  render: (args) => <ChartWrapperV2 {...args} />,
  args: {
    type: 'HorizontalBarChart',
    manipulator,
    data: {
      dbc: 7,
      httpc: 24,
      method: 16,
      socket: 0,
      sql: 1,
    },
    options: {
      format: {
        value: (sum, dot) => {
          const dom = document.createElement('div');

          const mainText = document.createElement('div');
          mainText.innerText = sum;
          mainText.style.fontSize = '20px';
          mainText.style.fontWeight = 'bold';

          const subTitle = document.createElement('div');
          subTitle.innerText = 'DOT 정보';
          subTitle.style.fontSize = '13px';
          subTitle.style.fontWeight = '500';
          subTitle.style.marginTop = '6px';
          subTitle.style.marginBottom = '4px';

          const subText = document.createElement('div');
          subText.innerText = JSON.stringify(dot);
          subText.style.width = 'max-content';
          subText.style.maxWidth = '200px';
          subText.style.whiteSpace = 'pre-wrap';
          subText.style.wordBreak = 'break-word';

          dom.appendChild(mainText);
          dom.appendChild(subTitle);
          dom.appendChild(subText);

          return dom;
        },
      },
    },
  },
};
