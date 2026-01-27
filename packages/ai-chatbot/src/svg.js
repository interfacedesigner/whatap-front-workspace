import aiIcon from './assets/ai-chatbot.svg';
import closeIcon from './assets/close.svg';
import fullScreenIcon from './assets/full-screen.svg';
import infoIcon from './assets/info.svg';
import refreshIcon from './assets/refresh.svg';
import screenshotIcon from './assets/screenshot.svg';
import whatapLogo from './assets/whatap-logo.svg';

export const aiIconHTML = (size = 20) =>
  `<img width="${size}" height="${size}" src="${aiIcon}" alt="AI 상담원 아이콘" />`;
export const whatapLogoHTML = (size = 63) => `<img width="${size}" src="${whatapLogo}" alt="Whatap Logo" />`;
export const closeIconHTML = (size = 20) => `<img width="${size}" src="${closeIcon}" alt="Close Icon" />`;
export const refreshIconHTML = (size = 20) => `<img width="${size}" src="${refreshIcon}" alt="Refresh Icon" />`;
export const infoIconHTML = (size = 20) => `<img width="${size}" src="${infoIcon}" alt="Info Icon" />`;
export const screenshotIconHTML = () => `<img width="88" height="20" src="${screenshotIcon}" alt="Screenshot Icon" />`;
export const fullScreenIconHTML = (size = 20) =>
  `<img width="${size}" src="${fullScreenIcon}" alt="Full Screen Icon" />`;
