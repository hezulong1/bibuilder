import { isString } from '@vue/shared';

export { isObject, isPlainObject, isString, isFunction, isDate, isSymbol, isPromise, toRawType } from '@vue/shared';

export const isUndefined = (val: any): val is undefined => val === void 0;
export const isUndefinedOrNull = (val: any): val is null | undefined => isUndefined(val) || (val === null);
export const isDefined = <T>(val: T | undefined | null): val is T => !isUndefinedOrNull(val);
export const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
export const isNumber = (val: any): val is number => typeof val === 'number';
export const isStringNumber = (val: string): boolean => isString(val) ? !Number.isNaN(Number(val)) : false;
