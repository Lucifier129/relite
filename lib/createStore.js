'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * createStore
                                                                                                                                                                                                                                                                   */


exports.default = createStore;

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createStore(actions, initialState) {

    if (!_.isObj(actions)) {
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
    var publish = function publish(data) {
        listeners.forEach(function (listener) {
            return listener(data);
        });
    };

    var currentState = initialState;

    var getState = function getState() {
        return currentState;
    };
    var replaceState = function replaceState(nextState, data, silent) {
        if (data && data.isAsync) {
            // merge currentState and nextState to make sure all state is new
            currentState = _extends({}, currentState, nextState);
        } else {
            currentState = nextState;
        }
        if (!silent) {
            publish(data);
        }
    };

    var isDispatching = false;
    var dispatch = function dispatch(actionType, actionPayload) {
        if (isDispatching) {
            throw new Error('store.dispatch(actionType, actionPayload): handler may not dispatch');
        }

        var start = new Date();
        var nextState = currentState;
        try {
            isDispatching = true;
            nextState = actions[actionType](currentState, actionPayload);
        } catch (error) {
            throw error;
        } finally {
            isDispatching = false;
        }

        var isAsync = false;
        var updateState = function updateState(nextState) {
            if (_.isFn(nextState)) {
                return updateState(nextState(currentState, actionPayload));
            }
            if (_.isThenable(nextState)) {
                isAsync = true;
                return nextState.then(updateState);
            }
            if (nextState === currentState) {
                return currentState;
            }
            replaceState(nextState, {
                isAsync: isAsync,
                start: start,
                end: new Date(),
                actionType: actionType,
                actionPayload: actionPayload,
                previousState: currentState,
                currentState: nextState
            });
            return nextState;
        };

        return updateState(nextState);
    };

    var store = {
        getState: getState,
        replaceState: replaceState,
        dispatch: dispatch,
        subscribe: subscribe,
        publish: publish
    };

    store.actions = Object.keys(actions).reduce(function (obj, actionType) {
        if (_.isFn(actions[actionType])) {
            obj[actionType] = function (actionPayload) {
                return store.dispatch(actionType, actionPayload);
            };
        }
        return obj;
    }, {});

    return store;
}