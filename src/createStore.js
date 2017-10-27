/**
 * createStore
 */
import * as _ from './util'

export default function createStore(actions, initialState) {

    if (!_.isObj(actions)) {
        throw new Error(`Expected first argument to be an object`)
    }

    let listeners = []
    let subscribe = listener => {
        listeners.push(listener)
        return () => {
            let index = listeners.indexOf(listener)
            if (index !== -1) {
                listeners.splice(index, 1)
            }
        }
    }
    let publish = data => {
        listeners.forEach(listener => listener(data))
    }

    let currentState = initialState

    let getState = () => currentState
    let replaceState = (nextState, data, silent) => {
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

    let isDispatching = false
    let dispatch = (actionType, actionPayload) => {
        if (isDispatching) {
            throw new Error(`store.dispatch(actionType, actionPayload): handler may not dispatch`)
        }

        let start = new Date()
        let nextState = currentState
        try {
            isDispatching = true
            nextState = actions[actionType](currentState, ...Object.values(actionPayload))
        } catch (error) {
            throw error
        } finally {
            isDispatching = false
        }

        let isAsync = false
        let updateState = nextState => {
            if (_.isFn(nextState)) {
                return updateState(nextState(currentState, ...Object.values(actionPayload)))
            }
            if (_.isThenable(nextState)) {
                isAsync = true
                return nextState.then(updateState)
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
                currentState: nextState,
            })
            return nextState
        }

        return updateState(nextState)
    }

    let store = {
        getState,
        replaceState,
        dispatch,
        subscribe,
        publish,
    }

    store.actions = Object.keys(actions).reduce((obj, actionType) => {
        if (_.isFn(actions[actionType])) {
            obj[actionType] = function(){ //箭头函数没有arguments
                store.dispatch(actionType, arguments)
              }
        }
        return obj
    }, {})

    return store
}
