/*!
 * relite.js v0.1.0
 * (c) 2016 Jade Gu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	global.Relite = factory();
}(this, function () { 'use strict';

	var attr = 'info' in console ? 'info' : "log";
	var pad = function pad(num) {
	    return ('0' + num).slice(-2);
	};
	function createLogger(_ref) {
	    var _ref$name = _ref.name;
	    var name = _ref$name === undefined ? "ROOT" : _ref$name;

	    var logInfo = function logInfo(data) {
	        var actionType = data.actionType;
	        var actionPayload = data.actionPayload;
	        var previousState = data.previousState;
	        var currentState = data.currentState;
	        var start = data.start;
	        var end = data.end;

	        var formattedTime = start.getHours() + ':' + pad(start.getMinutes()) + ':' + pad(start.getSeconds());
	        var takeTime = (getTime() - timeStore[key]).toFixed(2);
	        var message = name + ': action-type [' + actionType + '] @ ' + formattedTime + ' in ' + takeTime + 'ms';

	        try {
	            console.groupCollapsed(message);
	        } catch (e) {
	            try {
	                console.group(message);
	            } catch (e) {
	                console.log(message);
	            }
	        }

	        if (attr === 'log') {
	            console[attr](actionPayload);
	            console[attr](previousState);
	            console[attr](currentState);
	        } else {
	            console[attr]('%c action-payload', 'color: #03A9F4; font-weight: bold', actionPayload);
	            console[attr]('%c prev-state', 'color: #9E9E9E; font-weight: bold', previousState);
	            console[attr]('%c next-state', 'color: #4CAF50; font-weight: bold', currentState);
	        }

	        try {
	            console.groupEnd();
	        } catch (e) {
	            console.log('-- log end --');
	        }
	    };

	    return logInfo;
	}

	function isFn(obj) {
		return typeof obj === 'function';
	}

	function isThenable(obj) {
		return obj != null && isFn(obj.then);
	}

	function isObj(obj) {
		return Object.prototype.toString.call(obj) === '[object Object]';
	}

	function createSotre(actions, initialState) {

	    if (!isObj(actions)) {
	        throw new Error('Expected first argument to be an object');
	    }

	    var listeners = [];
	    var subscribe = function subscribe(listener) {
	        listeners.push(listener);
	        return function () {
	            var index = listeners.indexOf(listener);
	            if (index !== -1) {
	                listeners.splice(index, 1);
	            }
	        };
	    };

	    var currentState = initialState;

	    var getState = function getState() {
	        return currentState;
	    };
	    var replaceState = function replaceState(nextState, data, silent) {
	        currentState = nextState;
	        if (!silent) {
	            listeners.forEach(function (listener) {
	                return listener(data);
	            });
	        }
	    };

	    var isDispatching = false;
	    var dispatch = function dispatch(actionType, actionPayload) {
	        if (isDispatching) {
	            throw new Error('store.dispatch(actionType, actionPayload): handler may not dispatch');
	        }

	        var start = new Date();

	        try {
	            isDispatching = true;
	            nextState = actions[actionType](currentState, actionPayload);
	        } finally {
	            isDispatching = false;
	        }

	        if (nextState === currentState) {
	            return currentState;
	        }

	        var updateState = function updateState(nextState) {
	            replaceState(nextState, {
	                start: start,
	                end: new Date(),
	                actionType: actionType,
	                actionPayload: actionPayload,
	                previousState: currentState,
	                currentState: nextState
	            });
	            return nextState;
	        };

	        if (isThenable(nextState)) {
	            return nextState.then(updateState);
	        }

	        return updateState(nextState);
	    };

	    var bindingActions = Object.keys(actions).reduce(function (obj, actionType) {
	        if (isFn(actions[actionType])) {
	            obj[actionType] = function (actionPayload) {
	                return dispatch(actionType, actionPayload);
	            };
	        }
	        return obj;
	    }, {});

	    return {
	        getState: getState,
	        replaceState: replaceState,
	        dispatch: dispatch,
	        actions: bindingActions,
	        subscribe: subscribe
	    };
	}

	var index = {
	  createStore: createSotre,
	  createLogger: createLogger
	};

	return index;

}));