# relite

a redux-like library for managing state with simpler api (1kb)

## Why

redux is awesome, but is not enough simple for small and middle application. 

With `relite`, we don't need to `combine | apply | bind` anything, just write pure function and call actions, it done.

## What's new(3.0.0)

+ Supoort `Typescript`.

+ Delete the support of return type `Promise | Function` of `Action`.

## Installtion

```shell
npm install --save relite
```

## How to use

### Write pure function

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

### Create store by actions and initialState

```javascript
import { createStore } from 'relite'
import * as actions from './actions'

let initialState = {
	count: 0
}
let store = createStore(actions, intialState)

/*
* relite will bind state for every actions you gave to `createStore`
* so all the functions in store.actions can only accept one argument, action-payload
* no need to bindActionCreators
* each actions return currentState or promise with currentState
*/
let { INCREMENT, EXEC_BY } = store.actions
INCREMENT() // -> { count: 1 }
EXEC_ASYNC(9) // -> Promise[[{ count: 10 }]]

/**
* subscribe store by store.subscribe
* when the state was changed/updateed, relite would trigger the listeners
* if action-handler return the same state, listeners would not be triggered
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

## End

Issue and pull request is welcome!
