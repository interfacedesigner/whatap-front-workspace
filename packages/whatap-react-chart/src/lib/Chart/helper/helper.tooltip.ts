export default class Tooltip {
  private tooltipEl: HTMLElement;
  public tooltipStat: Boolean;
  private isUnmounted = false;

  constructor() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'whatap-tooltip';
    this.tooltipStat = false;
    this.setDefaultStyle();
  }

  private setDefaultStyle = () => {
    this.tooltipEl.style.font =
      "Roboto, Helvetica, Arial, '맑은 고딕', 'Malgun Gothic', '애플 SD 산돌고딕 Neo', 'Apple SD Gothic Neo', sans-serif";
    this.tooltipEl.style.position = 'absolute';
    this.tooltipEl.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    this.tooltipEl.style.color = '#222222';
    this.tooltipEl.style.boxShadow = '0 2px 2px 0 rgba(0; 0; 0; 0.2)';
    this.tooltipEl.style.border = 'solid 1px #cccccc';
    this.tooltipEl.style.borderRadius = '4px';
    this.tooltipEl.style.padding = '8px';
    this.tooltipEl.style.zIndex = '9999';
    this.tooltipEl.style.top = '0px';
    this.tooltipEl.style.left = '0px';
    this.tooltipEl.style.fontSize = '11px';
    this.tooltipEl.style.minWidth = '108px';
    this.tooltipEl.style.boxSizing = 'border-box';
    this.tooltipEl.style.whiteSpace = 'nowrap';
  };

  public tooltipOn = () => {
    if (this.isUnmounted) {
      return;
    }

    this.tooltipStat = true;
    document.body.appendChild(this.tooltipEl);
  };

  public tooltipOff = () => {
    this.tooltipStat = false;
    if (document.body.contains(this.tooltipEl)) {
      document.body.removeChild(this.tooltipEl);
    }
  };

  public willUnmount = () => {
    this.isUnmounted = true;
    this.tooltipOff();
  };

  public follow = (evt: MouseEvent) => {
    const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollY = document.documentElement.scrollTop || document.body.scrollTop;

    const width = this.tooltipEl.offsetWidth;
    const height = this.tooltipEl.offsetHeight;

    const winWidth = document.body.clientWidth;
    const winHeight = window.innerHeight;

    if (evt.clientX + 8 + width > winWidth) {
      const rightPos = winWidth - evt.clientX - scrollX + 8;
      this.tooltipEl.style.left = 'auto';
      this.tooltipEl.style.right = rightPos + 'px';
    } else {
      const leftPos = evt.clientX + 8 + scrollX;
      this.tooltipEl.style.right = 'auto';
      this.tooltipEl.style.left = leftPos + 'px';
    }
    if (evt.clientY + 8 + height > winHeight) {
      const bottomPos = winHeight - evt.clientY - scrollY + 8;
      if (bottomPos + height > winHeight) {
        this.tooltipEl.style.top = '0px';
        this.tooltipEl.style.bottom = 'auto';
      } else {
        this.tooltipEl.style.top = 'auto';
        this.tooltipEl.style.bottom = bottomPos + 'px';
      }
    } else {
      const topPos = evt.clientY + 8 + scrollY;
      this.tooltipEl.style.bottom = 'auto';
      this.tooltipEl.style.top = topPos + 'px';
    }
  };

  public changeText = (dom: HTMLElement) => {
    if (this.isUnmounted) {
      return;
    }
    this.tooltipEl.innerHTML = '';
    this.tooltipEl.appendChild(dom);
  };
}
// 여기부터 툴팁 텍스트

export const getNomalText = (text: string): HTMLElement => {
  const dom = document.createElement('div');
  const style = dom.style;
  dom.innerText = text;
  style.marginBottom = '6px';

  return dom;
};

export const getNomalGrayText = (text: string): HTMLElement => {
  const dom = document.createElement('div');
  const style = dom.style;
  dom.innerText = text;

  style.color = '#999999';
  style.marginBottom = '4px';

  return dom;
};

export const getTitleText = (text: string): HTMLElement => {
  const dom = document.createElement('div');
  const style = dom.style;

  dom.innerText = text;
  style.fontSize = '12px';
  style.fontWeight = '500';
  style.marginBottom = '4px';

  return dom;
};

export const getSubTitleText = (text: string): HTMLElement => {
  const dom = document.createElement('div');
  const style = dom.style;

  dom.innerText = text;
  style.fontSize = '12px';
  style.lineHeight = '14px';
  style.color = '#666666';

  return dom;
};

export const getStrongText = (text: string | HTMLElement): HTMLElement => {
  if (text instanceof HTMLElement) {
    return text;
  } else {
    const dom = document.createElement('div');
    const style = dom.style;
    dom.innerText = text;
    style.fontSize = '20px';
    style.fontWeight = 'bold';

    return dom;
  }
};

export const getTitleValueText = (title: string, value: string, valueColor?: string): HTMLElement => {
  const dom = document.createElement('div');
  const valueDom = document.createElement('span');
  const style = dom.style;
  style.fontSize = '12px';
  style.display = 'flex';
  style.alignItems = 'center';
  style.justifyContent = 'space-between';
  valueDom.innerText = value;
  if (valueColor) {
    valueDom.style.color = valueColor;
  }
  valueDom.style.fontWeight = 'bold';
  valueDom.style.marginLeft = '3px';
  dom.appendChild(document.createTextNode(title));
  dom.appendChild(valueDom);

  return dom;
};

export const getLabelValueText = (label: string | HTMLElement, value: string | HTMLElement, color: string) => {
  const dom = document.createElement('div');
  dom.style.marginBottom = '2px';
  dom.style.display = 'flex';
  dom.style.justifyContent = 'left';
  dom.style.alignItems = 'center';
  dom.style.gap = '4px';

  const dotDom = document.createElement('div');
  dotDom.style.width = '8px';
  dotDom.style.height = '8px';
  dotDom.style.borderRadius = '4px';
  dotDom.style.background = color;
  dotDom.style.marginBottom = '2px';
  dom.appendChild(dotDom);

  const labelDom = document.createElement('span');
  if (label instanceof HTMLElement) {
    labelDom.appendChild(label);
  } else {
    labelDom.innerText = label;
  }
  dom.appendChild(labelDom);

  const valueDom = document.createElement('span');
  if (value instanceof HTMLElement) {
    valueDom.appendChild(value);
  } else {
    valueDom.innerText = ': ' + value;
  }
  dom.appendChild(valueDom);

  return dom;
};
export const getTotalValueText = (value: string) => {
  const dom = document.createElement('div');
  dom.style.fontWeight = 'bold';
  dom.style.marginTop = '4px';

  const labelDom = document.createElement('span');
  // labelDom.innerHTML = '&Sigma;';
  labelDom.innerText = 'Total';
  labelDom.style.marginRight = '4px';
  labelDom.style.verticalAlign = 'top';
  dom.appendChild(labelDom);

  const valueDom = document.createElement('span');
  valueDom.innerText = value;
  valueDom.style.verticalAlign = 'top';
  dom.appendChild(valueDom);

  return dom;
};
