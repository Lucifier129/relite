import {
  StoreCreator,
  Store,
  State,
  Subscribe,
  Listener,
  Publish,
  GetState,
  ReplaceState,
  Dispatch,
  StateUpdator,
  NextStateFun,
  NextStatePromise,
  Data
} from './index'

import * as _ from './util'

/**
 * createStore
 */
const createStore: StoreCreator = (actions, initialState) => {
  if (!_.isObj(actions)) {
    throw new Error(`Expected first argument to be an object`)
  }

  let listeners: Listener[] = []
  let subscribe: Subscribe = (listener: Listener) => {
    listeners.push(listener)
    return () => {
      let index = listeners.indexOf(listener)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  let publish: Publish = data => {
    listeners.forEach(listener => listener(data))
  }

  let currentState: State = initialState

  let getState: GetState = () => currentState
  let replaceState: ReplaceState = (nextState, data, silent) => {
    if (data && data.isAsync) {
      // merge currentState and nextState to make sure all state is new
      currentState = {
        ...currentState,
        ...nextState,
      }
    } else {
      currentState = nextState
    }
    if (!silent) {
      publish(data)
    }
  }

  let isDispatching: boolean = false
  let dispatch: Dispatch = (actionType, actionPayload) => {
    if (isDispatching) {
      throw new Error(`store.dispatch(actionType, actionPayload): handler may not dispatch`)
    }

    let start: Date = new Date()
    let nextState: State = currentState
    try {
      isDispatching = true
      nextState = actions[actionType](currentState, actionPayload)
    } catch (error) {
      throw error
    } finally {
      isDispatching = false
    }

    let isAsync: boolean = false
    let updateState: StateUpdator = nextState => {
      if (_.isFn(nextState)) {
        return updateState((nextState as NextStateFun)(currentState, actionPayload))
      }
      if (_.isThenable(nextState)) {
        isAsync = true
        return (nextState as NextStatePromise).then(updateState)
      }
      if (nextState === currentState) {
        return currentState
      }

      let data: Data = {
        isAsync,
        start,
        end: new Date(),
        actionType,
        actionPayload,
        previousState: currentState,
        currentState: nextState
      }

      replaceState(nextState, data)

      return nextState
    }

    return updateState(nextState)
  }

  let curryActions = Object.keys(actions).reduce((obj, actionType) => {
    if (_.isFn(actions[actionType])) {
      obj[actionType] = actionPayload => dispatch(actionType, actionPayload)
    }
    return obj
  }, {})


  let store: Store = {
    actions: curryActions,
    getState,
    replaceState,
    dispatch,
    subscribe,
    publish,
  }

  return store
}

export default createStore