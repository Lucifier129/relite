/**
 * util
 */

export function isFn(obj) {
	return typeof obj === 'function'
}

export function isThenable(obj) {
	return obj != null && isFn(obj.then)
}

export function isObj(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]'
}