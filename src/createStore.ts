import {
  StoreCreator,
  Store,
  Subscribe,
  Listener,
  Publish,
  ReplaceState,
  Dispatch,
  StateUpdator,
  Data,
  Actions,
  StateFromAS,
  Currings
} from "./index";

import * as _ from "./util";

/**
 * createStore
 */
const createStore: StoreCreator = <
  S extends object,
  AS extends Actions<S & StateFromAS<AS>>
>(
  actions,
  initialState
) => {
  if (!_.isObj(actions)) {
    throw new Error(`Expected first argument to be an object`);
  }

  let listeners: Listener<S, AS>[] = [];
  let subscribe: Subscribe<S, AS> = (listener: Listener<S, AS>) => {
    listeners.push(listener);
    return () => {
      let index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      } else {
        console.warn(
          "You want to unsubscribe a nonexistent listener. Maybe you had unsubscribed it"
        );
      }
    };
  };

  let publish: Publish<S, AS> = data => {
    listeners.forEach(listener => listener(data));
  };

  let currentState: S = initialState;

  let getState = () => currentState;
  let replaceState: ReplaceState<S, AS> = (nextState, data, silent) => {
    currentState = nextState;
    if (!silent) {
      publish(data);
    }
  };

  let isDispatching: boolean = false;
  let dispatch: Dispatch<S> = (actionType, actionPayload) => {
    if (isDispatching) {
      throw new Error(
        `store.dispatch(actionType, actionPayload): handler may not dispatch`
      );
    }

    let start: Date = new Date();
    let nextState: S = currentState;
    try {
      isDispatching = true;
      nextState = actions[actionType](currentState, actionPayload);
    } catch (error) {
      throw error;
    } finally {
      isDispatching = false;
    }

    let updateState: StateUpdator<S> = nextState => {
      if (nextState === currentState) {
        return currentState;
      }

      let data: Data<S, AS> = {
        start,
        end: new Date(),
        actionType,
        actionPayload,
        previousState: currentState,
        currentState: nextState
      };

      replaceState(nextState, data);

      return nextState;
    };

    return updateState(nextState);
  };

  let curryActions: Partial<Currings<S, AS>> = Object.keys(actions).reduce(
    (obj, actionType) => {
      if (_.isFn(actions[actionType])) {
        obj[actionType] = actionPayload => dispatch(actionType, actionPayload);
      } else {
        throw new Error(
          `Action must be a function. accept ${actions[actionType]}`
        );
      }
      return obj;
    },
    {}
  );

  let store: Store<S, AS> = {
    actions: curryActions,
    getState,
    replaceState,
    dispatch,
    subscribe,
    publish
  };

  return store;
};

export default createStore;
