import { createStore, Action, Actions, AnyAction, Data, getKeys } from "../index"
import * as actions from "./src/actions.helper"
import * as errorAction from "./src/actions.error"
import * as changeAction from "./src/actions.change"
import * as anyActions from './src/actions.any'

describe("test-createStore", () => {
  it("actions should be object", () => {
    try {
      // @ts-ignore
      createStore(null as Actions<Partial<object & {}>>)
    } catch (e) {
      expect((e as Error).message).toMatch(
        "Expected first argument to be an object"
      )
    }
  })

  it("should not continue to work after throw an error", () => {
    let store = createStore(errorAction, {})
    try {
      store.actions.TEST(store)
    } catch (e) {
      expect((e as Error).message).toMatch(
        "store.dispatch(actionType, actionPayload): handler may not dispatch"
      )
    }
  })

  it("should not refresh state when don't have any change", () => {
    let store = createStore(changeAction, { count: 0 })
    let listener = jest.fn()

    store.subscribe(listener)
    store.actions.CHANGE(3)

    expect(listener).toBeCalledTimes(1)

    store.actions.NOCHANGE()

    expect(listener).toBeCalledTimes(1)
  })

  it("should get current state by store.getState", () => {
    let store = createStore(actions, { count: 0 })

    expect(store.getState()).toEqual({ count: 0 })
  })

  it("should change state by calling actions", () => {
    let store = createStore(actions, { count: 0 })

    store.actions.INCREMENT()
    expect(store.getState()).toEqual({ count: 1 })

    store.actions.DECREMENT()
    expect(store.getState()).toEqual({ count: 0 })

    store.actions.EXEC_BY(10)
    expect(store.getState()).toEqual({ count: 10 })
  })

  it("should change state by store.replaceState", () => {
    let store = createStore(actions, { count: 0 })

    let actionKeys = getKeys(actions)

    let newState = { count: 3 }
    let data = {
      actionType: actionKeys[3],
      actionPayload: 3,
      previousState: { count: 0 },
      currentState: { count: 3 },
      start: new Date(),
      end: new Date()
    }

    store.replaceState(newState, data)
    expect(store.getState()).toEqual({ count: 3 })
  })

  it("should change state by store.dispatch", () => {
    let store = createStore(actions, { count: 3 })

    store.dispatch("INCREMENT")
    expect(store.getState()).toEqual({ count: 4 })

    store.dispatch("EXEC_BY", -4)
    expect(store.getState()).toEqual({ count: 0 })
  })

  it("should trigger listeners after state changed", () => {
    let state = { count: 0 }
    let store = createStore(actions, state)
    let listener = (data: Data<typeof state, typeof actions>) => {
      let {
        actionType,
        actionPayload,
        start,
        end,
        previousState,
        currentState
      } = data

      expect(actionType).toEqual("EXEC_BY")
      expect(actionPayload).toEqual(10)
      expect(previousState).toEqual({ count: 0 })
      expect(currentState).toEqual({ count: 10 })
      expect(start instanceof Date).toBeTruthy()
      expect(end instanceof Date).toBeTruthy()
    }

    store.subscribe(listener)
    store.actions.EXEC_BY(10)
  })

  it("should not trigger listeners if state is not changed", () => {
    let store = createStore(actions, { count: 1 })
    let listener = jest.fn()

    store.subscribe(listener)

    store.actions.INCREMENT()
    expect(listener).toBeCalledTimes(1)
  })

  it("should unsubscribe listener", () => {
    let store = createStore(actions, { count: 1 })
    let listener = jest.fn()
    let unsubscribe = store.subscribe(listener)

    store.actions.INCREMENT()
    expect(listener).toBeCalledTimes(1)

    unsubscribe()
    store.actions.INCREMENT()
    expect(listener).toBeCalledTimes(1)
  })

  it("state type guide is correct", () => {
    type ObjectAlias = object

    interface State extends ObjectAlias {
      location?: object
    }

    let state: State = {}

    const IIIII: Action<State> = state => state
    let actions = {
      IIIII
    }

    createStore(actions, state)
  })

  it("should throw error when action ty is not function", () => {
    let actions = {
      // @ts-ignore
      IIII: undefined as AnyAction<{}, unknown, Partial<object & {}>>
    }

    try {
      createStore(actions, {})
    } catch (e) {
      expect((e as Error).message).toMatch("Action must be a function. accept")
    }
  })

  it("should warning when listener has been unsubscribe twice", () => {
    let store = createStore(actions, { count: 1 })
    let listener = jest.fn()

    jest.spyOn(global.console, "warn")

    let unsubscribe = store.subscribe(listener)

    unsubscribe()
    unsubscribe()

    expect(console.warn).toBeCalledTimes(1)
  })

  it("should warning when listener has been unsubscribe twice", () => {
    let state = { count: 1 }
    let store = createStore(actions, state)
    let listener = jest.fn()

    store.subscribe(listener)
    store.actions.INCREMENT()

    expect(listener).toBeCalledTimes(1)

    let actionKeys = getKeys(actions)
    let data = {
      actionType: actionKeys[2],
      actionPayload: undefined,
      previousState: { count: 0 },
      currentState: { count: 3 },
      start: new Date(),
      end: new Date()
    }
    store.replaceState({ count: 2 }, data, true)

    expect(listener).toBeCalledTimes(1)
  })
})