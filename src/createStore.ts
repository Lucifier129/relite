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
  Action,
  Curring
} from './index'

import * as _ from './util'

/**
 * createStore
 */
const createStore: StoreCreator = <S extends object, AS extends Record<string, Action<S>>>(actions, initialState) => {
  if (!_.isObj(actions)) {
    throw new Error(`Expected first argument to be an object`)
  }

  let listeners: Listener<S>[] = []
  let subscribe: Subscribe<S> = (listener: Listener<S>) => {
    listeners.push(listener)
    return () => {
      let index = listeners.indexOf(listener)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  let publish: Publish<S> = data => {
    listeners.forEach(listener => listener(data))
  }

  let currentState: S = initialState

  let getState = () => currentState
  let replaceState: ReplaceState<S> = (nextState, data, silent) => {
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
  let dispatch: Dispatch<S> = (actionType, actionPayload) => {
    if (isDispatching) {
      throw new Error(`store.dispatch(actionType, actionPayload): handler may not dispatch`)
    }

    let start: Date = new Date()
    let nextState: S = currentState
    try {
      isDispatching = true
      nextState = actions[actionType](currentState, actionPayload)
    } catch (error) {
      throw error
    } finally {
      isDispatching = false
    }

    let isAsync: boolean = false
    let updateState: StateUpdator<S> = nextState => {
      if (nextState === currentState) {
        return currentState
      }

      let data: Data<S> = {
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

  let curryActions: Partial<Curring<S, AS>> = Object.keys(actions).reduce((obj, actionType) => {
    if (_.isFn(actions[actionType])) {
      obj[actionType] = actionPayload => dispatch(actionType, actionPayload)
    }
    return obj
  }, {})


  let store: Store<S, AS> = {
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