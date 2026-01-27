import mixin from '../../util/mixinBuilder';

export const EqualizerCore = (Base: any) =>
  class extends mixin(Base).extend() {
    public setEqualizerSizeAttr = () => {
      this.setEqualizerAreaCount();
      this.setEqualizerDots();
    };
    public initEqualizerInterval = (callback: Function) => {
      this.setEqualizerEvent();
      this.equalizerInterval = setInterval(() => {
        if (this.config.common.animate) {
          this.equalizerEvent();
        }

        callback();
      }, 40);
    };
    public removeEqualizerInterval = () => {
      if (this.equalizerInterval) {
        clearInterval(this.equalizerInterval);
      }
    };

    public equalizerInteractionTrigger = () => {
      if (this.searchDot && this.prevMouseEvent) {
        this.equalzierMouseEvent(this.prevMouseEvent);
      }
    };

    public storeDidUpdate = (prevStore: any) => {};

    private setEqualizerEvent = () => {
      this.equalizerUpSwitch = true;
      this.equalizerPos = 0;
    };

    private equalizerEvent = () => {
      const sw = this.equalizerUpSwitch;
      this.equalizerPos = parseFloat((this.equalizerPos + (sw ? 0.3 : -0.6)).toFixed(2));
      if (this.equalizerPos >= 3 || this.equalizerPos <= 0) {
        this.equalizerUpSwitch = !sw;
      }
    };
  };
