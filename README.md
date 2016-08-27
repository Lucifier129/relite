# relite
a redux-like library for managing state with simpler api (1kb)

# Why
redux is awesome, but is not enough simple for small and middle application. 

With `relite`, we don't need to `combine | apply | bind` anything, just write pure function and call actions, it done.

# Installtion

```shell
npm install --save relite
```

# Demo

- [counter](https://github.com/Lucifier129/relite/tree/master/examples/counter)
- [flappy-bird](https://github.com/Lucifier129/flappy-bird)

# How to use

## write pure function

the action of `relite` looks like a reducer of redux, but more simple and powerful.

```javascript
/**
* an action consist of action-type, action-payload, action-handler and action-result
* at this example
* action-type is EXEC_BY
* action-handler is the function accepts two arguments: state and action-payload
* action-result is the result of function
*/
export let EXEC_BY = (state, input) => {
	let value = parseFloat(input, 10)
	return isNaN(value) ? state : {
		...state,
		count: state.count + value
	}
}
```

`relite` support async action, works like build-in `redux-promise` and `redux-thunk`

```javascript
/**
* when action-handler return a promise, it will call updateState at promise.then
* use async/await syntax will be better for handling async action
*/
export let EXEC_ASYNC = async (state, input) => {
	await delay(1000)
	return EXEC_BY(state, input) // use the state accepted by EXEC_ASYNC, it maybe out of time
}

export let EXEC_ASYNC = async (state, input) => {
	await delay(1000)
	return EXEC_BY // use current state
}

// promise-style
export let EXEC_ASYNC = (state, input) => {
	return delay(1000, EXEC_BY)
}

function delay(timeout = 0, value) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), timeout)
    })
}
```

`relite` support three kinds of action-result: nextState, promise and action-handler

- if action-handler return promise, `relite` call updateState on promise.then
- if action-handler return function, `relite` handle it as a new action-handler and call it with state and current action-payload
- other value return by action-handler is named `nextState`, `relite` will call updateState immediately
- you can nest all of three kinds action-result mentioned above in action-handler

## create store by actions and initialState

```javascript
import { createStore } from 'relite'
import * as actions from './actions'

let initialState = {
	count: 0,
}
let store = createStore(actions, intialState)

/*
* relite would bind state for every actions you gived to `createStore`
* so the all functions in store.actions can only accept one argument, action-payload
* no need to bindActionCreators
* each actions return currentState or promise with currentState
*/
let { INCREMENT, EXEC_BY } = store.actions
INCREMENT() // -> { count: 1 }
EXEC_ASYNC(9) // -> Promise[[{ count: 10 }]]

/**
* subscribe store by store.subscribe
* only the state was changed/update, relite would trigger the listeners
*/
let unsubscribe = store.subscribe((data) => {
	let {
		actionType, // action-type
		actionPayload, // action-payload
		start, // start date
		end, // end date
		previousState, // prev-state
		currentState // cur-state
	} = data
})

let newState = {
	count: 0,
}
let simulateData = {
	actionType: 'REPLACE_STATE',
	actionPayload: null,
	start: new Date(),
	end: new Date,
	previousState: store.getState(), // get current state
	currentState: newState,
}
let keepSilent = false // if true, it will not trigger listeners

// replace state by store.replaceState
store.replaceState(newState, simulateData, false)

// trigger listener by store.publish
store.publish(simulateData)

store.dispatch('EXEC_ASYNC', 10) // dispatch the action manually

```

## use build-in logger

```javascript
import { createStore, createLogger } from 'relite'
import * as actions from './actions'

let initialState = {
	count: 0,
}
let store = createStore(actions, intialState)

let logger =  createLogger({
	name: 'logger-name',
})

store.subscribe(logger)
store.subscribe(render)

render()

function render() {
	ReactDOM.render(
		<App {...store.getState()} {...store.actions} />,
		document.getElementById('container')
	)
}
```

# End
Issue and pull request is welcome!