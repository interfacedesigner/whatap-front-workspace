import { cloneDeep } from 'lodash-es';

const isObject = (data: any) => {
  if (typeof data === 'object' && !Array.isArray(data)) {
    return true;
  }
  return false;
};

/**
 *
 * @param prevConfig 저장되어있던 옵션
 * @param nextConfig 저장할 옵션
 * @param diffCheckout ?? 조사 필요
 * @returns
 */
const updateConfig = <T extends Record<string, unknown>>(
  prevConfig: T,
  nextConfig: T,
  diffCheck: boolean = false,
): T | null => {
  const nextOptions = cloneDeep(prevConfig) as T;
  let update = false;
  const configHandler = (
    applyConfig: Record<string, unknown>,
    oldConfig: Record<string, unknown>,
    newConfig: Record<string, unknown>,
  ) => {
    for (const op in newConfig) {
      const acceptConfig = newConfig[op];
      if (isObject(acceptConfig)) {
        if (isObject(applyConfig[op]) && isObject(oldConfig[op])) {
          configHandler(applyConfig[op], oldConfig[op], acceptConfig);
        } else {
          applyConfig[op] = cloneDeep(acceptConfig);
          update = true;
        }
      } else {
        if (typeof acceptConfig !== 'undefined' && (!diffCheck || oldConfig[op] !== acceptConfig)) {
          applyConfig[op] = acceptConfig;
          update = true;
        }
      }
    }
  };

  configHandler(nextOptions, prevConfig, nextConfig);
  return update ? nextOptions : null;
};

export default updateConfig;
