import expect from 'expect'
import createStore from '../../src/createStore'
import * as actions from './actions-helper'

describe('test-createStore', () => {

	it('should throw error when given invalid arguments', () => {
		let block = () => {
			createStore('invalid argument')
		}

		expect(block).toThrow(`Expected first argument to be an objec`)
	})

	it('should return object with valid arguments', () => {
		let store = createStore(actions, 'initialState')

		expect(store.dispatch).toBeA('function')
		expect(store.getState).toBeA('function')
		expect(store.replaceState).toBeA('function')
		expect(store.subscribe).toBeA('function')
		expect(store.publish).toBeA('function')
		expect(store.actions).toBeA('object')
		expect(Object.keys(actions)).toEqual(Object.keys(store.actions))
	})

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

	it('should change state by async action', async () => {
		let store = createStore(actions, { count: 9 })

		await store.actions.INCREMENT_ASYNC()
		expect(store.getState()).toEqual({ count: 10 })

		await store.dispatch('INCREMENT_ASYNC')
		expect(store.getState()).toEqual({ count: 11 })

		await store.dispatch('EXEC_BY', -11)
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
			expect(start).toBeA(Date)
			expect(end).toBeA(Date)
		}

		store.subscribe(listener)
		store.actions.EXEC_BY(10)
	})

	it('should not trigger listeners if state is not changed', () => {
		let store = createStore(actions, { count: 1 })
		let listener = expect.createSpy()

		store.subscribe(listener)

		store.actions.INCREMENT()
		expect(listener.calls.length).toBe(1)

		store.actions.INCREMENT_IF_ODD()
		expect(listener.calls.length).toBe(1)
	})

	it('should unsubscribe listener', () => {
		let store = createStore(actions, { count: 1 })
		let listener = expect.createSpy()
		let unsubscribe = store.subscribe(listener)

		store.actions.INCREMENT()
		expect(listener.calls.length).toBe(1)

		unsubscribe()
		store.actions.INCREMENT()
		expect(listener.calls.length).toBe(1)
	})

})