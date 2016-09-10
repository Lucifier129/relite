'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isFn = isFn;
exports.isThenable = isThenable;
exports.isObj = isObj;
exports.identity = identity;
/**
 * util
 */

function isFn(obj) {
	return typeof obj === 'function';
}

function isThenable(obj) {
	return obj != null && isFn(obj.then);
}

function isObj(obj) {
	return Object.prototype.toString.call(obj) === '[object Object]';
}

function identity(obj) {
	return obj;
}