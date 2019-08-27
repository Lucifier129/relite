import { createStore, Action } from '../src/index'
import * as actions from './src/actions.helper'

describe('test-createStore', () => {
	it('should get current state by store.getState', () => {
		let store = createStore(actions, { count: 0 })

		expect(store.getState()).toEqual({ count: 0 })
	})

	it('should change state by calling actions', () => {
		let store = createStore(actions, { count: 0 })

		store.actions.INCREMENT()
		expect(store.getState()).toEqual({ count: 1 })

		store.actions.DECREMENT()
		expect(store.getState()).toEqual({ count: 0 })

		store.actions.EXEC_BY(10)
		expect(store.getState()).toEqual({ count: 10 })
	})

	it('should change state by store.replaceState', () => {
		let store = createStore(actions, { count: 0 })

		store.replaceState({ count: 3 })
		expect(store.getState()).toEqual({ count: 3 })
	})

	it('should change state by store.dispatch', () => {
		let store = createStore(actions, { count: 3 })

		store.dispatch('INCREMENT')
		expect(store.getState()).toEqual({ count: 4 })

		store.dispatch('EXEC_BY', -4)
		expect(store.getState()).toEqual({ count: 0 })
	})

	it('should trigger listeners after state changed', () => {
		let store = createStore(actions, { count: 0 })
		let listener = (data) => {
			let {
				actionType,
				actionPayload,
				start,
				end,
				previousState,
				currentState
			} = data

			expect(actionType).toEqual('EXEC_BY')
			expect(actionPayload).toEqual(10)
			expect(previousState).toEqual({ count: 0 })
			expect(currentState).toEqual({ count: 10 })
			expect(start instanceof Date).toBeTruthy()
			expect(end instanceof Date).toBeTruthy()
		}

		store.subscribe(listener)
		store.actions.EXEC_BY(10)
	})

	it('should not trigger listeners if state is not changed', () => {
		let store = createStore(actions, { count: 1 })
		let listener = jest.fn()

		store.subscribe(listener)

		store.actions.INCREMENT()
		expect(listener).toBeCalledTimes(1)
	})

	it('should unsubscribe listener', () => {
		let store = createStore(actions, { count: 1 })
		let listener = jest.fn()
		let unsubscribe = store.subscribe(listener)

		store.actions.INCREMENT()
		expect(listener).toBeCalledTimes(1)

		unsubscribe()
		store.actions.INCREMENT()
		expect(listener).toBeCalledTimes(1)
	})

	it('state type is correct', () => {
		type ObjectAlias = object;

		interface State extends ObjectAlias {
			location?: object
		}

		let state: State = {}

		const IIIII: Action<State> = (state) => state
		let actions = {
			IIIII
		}

		createStore(actions, state)
	})

})