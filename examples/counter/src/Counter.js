import React, { Component } from 'react'

export default function Counter(props) {
	let {
		count,
		input,
		INCREMENT,
		DECREMENT,
		INCREMENT_IF_ODD,
		INCREMENT_ASYNC,
		EXEC,
		CHANGE_INPUT,
	} = props
	return (
		<div>
			<span>count: { count }</span>
			{' '}
			<button onClick={INCREMENT.bind(this, 'aaa', 'bbb', {'hello': 'world'})}>+</button>
			{' '}
			<button onClick={DECREMENT}>-</button>
			{' '}
			<button onClick={INCREMENT_IF_ODD}>incrementIfOdd</button>
			{' '}
			<button onClick={INCREMENT_ASYNC}>incrementAsync</button>
			{' '}
			<input type="text" onChange={CHANGE_INPUT} value={input} />
			<button onClick={EXEC}>exec</button>
		</div>
	)
}