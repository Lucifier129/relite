"use strict";
/**
 * relite
 *
 * A redux-like library for managing state with simpler api.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** CreateStore */
/**
 * Create a global Relite store that hold the state tree, state, and also export
 * getter and setter, `dispatch` and `actions`,of it with `actions` and
 * initialState. It support subscribe changes of state implements with Observer
 * design pattern.
 *
 * @param actions An object who contains all the actions those can create state
 * and return it through passed previous state and `Payload` data.
 * @param [initialState] The initial state. You may optionally specify it.
 *
 * @returns A Relite store that lets you read the state, dispatch actions and
 * subscribe to changes. It contains the setter of state, `replaceState`,
 * `dispatch` and all the `actions` whose have been encapsulated  with function
 * currying, the getter of state, `getState`, and the subscribe API,
 * `subscribe` and `publish`.
 */
exports.createStore = function(actions, initialState) {
  if (Object.prototype.toString.call(actions) !== "[object Object]") {
    throw new Error("Expected first argument to be an object");
  }
  var listeners = [];
  var subscribe = function(listener) {
    listeners.push(listener);
    return function() {
      var index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      } else {
        console.warn(
          "You want to unsubscribe a nonexistent listener. Maybe you had unsubscribed it"
        );
      }
    };
  };
  var publish = function(data) {
    listeners.forEach(function(listener) {
      return listener(data);
    });
  };
  var currentState = initialState;
  var getState = function() {
    return currentState;
  };
  var replaceState = function(nextState, data, silent) {
    currentState = nextState;
    if (!silent) {
      publish(data);
    }
  };
  var isDispatching = false;
  var dispatch = function(actionType, actionPayload) {
    if (isDispatching) {
      throw new Error(
        "store.dispatch(actionType, actionPayload): handler may not dispatch"
      );
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
    var updateState = function(nextState) {
      if (nextState === currentState) {
        return currentState;
      }
      var data = {
        start: start,
        end: new Date(),
        actionType: actionType,
        actionPayload: actionPayload,
        previousState: currentState,
        currentState: nextState
      };
      replaceState(nextState, data);
      return nextState;
    };
    return updateState(nextState);
  };
  var curryActions = Object.keys(actions).reduce(function(obj, actionType) {
    if (typeof actions[actionType] === "function") {
      obj[actionType] = function(actionPayload) {
        return dispatch(actionType, actionPayload);
      };
    } else {
      throw new Error(
        "Action must be a function. accept " + actions[actionType]
      );
    }
    return obj;
  }, {});
  var store = {
    actions: curryActions,
    getState: getState,
    replaceState: replaceState,
    dispatch: dispatch,
    subscribe: subscribe,
    publish: publish
  };
  return store;
};
