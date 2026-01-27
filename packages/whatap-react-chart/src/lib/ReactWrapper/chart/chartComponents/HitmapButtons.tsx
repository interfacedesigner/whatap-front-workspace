import React from 'react';

// import ICON_HITMAP_UP from "@assets/svgs/hitmap-arr-up.svg";
// import ICON_HITMAP_DOWN from "@assets/svgs/hitmap-arr-down.svg";
// import ICON_HITMAP_UP_BK from "@assets/svgs/hitmap-arr-up-bk.svg";
// import ICON_HITMAP_DOWN_BK from "@assets/svgs/hitmap-arr-down-bk.svg";
import { DirectionStr } from '../HitmapChartWrapper';

export const iconWrapStyle = {
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'visible',
  border: 'solid 1px #999999',
  borderRadius: '30px',
  cursor: 'pointer',
  width: '16px',
  height: '16px',
};

export const iconStyle = {
  width: '16px',
  height: '16px',
  overflow: 'visible',
};
const shiftIconStyle = { ...iconStyle, transform: 'rotate(-90deg)' };
const btnBoxStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  marginRight: '6px',
  borderRadius: '2px',
  boxSizing: 'border-box',
  position: 'relative',
};
const lineStyle = {
  width: '1px',
  height: '12px',
  backgroundColor: 'rgba(217, 226, 235, 0.4)',
};

const textButtonBoxStyle = {
  marginRight: '6px',
  padding: '0px 2px',
  cursor: 'pointer',
};

const textToggleOnStyle = {
  fontSize: '10px',
  padding: '1px 6px',
  margin: '0px 4px',
  color: '#ffffff',
  backgroundColor: '#296cf2',
  borderRadius: '30px',
  border: 'solid 1px #296cf2',
  cursor: 'pointer',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};
const textToggleOnErrorStyle = {
  fontSize: '10px',
  padding: '1px 6px',
  margin: '0px 4px',
  color: '#ffffff',
  backgroundColor: '#fea623',
  borderRadius: '30px',
  border: 'solid 1px #fea623',
  cursor: 'pointer',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};

const textToggleOffStyle = {
  fontSize: '10px',
  padding: '1px 6px',
  margin: '0px 6px',
  color: '#999999',
  borderRadius: '30px',
  border: 'solid 1px #999999',
  cursor: 'pointer',
  height: '16px',
  display: 'flex',
  alignItems: 'center',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};

export const getShiftBtn = ({ shiftFunc, isBlack, style }: any) => {
  if (shiftFunc) {
    const leftOpt = {
      style: shiftIconStyle,
      onClick: () => {
        shiftFunc('left');
      },
    };
    const rightOpt = {
      style: shiftIconStyle,
      onClick: () => {
        shiftFunc('right');
      },
    };

    // const leftBtn = isBlack ? (
    //   <ICON_HITMAP_UP_BK {...leftOpt} />
    // ) : (
    //   <ICON_HITMAP_UP {...leftOpt} />
    // );
    // const rightBtn = isBlack ? (
    //   <ICON_HITMAP_DOWN_BK {...rightOpt} />
    // ) : (
    //   <ICON_HITMAP_DOWN {...rightOpt} />
    // );

    let styles = style ? style : iconWrapStyle;
    return (
      <div className='hcw-button-wrapper' style={btnBoxStyle}>
        <div style={styles}>{leftBtn}</div>
        <div className='hcw-button-divider' style={lineStyle} />
        <div style={styles}>{rightBtn}</div>
      </div>
    );
  }
  return undefined;
};

export const getToggleAutoscale = ({ style, toggleClick, autoScaleSw, autoScale }: any) => {
  let styles = style ? style : autoScaleSw ? textToggleOnStyle : textToggleOffStyle;
  return autoScale ? (
    <div style={styles} onClick={toggleClick}>
      Y Auto
    </div>
  ) : undefined;
};
export const getToggleErrorOnly = ({ style, toggleClick, errorOnly, display }: any) => {
  let styles = style ? style : errorOnly ? textToggleOnErrorStyle : textToggleOffStyle;
  return display ? (
    <div style={styles} onClick={toggleClick}>
      Error
    </div>
  ) : undefined;
};

export const getTotalCount = ({ totHit, totErr, showCount }: any) => {
  if (showCount) {
    return (
      <div style={textButtonBoxStyle}>
        <span style={{ color: '#2196f3' }}>{totHit}</span> <span style={{ color: '#f9a825' }}>{totErr}</span>
      </div>
    );
  }
};

export const getUpDownBtns = ({ isBlack, hitmapDirection, style, themeAttrs }: any) => {
  const upOpt = {
    style: iconStyle,
    onClick: () => {
      hitmapDirection(DirectionStr.UP);
    },
  };

  const downOpt = {
    style: iconStyle,
    onClick: () => {
      hitmapDirection(DirectionStr.DOWN);
    },
  };

  isBlack = themeAttrs.theme === 'bk';

  const upBtn = isBlack ? <ICON_HITMAP_UP_BK {...upOpt} /> : <ICON_HITMAP_UP {...upOpt} />;
  const downBtn = isBlack ? <ICON_HITMAP_DOWN_BK {...downOpt} /> : <ICON_HITMAP_DOWN {...downOpt} />;
  let styles = style ? style : iconWrapStyle;
  return (
    <div style={btnBoxStyle}>
      <div style={styles}>{upBtn}</div>
      <div style={lineStyle} />
      <div style={styles}>{downBtn}</div>
    </div>
  );
};
