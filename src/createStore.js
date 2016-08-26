/**
 * createStore
 */
import * as _ from './util'

export default function createSotre(actions, initialState) {

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

    let currentState = initialState

    let getState = () => currentState
    let replaceState = (nextState, data, silent) => {
        currentState = nextState
        if (!silent) {
            listeners.forEach(listener => listener(data))
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
			nextState = actions[actionType](currentState, actionPayload)
		} finally {
	    	isDispatching = false
	    }

	    if (nextState === currentState) {
	    	return currentState
	    }

	    let updateState = nextState => {
            if (_.isFn(nextState)) {
                nextState = nextState(currentState, actionPayload)
            }
            if (_.isThenable(nextState)) {
                return nextState.then(updateState)
            }
			replaceState(nextState, {
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

    let bindingActions = Object.keys(actions).reduce((obj, actionType) => {
    	if (_.isFn(actions[actionType])) {
    		obj[actionType] = actionPayload => dispatch(actionType, actionPayload)
    	}
    	return obj
    }, {})


    return {
    	getState,
    	replaceState,
    	dispatch,
    	actions: bindingActions,
    	subscribe,
    }
}
