import { ChartType as ChartCollectionType } from '@lib/Chart/interfaces/BaseInterface';
import { throttle } from 'lodash-es';
import { useEffect, useId, useRef, useState } from 'react';

import { ChartCollection } from '../../Chart';
import { ChartCanvas, Wrapper } from './ChartWrapperV2.styles';
import { hasFrontRender } from './ChartWrapperV2.utils';

interface ChartWrapperV2Props<ChartType extends ChartCollectionType, DataType> {
  /**
   * 차트의 종류
   */
  type: ChartType;
  /**
   * 차트의 옵션
   * @todo
   * 차트별로 정의
   */
  options?: object;
  /**
   * 차트의 데이터
   * 변경시 데이터 초기화를 담당
   * @todo
   * 차트별로 정의
   */
  data?: DataType;
  updateData?: DataType;
  /**
   * 차트에 전달한 데이터를 변환하는 함수
   */
  manipulator?: (data: DataType) => any;
  /**
   *
   * @deprecated
   * 차트 데이터 업데이트 완료 콜백
   */
  onCbDataUpdate?: (chart: (typeof ChartCollection)[ChartType]) => void;
  /**
   *
   * @deprecated
   * 차트를 직접 다뤄야하는 경우
   */
  injectPlugin?: (chart: (typeof ChartCollection)[ChartType]) => void;
  /**
   * @deprecated
   */
  theme?: string;
  /**
   * @deprecated
   */
  customChartOptions?: any;
}

const ChartWrapperV2 = <ChartType extends ChartCollectionType, DataType>(
  props: ChartWrapperV2Props<ChartType, DataType>,
) => {
  const { type, options, data, updateData, manipulator, onCbDataUpdate, theme, customChartOptions, injectPlugin } =
    props;
  const canvasId = useId();
  const [chart, setChart] = useState<(typeof ChartCollection)[ChartType]>(null);
  const wrapperDom = useRef<HTMLDivElement>();
  const frontRender = hasFrontRender(type);

  useEffect(() => {
    const chart = new ChartCollection[type](canvasId, options || {});
    setChart(chart);

    return () => {
      if (chart?.chartWillUnmount) {
        chart.chartWillUnmount();
      }
      setChart(null);
    };
  }, [type]);

  useEffect(() => {
    if (wrapperDom.current) {
      const resizeObserver = new ResizeObserver(
        throttle((entries: Array<ResizeObserverEntry>) => {
          const entry = entries[0];
          if (entry && wrapperDom.current && chart) {
            chart.bcRect = entry.contentRect;
            chart.resizeCanvas(wrapperDom.current);
          }
        }, 200),
      );
      resizeObserver.observe(wrapperDom.current);

      return () => {
        resizeObserver.disconnect();
      };
    }

    return;
  }, [wrapperDom.current, chart]);

  useEffect(() => {
    if (theme && chart && chart.changeTheme) {
      chart.changeTheme(theme);
    }
  }, [theme, chart]);

  useEffect(() => {
    if (customChartOptions && chart && chart.setCustomChartOptions) {
      chart.setCustomChartOptions(customChartOptions);
    }
  }, [customChartOptions, chart]);

  useEffect(() => {
    if (options && chart && chart.calibrateChartProps) {
      chart.calibrateChartProps(options);
    }
  }, [options, chart]);

  useEffect(() => {
    if (chart && data) {
      try {
        chart.loadData?.(manipulator ? manipulator(data) : data);
        onCbDataUpdate?.(chart);
      } catch (e) {
        console.error('ChartWrapperV2 data Effect Error', e, data);
      }
    }
  }, [data, chart]);

  useEffect(() => {
    if (chart && updateData) {
      try {
        const updateDataFunction = chart.updateData || chart.loadData;
        updateDataFunction?.(manipulator ? manipulator(updateData) : updateData);
        onCbDataUpdate?.(chart);
      } catch (e) {
        console.error('ChartWrapperV2 updateData Effect Error', e, updateData);
      }
    }
  }, [updateData, chart]);

  useEffect(() => {
    if (injectPlugin && chart) {
      injectPlugin(chart);
    }
  }, [chart]);

  return (
    <Wrapper ref={(dom) => (wrapperDom.current = dom!)}>
      <ChartCanvas id={canvasId} />
      {frontRender ? <ChartCanvas id={canvasId + '_front'} /> : null}
    </Wrapper>
  );
};

export default ChartWrapperV2;
