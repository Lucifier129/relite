/**
 * relite
 * 
 * A redux-like library for managing state with simpler api (1kb).
 */
import $createStore from './createStore'
import $createLogger from './createLogger'

/** Action */

/**
 * `actionType` will be the identifier of action, so it must be a `string`.
 */
export type Type = string

/**
 * Some data will help `dispatch` construct new state, it is addtional data.
 * so it can be `any`.
 */
export type Payload = any

/**
 * A function looks like a reducer of redux, but more simple and powerful.
 * 
 * An `action` consist of `action` type, `action` payload, `action` handler
 * and `action` result. `action` type is the identifier of this function.
 * `action` handler is the body of this function. `action` result is the 
 * result of function.
 * 
 * In each `action`, change the attribute needed and retain another attribute.
 * Suggest to use `...state` accomplish it.
 * 
 * When action-handler return a promise, it will call updateState at
 * `promise.then`.
 * 
 * use async/await syntax will be better for handling async action
 * 
 * @param state A snapshoot of current state. Will create new state based
 * on it.
 * 
 * @param [payload] Some useful data help to create new `state`. So we can
 * set it optionally.
 * 
 * @returns  A new state created just now.
 */
export interface Action<S extends object, P = any> {
  (
    state: S | undefined,
    payload?: P
  ): S
}

export type PayloadFromAction<A> = A extends Action<object, infer S> ? S : A

/** Data */

/**
 * A object that record all information of once change of state.
 * 
 * It will be used when state will change while `dispatch` or `replaceState`
 * been called.
 */
export interface Data<S extends object> {
  /**
   * The identifier of `action` of this change.
   */
  actionType: string

  /**
   * The additional data if this change.
   */
  actionPayload: PayloadFromAction<Action<S>>

  /**
   * The snapshoot of state before this change. The state that passed into
   * `action`.
   */
  previousState: S
  /**
   * The state will be after this change. The state that returned from 
   * `action`.
   */
  currentState: S
  /**
   * The start time of this change occur.
   */
  start: Date
  /**
   * The finished time of this change occur.
   */
  end: Date
  /**
   * If the result of `action` is a Promise.
   */
  isAsync: boolean
}

/** Store */

/**
 * An addit of store to add listener which listen the state change.
 */
export interface Subscribe<S extends object> {
  (listener: Listener<S>): () => void
}

/**
 * An callback will been called when state has changed which has been add by
 * `subscribe`. The state change information, `Data`, will been passed in
 * when call it.
 */
export interface Listener<S extends object> {
  (data?: Data<S>): any
}

/**
 * An broadcast function which will call all listener added before. The
 * parameter `Data` passed into listener is it's parameter `Data`. So we
 * do not know if this `Data` really occur.
 */
export interface Publish<S extends object> {
  (data: Data<S>): void
}

/**
 * A setter of state which recover previous state forcedly. It may make
 * the state change uncertainly.
 */
export interface ReplaceState<S extends object> {
  (
    nextState: S,
    data?: Data<S>,
    silent?: boolean
  ): void
}

/**
 * A dispatcher that construct a new `Data` which record information of
 * new change of state by calling `action` and call `updateState` to
 * change state predictably.
 */
export interface Dispatch<S extends object> {
  (actionType: string, actionPayload?: PayloadFromAction<Action<S>>): S
}

/**
 * An state updator which get the final next state and call `replaceState`
 * to change state.
 * 
 * @param nextState all type which `action` may return. state, `function`
 * or `Promise`.
 * 
 * @returns The next state object.
 */
export interface StateUpdator<S extends object> {
  (nextState: S): S
}


export type Curring<S extends object, AS> = {
  readonly [k in keyof AS]: AS[k] extends Action<S, infer P> ? (p?: P) => S : AS[k]
}
/**
 * An object which export all API for change `state` and attach listener.
 */
export interface Store<S extends object, AS extends Record<string, Action<S>>> {
  /**
   * Contain all caller curring from `action` passed in `createStore` and
   * `dispatch`. Could call dispatch whith mapped `action` type.
   * 
   * CurryingAction
   * 
   * @param [payload] Extend from `actionPayload` of 'Action' parameters.
   */
  actions: Partial<Curring<S, AS>>

  /**
   * Reads the state tree managed by the store.
   *
   * @returns The current state tree of your application.
   */
  getState(): Readonly<S>

  /**
   * Cover the state with the new state and the data passed in. It will
   * change the state unpredictably called by user directly.
   * 
   * Passed 
   * 
   * @param nextState It could be a state `object` will be the next state.
   */
  replaceState: ReplaceState<S>
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   *
   * The base implementation only supports plain object actions. If you want
   * to dispatch a Promise, you need pass in a Promise `action`.
   *
   * @param actionType A plain string that is the identifier of an `action`
   * which representing “what changed”. It is a good idea to keep actions 
   * serializable so you can record and replay user sessions, or use the time
   * travelling `redux-devtools`. It is a requirement to use string constants
   * for action types.
   * 
   * @param [actionPayload] Some useful data help to create new `state`. So
   * we can set it optionally.
   *
   * @returns For convenience, the next state object you changed to.
   */
  dispatch: Dispatch<S>

  /**
   * Adds a change listener. It will be called any time an action is
   * dispatched, and some part of the state tree may potentially have changed.
   * You may then call `getState()` to read the current state tree inside the
   * callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked,
   * this will not have any effect on the `dispatch()` that is currently in
   * progress. However, the next `dispatch()` call, whether nested or not,
   * will use a more recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all states changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param listener A callback to be invoked on every dispatch.
   * @returns A function to remove this change listener.
   */
  subscribe: Subscribe<S>

  /**
   * Broadcast all the listener attached before.
   * 
   * @param data The state change information.
   */
  publish: Publish<S>
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

/**
 * A *StoreCreator* can create a global Relite store that hold the state tree, 
 * state, and also create getter and setter, `dispatch` and currying `actions`, 
 * of it with `actions` and initialState. It support subscribe changes of state
 * implements with Observer design pattern.
 * 
 * `createStore(reducer, preloadedState)` exported from the Relite package,
 * from store creators.
 */
export interface StoreCreator {
  <S extends object, AS extends Record<string, Action<S>>>(
    actions: AS,
    initialState?: DeepPartial<S>
  ): Store<S, AS>
}

/**
 * Create a global Relite store that hold the state tree, state, and also export 
 * getter and setter, `dispatch` and `actions`,of it with `actions` and 
 * initialState. It support subscribe changes of state implements with Observer
 * design pattern.
 * 
 * @param actions An object who contains all the actions those can create state
 * and return it through passed previous state and `payload`.
 * 
 * @param [initialState] The initial state. You may optionally specify it.
 * 
 * @returns A Relite store that lets you read the state, dispatch actions and
 * subscribe to changes. It contains the setter of state, `replaceState`,
 * `dispatch` and all the `actions` whose have been encapsulated  with function 
 * currying, the getter of state, `getState`, and the subscribe API,
 * `subscribe` and `publish`.
 */
export const createStore: StoreCreator = $createStore

/** Logger */

/**
 * A *LoggerCreator* can create a logger which can record the information
 * when Relite running. The logger should been add to `store` as a listener.
 * 
 * `createLogger({name, filter})` exported from the Relite package from 
 * logger creators.
 */
export interface LoggerCreator {
  <S extends object, A extends Action<S>>(
    props?: LoggerProps<S, A>
  ): LogInfo<S, A>
}

/**
 * Export a `logInfo` as a `listener` which record the information of the
 * relite state change.
 * 
 * @param props It consists of `name` and `filter`. `name` is the identifier
 * of this logger. `filter` is a middleware which will adapt `data`.
 * 
 * @returns A listener to record store state changed.
 */
export const createLogger: LoggerCreator = $createLogger

/**
 * The arguments of LoggerCreator.
 */
export interface LoggerProps<S extends object, A extends Action<S>> {
  /** the identifier of this logger */
  name?: string
  /** a middleware which will adapt `data` */
  filter?: Filter<S, A>
}

/**
 * A type of `listener` of Relite store.
 * 
 * @param data A record of store state change.
 */
export interface LogInfo<S extends object, A extends Action<S>> {
  (data: Data<S>): void
}

/**
 * A *Filter* is a middleware to sort `data`.
 * 
 * @param data The `data` before sorting.
 * 
 * @returns The `data` after sorting.
 **/
export interface Filter<S extends object, A extends Action<S>> {
  (data: Data<S>): Data<S>
}

/**
 * A time string formatter.
 */
export interface Pad {
  (num: number): string
}