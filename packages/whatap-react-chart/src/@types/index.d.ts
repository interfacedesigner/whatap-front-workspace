declare global {
  export interface Window {
    __whatap__?: {
      /** 11번가 전용, true일시 히트맵 오토스케일 옵션이 기본 off된다 */
      ui_11st_hitmap_autoscale_default_off?: 'true';
    };
  }
}

export {};
