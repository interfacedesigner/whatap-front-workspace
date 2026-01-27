import ICON_HITMAP_DOWN_BK from '@assets/svgs/hitmap-arr-down-bk.svg?react';
import ICON_HITMAP_DOWN from '@assets/svgs/hitmap-arr-down.svg?react';
import ICON_HITMAP_UP_BK from '@assets/svgs/hitmap-arr-up-bk.svg?react';
import ICON_HITMAP_UP from '@assets/svgs/hitmap-arr-up.svg?react';
import { ThemeAttrs } from '@lib/Chart/meta/defaultThemeMeta';
import ThemeContext from '@react/context/ThemeContext';
import React, { CSSProperties, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import type { ScaleDirection, ShiftDirection } from '../HitmapChartWrapper';

type HitmapCount = { totHit: number; totErr: number };

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const btnBoxStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: '6px',
  borderRadius: '2px',
  boxSizing: 'border-box',
  position: 'relative',
};

const IconWrap = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
  /* border: solid 1px ${(props) => props.theme.border_color_1}; */
  border-radius: 2px;
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin-right: 4px;
`;

interface TextToggleButtonProps {
  colorKey?: keyof ThemeAttrs;
}

const TextToggleButton = styled.div<TextToggleButtonProps>`
  font-size: 10px;
  padding: 1px 6px;
  margin: 0px 4px;
  color: ${(props) => (props.colorKey ? props.theme[props.colorKey] : props.theme.bg_normal_color)};
  border-radius: 4px;
  border: 1px solid ${(props) => (props.colorKey ? props.theme[props.colorKey] : props.theme.border_color_1)};
  background: ${(props) => props.theme.bg_color_component};
  cursor: pointer;
  height: 16px;
  display: flex;
  align-items: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const TextButtonBox = styled.div`
  margin-right: 6px;
  padding: 0px 2px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
`;

const ErrorCountSpan = styled.span`
  color: ${(props) => props.theme.bg_warning_color};
`;

const NormalCountSpan = styled.span`
  color: ${(props) => props.theme.normal_1};
`;

const ShiftButton = ({ shiftFunc }: { shiftFunc: (direction: ShiftDirection) => void }) => {
  const themeAttrs = useContext(ThemeContext);
  themeAttrs.ThemeKeys;
  const isBlack = themeAttrs.ThemeKeys === 'bk';

  return (
    <div style={btnBoxStyle}>
      <IconWrap style={{ transform: 'rotate(-90deg)' }} onClick={() => shiftFunc('left')}>
        {isBlack ? <ICON_HITMAP_UP_BK /> : <ICON_HITMAP_UP />}
      </IconWrap>
      <IconWrap style={{ transform: 'rotate(-90deg)' }} onClick={() => shiftFunc('right')}>
        {isBlack ? <ICON_HITMAP_DOWN_BK /> : <ICON_HITMAP_DOWN />}
      </IconWrap>
    </div>
  );
};

const ScaleButton = ({ hitmapDirection }: { hitmapDirection: (direction: ScaleDirection) => void }) => {
  const themeAttrs = useContext(ThemeContext);
  themeAttrs.ThemeKeys;
  const isBlack = themeAttrs.ThemeKeys === 'bk';

  return (
    <div style={btnBoxStyle}>
      <IconWrap onClick={() => hitmapDirection('up')}>{isBlack ? <ICON_HITMAP_UP_BK /> : <ICON_HITMAP_UP />}</IconWrap>
      <IconWrap onClick={() => hitmapDirection('down')}>
        {isBlack ? <ICON_HITMAP_DOWN_BK /> : <ICON_HITMAP_DOWN />}
      </IconWrap>
    </div>
  );
};

const ToggleAutoScaleButton = ({ autoScaleSw, toggleClick }: { autoScaleSw: boolean; toggleClick: () => void }) => {
  return (
    <TextToggleButton colorKey={autoScaleSw ? 'bg_primary_color' : undefined} onClick={toggleClick}>
      <FormattedMessage id='autoScale' />
    </TextToggleButton>
  );
};

const ToggleErrorOnlyButton = ({ errorOnlySw, toggleClick }: { errorOnlySw: boolean; toggleClick: () => void }) => {
  return (
    <TextToggleButton colorKey={errorOnlySw ? 'bg_warning_color' : undefined} onClick={toggleClick}>
      <FormattedMessage id='error' />
    </TextToggleButton>
  );
};

const TotalCountText = ({ dataCount }: { dataCount: HitmapCount }) => {
  return (
    <TextButtonBox>
      <NormalCountSpan>{dataCount.totHit ? numberWithCommas(dataCount.totHit) : 0}</NormalCountSpan>
      &nbsp;
      <ErrorCountSpan>{dataCount.totErr ? numberWithCommas(dataCount.totErr) : 0}</ErrorCountSpan>
    </TextButtonBox>
  );
};

interface HitmapOptionsProps {
  shiftFunc?: (direction: ShiftDirection) => void;
  hitmapDirection?: (direction: ScaleDirection) => void;
  autoScale?: boolean;
  autoScaleSw: boolean;
  toggleAutoScaleClick: () => void;
  errorOnlySw: boolean;
  toggleErrorOnlyClick: () => void;
  showCount: boolean;
  dataCount: HitmapCount;
}
const HitmapOptions: React.FC<HitmapOptionsProps> = ({
  shiftFunc,
  hitmapDirection,
  autoScaleSw,
  autoScale,
  toggleAutoScaleClick,
  errorOnlySw,
  toggleErrorOnlyClick,
  showCount,
  dataCount,
}) => {
  return (
    <>
      {showCount ? <TotalCountText dataCount={dataCount} /> : null}
      {autoScale ? <ToggleAutoScaleButton autoScaleSw={autoScaleSw} toggleClick={toggleAutoScaleClick} /> : null}
      <ToggleErrorOnlyButton errorOnlySw={errorOnlySw} toggleClick={toggleErrorOnlyClick} />
      {hitmapDirection ? <ScaleButton hitmapDirection={hitmapDirection} /> : null}
      {shiftFunc ? <ShiftButton shiftFunc={shiftFunc} /> : null}
    </>
  );
};

export default HitmapOptions;
