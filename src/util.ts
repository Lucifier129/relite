/**
 * util
 */

interface IsFn {
  (obj: any): boolean
}

interface IsThenable {
  (obj: any): boolean
}

interface IsObj {
  (obj: any): boolean
}

interface Identity {
  (obj: any): any
}

export const isFn: IsFn = (obj) => {
	return typeof obj === 'function'
}

export const isThenable: IsThenable = (obj) => {
	return obj != null && isFn(obj.then)
}

export const isObj: IsObj = (obj) => {
	return Object.prototype.toString.call(obj) === '[object Object]'
}

export const identity: Identity = (obj) => {
	return obj
}