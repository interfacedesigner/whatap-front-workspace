// @ts-nocheck

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createQueryKeys } from '@lukemorales/query-key-factory';

import generateFactoryKey from './generateFactoryKey';

/**
 * 예제
import * as Api from './api';
import { makeQueryKeys } from './queryKeyFactory';

const PREFIX = 'ws_api';
export const serverDashboardQueryKeys = convertToQueryKeys(PREFIX, Api);
 */

type ApiEntries<T extends Record<string, (...args: any[]) => Promise<any>>> = {
  [K in keyof T]: (...params: Parameters<T[K]>) => {
    queryKey: [string, ...Parameters<T[K]>];
    queryFn: () => ReturnType<T[K]>;
  };
};

type NestedObject = Record<string, unknown>;

export const convertToQueryKeys = <T extends Record<string, (...args: any[]) => Promise<any>>>(
  prefix: string,
  apis: T,
) => {
  const factoryKey = generateFactoryKey(prefix);

  const created = Object.entries(apis).reduce((map, [key, apiFn]) => {
    return Object.assign(map, {
      [key]: (...params: Parameters<typeof apiFn>) => {
        const restKeyRecordList = [...params].map((param) => flatten(param));
        const flatParams = restKeyRecordList
          .map((record) => {
            return Object.entries(record).map(([key, value]) => (!!key ? `${key}.${value}` : `${value}`));
          })
          .flat();
        return {
          queryKey: [apiFn.name, ...flatParams],
          queryFn: () => apiFn(...params),
        };
      },
    });
  }, {} as ApiEntries<T>);

  return createQueryKeys<string, typeof created>(factoryKey, created as unknown as any);
};

const createKey = (parentKey: string, key: string): string => (parentKey ? `${parentKey}.${key}` : key);

const isObject = (value: unknown): value is NestedObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const flatten = (value: unknown, parentKey = '', result: Record<string, string> = {}): Record<string, string> => {
  if (isObject(value)) {
    Object.entries(value).forEach(([key, nestedValue]) => {
      const newKey = createKey(parentKey, key);
      flatten(nestedValue, newKey, result);
    });
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => {
      const arrayKey = `${parentKey}[${index}]`;
      flatten(item, arrayKey, result);
    });
  } else {
    result[parentKey] = String(value);
  }

  return result;
};
