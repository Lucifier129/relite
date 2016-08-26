import React from 'react'

export default function Counter({ count, handleIncre, handleDecre, handleOdd, handleAsync, handleInput }) {
	return (
		<div>
			<span>count: { count }</span>
			{' '}
			<button onClick={ handleIncre }>+</button>
			{' '}
			<button onClick={ handleDecre }>-</button>
			{' '}
			<button onClick={ handleOdd }>incrementIfOdd</button>
			{' '}
			<button onClick={ handleAsync }>async</button>
			{' '}
			<input type="text" ref="input" />
			<button onClick={ handleInput }>run</button>
		</div>
	)
}