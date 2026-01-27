import type { CSSProperties } from 'react';

export const WrapperStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
};

export const HitmapOptionWrapperStyle: CSSProperties = {
  height: '30px',
  display: 'flex',
  justifyContent: 'right',
  alignItems: 'center',
};

export const HitmapPortalWrapperStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'left',
};

export const HitmapChartWrapperStyle: CSSProperties = {
  flex: 1,
  overflow: 'hidden',
};
