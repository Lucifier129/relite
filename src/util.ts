/**
 * util
 */

interface IsFn {
  (obj: any): boolean;
}

interface IsObj {
  (obj: any): boolean;
}

export const isFn: IsFn = obj => {
  return typeof obj === "function";
};

export const isObj: IsObj = obj => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};
