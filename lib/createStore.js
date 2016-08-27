'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createSotre;

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createSotre(actions, initialState) {

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
        currentState = nextState;
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
        } finally {
            isDispatching = false;
        }

        var updateState = function updateState(nextState) {
            if (_.isFn(nextState)) {
                return updateState(nextState(currentState, actionPayload));
            }
            if (_.isThenable(nextState)) {
                return nextState.then(updateState);
            }
            if (nextState === currentState) {
                return currentState;
            }
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

        return updateState(nextState);
    };

    var bindingActions = Object.keys(actions).reduce(function (obj, actionType) {
        if (_.isFn(actions[actionType])) {
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
        subscribe: subscribe,
        publish: publish
    };
} /**
   * createStore
   */