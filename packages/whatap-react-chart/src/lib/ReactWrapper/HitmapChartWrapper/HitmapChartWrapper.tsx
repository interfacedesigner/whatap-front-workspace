import { HitmapDataset } from '@lib/Chart/interfaces/HitmapInterface';
import type { HitmapSelectedArea } from '@lib/Chart/interfaces/HitmapInterface';
import React, { CSSProperties, Fragment, useContext, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IntlProvider } from 'react-intl';

import { loadFromStorage, saveToStorage } from '../../core/LocalStorageHandler';
import ChartWrapperV2 from '../ChartWrapperV2';
import ThemeContext from '../context/ThemeContext';
import {
  HitmapChartWrapperStyle,
  HitmapOptionWrapperStyle,
  HitmapPortalWrapperStyle,
  WrapperStyle,
} from './HitmapChartWrapper.meta';
import HitmapOptions from './components/HitmapOptions';
import locale from './locale/locale.json';

export type ShiftDirection = 'left' | 'right';
export type ScaleDirection = 'up' | 'down';

export const StorageKey = {
  maxValue: '.maxValue',
  autoScale: '.autoScale',
} as const;

export interface HitmapChartOption {
  hitmap: {
    /** 해당 옵션 활성화시 계속 차트를 다시 그리며, 데이터에 시간에 맞춰서 표시되도록 한다. */
    isStatic: boolean;
    onSelect: (selectArea: HitmapSelectedArea) => void;
  };
}

export interface HitmapChartProps<T> {
  /** 최외각 Wrapper Dom의 ClassName */
  className?: string;
  data?: T;
  updateData?: T;
  /** AutoScale 여부 */
  autoScale?: boolean;
  /** 카운트 표시할지 여부 */
  showCount?: boolean;
  /** 에러만 보기 */
  errorOnly?: boolean;
  /** 좌우 이동 버튼 클릭 */
  shiftFunc?: (direction: ShiftDirection) => void;
  /** Error Only 버튼 클릭 */
  toggleErrorOnly?: (nextState: boolean) => void;
  /** data, updateData 를 가공 */
  manipulator?: (data: T) => HitmapDataset | undefined;
  /**
   * @description
   * HitmapOption 이 렌더링될 돔의 ClassName
   * @todo 포탈이 아닌 ref를 등록하는 등의 방법으로 하는게 더 안전할듯함
   */
  optionsPosition?: string;
  /**
   * Hitmap 버튼들의 Wrapper의 스타일
   */
  buttonStyle?: CSSProperties;
  /** Hitmap 관련 상태를 저장할 Storage의 Key */
  storageId?: string;
  initialData?: HitmapSelectedArea;
  /** 드래그 영역 초기화 트리거 (값이 변경되면 드래그 영역이 초기화됨) */
  resetSelectionTrigger?: number | string;
  options: {};
}

const HitmapChartWrapper = <T,>(props: HitmapChartProps<T>): React.ReactElement => {
  const {
    className,
    data,
    updateData,
    manipulator,
    optionsPosition,
    shiftFunc,
    autoScale,
    storageId,
    errorOnly = false,
    toggleErrorOnly,
    showCount = false,
    initialData,
    resetSelectionTrigger,
    options,
  } = props;
  const themeAttrs = useContext(ThemeContext);
  const theme = themeAttrs.themeKey;

  const optionContainer = optionsPosition && document.getElementsByClassName(optionsPosition)[0];
  const maxValueStorageID = storageId + StorageKey.maxValue;
  const autoScaleStorageID = storageId + StorageKey.autoScale;

  const storageValue = storageId ? loadFromStorage(autoScaleStorageID) : false;
  const ui_11st_default_autoscale = window.__whatap__?.ui_11st_hitmap_autoscale_default_off ? false : true;
  const [autoScaleSw, setAutoScaleSw] = useState(storageValue ? storageValue !== 'false' : ui_11st_default_autoscale);
  const [errorOnlySw, setErrorOnlySw] = useState(errorOnly);
  const wrapperRef = useRef<HTMLDivElement>();
  const id = useId();
  const [chart, setChart] = useState<any>(null);

  useEffect(() => {
    setErrorOnlySw(errorOnly);
  }, [errorOnly]);

  useEffect(() => {
    if (chart) {
      chart.setErrorOnly(errorOnlySw);
    }
  }, [errorOnlySw, chart]);

  useEffect(() => {
    if (chart) {
      chart.setSelectRect(initialData);
    }
  }, [initialData, chart]);

  useEffect(() => {
    if (chart) {
      chart.setSelectRect(undefined);
    }
  }, [data, chart]);

  useEffect(() => {
    if (chart && resetSelectionTrigger !== undefined) {
      chart.setSelectRect(undefined);
    }
  }, [resetSelectionTrigger, chart]);

  const toggleErrorOnlyClick = () => {
    const nextState = !errorOnlySw;
    setErrorOnlySw(nextState);
    toggleErrorOnly?.(nextState);
  };

  useEffect(() => {
    const maxValue = storageId ? loadFromStorage(maxValueStorageID) : 0;
    if (maxValue && chart) {
      chart.setInitalYAxisValue(Number(maxValue));
    }
  }, [storageId, chart]);

  useEffect(() => {
    if (storageId) {
      saveToStorage(autoScaleStorageID, autoScaleSw);
    }
    if (chart) {
      chart.calibrateChartProps({ hitmap: { autoScale: autoScaleSw } });
      if (autoScaleSw) {
        chart.loadDataAfter();
        chart.drawChart();
      }
    }
  }, [autoScaleSw, chart]);

  const hitmapDirection = (direction: ScaleDirection) => {
    if (chart) {
      if (autoScaleSw) {
        setAutoScaleSw(false);
      }
      chart.setYAxisValue(direction);
      if (storageId) {
        saveToStorage(maxValueStorageID, chart.config.yAxis.maxValue);
      }
    }
  };

  const [dataCount, setDataCount] = useState({ totHit: 0, totErr: 0 });

  const updateDataCount = (chart) => {
    let totHit = 0;
    let totErr = 0;

    if (chart?.data) {
      const data = chart.data;

      data.map((datum, index) => {
        datum.map((counts, i) => {
          if (i) {
            counts.map((count, j) => {
              if (i === 1) {
                totHit += count;
              } else {
                totErr += count;
              }
            });
          }
        });
      });
    }

    setDataCount({
      totHit,
      totErr,
    });
  };

  const localeCode = window.lang || 'en';

  const chartComponent = (
    <ChartWrapperV2
      id={id}
      data={data}
      updateData={updateData}
      manipulator={manipulator}
      type='HitmapChart'
      options={options}
      onCbDataUpdate={updateDataCount}
      theme={theme}
      themeAttrs={themeAttrs}
      injectPlugin={(chartObj) => {
        if (chart !== chartObj) {
          setChart(chartObj);
        }
      }}
    />
  );

  const optionComponent = (
    <HitmapOptions
      showCount={showCount}
      dataCount={dataCount}
      autoScale={autoScale}
      shiftFunc={shiftFunc}
      autoScaleSw={autoScaleSw}
      hitmapDirection={hitmapDirection}
      toggleAutoScaleClick={() => setAutoScaleSw(!autoScaleSw)}
      errorOnlySw={errorOnlySw}
      toggleErrorOnlyClick={toggleErrorOnlyClick}
    />
  );

  return (
    <IntlProvider locale={localeCode} messages={locale[localeCode] || locale.en}>
      <div
        className={className}
        style={WrapperStyle}
        ref={(ref) => {
          if (ref) {
            wrapperRef.current = ref;
          }
        }}
      >
        {optionContainer ? (
          <Fragment>
            {createPortal(<div style={HitmapPortalWrapperStyle}>{optionComponent}</div>, optionContainer)}
            {chartComponent}
          </Fragment>
        ) : (
          <>
            <div style={HitmapOptionWrapperStyle}>{optionComponent}</div>
            <div style={HitmapChartWrapperStyle}>{chartComponent}</div>
          </>
        )}
      </div>
    </IntlProvider>
  );
};

export default HitmapChartWrapper;
