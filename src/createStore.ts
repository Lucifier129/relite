/**
 * createStore
 */
import Relite from './index'
import * as _ from './util'

const createStore: Relite.CreateStore = (actions, initialState) => {
    if (!_.isObj(actions)) {
        throw new Error(`Expected first argument to be an object`)
    }

    let listeners: Relite.Listener[] = []
    let subscribe: Relite.Subscribe = (listener: Relite.Listener) => {
        listeners.push(listener)
        return () => {
            let index = listeners.indexOf(listener)
            if (index !== -1) {
                listeners.splice(index, 1)
            }
        }
    }
    let publish: Relite.Publish = (data: Relite.Data) => {
        listeners.forEach(listener => listener(data))
    }

    let currentState: Relite.State = initialState

    let getState: Relite.GetState = () => currentState
    let replaceState: Relite.ReplaceState = (nextState, data, silent) => {
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
    let dispatch: Relite.Dispatch = (actionType, actionPayload) => {
        if (isDispatching) {
            throw new Error(`store.dispatch(actionType, actionPayload): handler may not dispatch`)
        }

        let start: Date = new Date()
        let nextState: Relite.State = currentState
        try {
            isDispatching = true
            nextState = actions[actionType](currentState, actionPayload)
        } catch (error) {
            throw error
        } finally {
            isDispatching = false
        }

        let isAsync: boolean = false
        let updateState: Relite.UpdateState = nextState => {
            if (_.isFn(nextState)) {
              
                return updateState((nextState as Relite.NextStateFun)(currentState, actionPayload))
            }
            if (_.isThenable(nextState)) {
                isAsync = true
                return (nextState as Relite.NextStatePromise).then(updateState)
            }
            if (nextState === currentState) {
                return currentState
            }
            replaceState(nextState, {
                isAsync,
                start,
                end: new Date(),
                actionType,
                actionPayload,
                previousState: currentState,
                currentState: nextState
            })
            return nextState
        }

        return updateState(nextState)
    }

    let store: Relite.Store = {
        getState,
        replaceState,
        dispatch,
        subscribe,
        publish,
    }

    store.actions = Object.keys(actions).reduce((obj, actionType) => {
        if (_.isFn(actions[actionType])) {
            obj[actionType] = actionPayload => store.dispatch(actionType, actionPayload)
        }
        return obj
    }, {})

    return store
}

export default createStore