import {
  StoreCreator,
  Store,
  Payload,
  Subscribe,
  Listener,
  Publish,
  ReplaceState,
  Dispatch,
  StateUpdator,
  NextStateFun,
  NextStatePromise,
  Data,
  Action,
  Curring
} from './index'

import * as _ from './util'

/**
 * createStore
 */
const createStore: StoreCreator = <S, P extends Payload, A extends Action<S, P>, AS extends Record<string, A>>(actions, initialState) => {
  if (!_.isObj(actions)) {
    throw new Error(`Expected first argument to be an object`)
  }

  let listeners: Listener<S, P>[] = []
  let subscribe: Subscribe<S, P> = (listener: Listener<S, P>) => {
    listeners.push(listener)
    return () => {
      let index = listeners.indexOf(listener)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  let publish: Publish<S, P> = data => {
    listeners.forEach(listener => listener(data))
  }

  let currentState: S = initialState

  let getState = () => currentState
  let replaceState: ReplaceState<S, P> = (nextState, data, silent) => {
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
  let dispatch: Dispatch<S, P> = (actionType, actionPayload) => {
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
    let updateState: StateUpdator<S, P> = nextState => {
      if (_.isFn(nextState)) {
        return updateState((nextState as NextStateFun<S, P>)(currentState, actionPayload))
      }
      if (_.isThenable(nextState)) {
        isAsync = true
        return (nextState as NextStatePromise<S, P>).then(updateState)
      }
      if (nextState === currentState) {
        return currentState
      }

      let data: Data<S, P> = {
        isAsync,
        start,
        end: new Date(),
        actionType,
        actionPayload,
        previousState: currentState,
        currentState: nextState as S
      }

      replaceState(nextState as S, data)

      return nextState as S
    }

    return updateState(nextState) as S
  }

  let curryActions: Curring<Record<string, A>, S, P> = Object.keys(actions).reduce((obj, actionType) => {
    if (_.isFn(actions[actionType])) {
      obj[actionType] = actionPayload => dispatch(actionType, actionPayload)
    }
    return obj
  }, {})


  let store: Store<S, P, A> = {
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