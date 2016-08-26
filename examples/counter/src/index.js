import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, createLogger } from 'relite'
import * as actions from './actions'
import Counter from './Counter'

const initialState = {
	count: 0,
	input: '1',
}

const store = createStore(actions, initialState)
const logger = createLogger({
	name: 'counter'
})

store.subscribe(logger)
store.subscribe(render)

render()

function render() {
	ReactDOM.render(
		<Counter {...store.getState()} {...store.actions} />,
		document.getElementById('container')
	)
}