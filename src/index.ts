/**
 * relite
 *
 * A redux-like library for managing state with simpler api.
 */
import $createStore from "./createStore"
import $createLogger from "./createLogger"

/** Action */

/**
 * The Action should be a function with two argements and return something.
 */
export type UnionToIntersection<U> = (U extends any
  ? (k: U) => void
  : never) extends ((k: infer I) => void)
  ? I
  : never

export type UnionStateFromAS<AS> = {
  [K in keyof AS]: AS[K] extends AnyAction
    ? ReturnType<AS[K]> & number extends ReturnType<AS[K]> & string
      ? {}
      : ReturnType<AS[K]>
    : {}
}[keyof AS]

export type StateFromAS<AS> = UnionToIntersection<UnionStateFromAS<AS>>

export type StandardActions<S extends object, AS> = {
  [K in keyof AS]: AS[K] extends Action<S, PayloadFromAction<AS[K]>>
    ? AS[K]
    : AnyAction
}

/**
 * A function looks like a reducer of redux, but more simple and powerful.
 *
 * An `Action` consist of `Action` type, `Action` payload, `Action` handler
 * and `Action` result. `Action` type is the identifier of this function.
 * `Action` handler is the body of this function. `Action` result is the
 * result of function.
 *
 * In each `Action`, change the attribute needed and retain another attribute.
 * Suggest to use `...state` accomplish it.
 *
 * @template S The type of state to be held by the store.
 * @template P The type of `Payload` that used to change the state as a assist.
 *
 * @param state A snapshoot of current state. Will create new state based
 * on it.
 * @param [payload] Some useful data help to create new state. So we can
 * set it optionally.
 *
 * @returns  A new state created just now.
 */

export interface AnyAction<S extends object = {}, P = unknown, RS = unknown> {
  (state: S, payload: P): RS
}

export type Action<S extends object, P = unknown> = AnyAction<S, P, S>

export interface CurringAction<S extends object> {
  (): S
}

export interface CurringActionWithPreload<S extends object, P> {
  (p: P): S
}

export interface CurringActionWithPreloadOptional<S extends object, P> {
  (p?: P): S
}

/**
 * The collection of `Action`.
 *
 * @template S The type of state to be held by the store.
 */
export type Actions<S extends object> = Record<string, AnyAction<S>>

/**
 * In Relite, before actions exported by `store` them must be currying from some
 * `Action` those looks like `(s: State, p?: Payload) => State` to a `CurryingAction`
 * that looks like `(p?: Payload) => State` firstly.
 *
 * The actions consist of `Action` need map to the actions consist of `CurringAction`.
 *
 * The code hint of actions and the `Payload` type hint will work after doing this.
 *
 * @template S The type of state to be held by the store.
 * @template AS The type of actions consist of `Action`. It will be map to the actions
 * that store will export.
 */
// export type Curring<S extends object, A> = A extends AnyAction<S, infer P>
//   ? P extends string | number | boolean | object | undefined | null
//   ? Exclude<P, undefined> extends unknown
//   ? CurringActionWithPreload<S, P>
//   : CurringActionWithPreloadOptional<S, P>
//   : CurringAction<S>
//   : AnyAction<S>

type Diff<T, U> = T extends U ? never : T

type A = (state: object, p?: string) => object

// type B<A> = A extends ((s: object, p: infer Payload) => object) ? Payload : '123'

type B<A> = A extends ((...args: infer ARGS) => object) ? ARGS : "123"

type Args<F> = F extends ((...args: infer ARGS) => any) ? ARGS : never

type Arg1<F> = F extends ((arg0, arg1: infer ARG1) => any) ? ARG1 : never

/**
 * [state, payload?] = [state] + [state, payload]
 * match [state, payload]
 * match [state]
 * otherwise is [state, payload?]
 */
export type Curring<
  State extends object,
  Action extends AnyAction<State>
> = Args<Action> extends [object, any]
  ? CurringActionWithPreload<State, Arg1<Action>>
  : Args<Action> extends [object]
    ? CurringAction<State>
    : CurringActionWithPreloadOptional<State, Arg1<Action>>

/**
 * The cyrring `Actions`. Each `Action` in this will be optional.
 *
 * @template S The type of state to be held by the store.
 * @template AS The type of actions consist of `Action`. It will be map to the actions
 * that store will export.
 */
export type Currings<S extends object, AS extends Actions<S>> = {
  readonly [k in keyof AS]: Curring<S, AS[k]>
}

/**
 * Infer the `Payload` data shape from an `Action`.
 *
 * @template A The type of `Action` which we want to infer from.
 */
export type PayloadFromAction<A> = A extends Action<object, infer P> ? P : A

/** Data */

/**
 * A object that record all information of once change of state.
 *
 * It will be used when state will change while `dispatch()` or
 * `replaceState()` been called.
 *
 * @template S The type of state to be held by the store.
 */
export interface Data<S extends object> {
  /**
   * The identifier `actionType` of `Action` of this change.
   */
  actionType: string

  /**
   * The additional `Payload` data of a change from the `Action` of this
   * change.
   */
  actionPayload: PayloadFromAction<Action<S>>

  /**
   * The snapshoot of state before this change. The state that passed into
   * `Action`.
   */
  previousState: S
  /**
   * The state will be after this change. The state that returned from
   * `Action`.
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
   * If the result of `Action` is a Promise.
   */
  isAsync: boolean
}

/** Store */

/**
 * An addit of store to add listener which listen the state change.
 *
 * @template S The type of state to be held by the store.
 */
export interface Subscribe<S extends object> {
  (listener: Listener<S>): () => void
}

/**
 * An callback will been called when state has changed which has been add by
 * `subscribe()`. The state change information, `Data`, will been passed in
 * when call it.
 *
 * @template S The type of state to be held by the store.
 *
 * @param [data] The data object that record the change of once `Action` has
 * been called by `dispatch()`.
 */
export interface Listener<S extends object> {
  (data?: Data<S>): any
}

/**
 * An broadcast function which will call all listener added before. The
 * parameter `Data` passed into listener is it's parameter `Data`. So we
 * do not know if this `Data` really occur.
 *
 * @template S The type of state to be held by the store.
 */
export interface Publish<S extends object> {
  (data: Data<S>): void
}

/**
 * A setter of state which recover previous state forcedly. It may make
 * the state change uncertainly.
 *
 * @template S The type of state to be held by the store.
 */
export interface ReplaceState<S extends object> {
  (nextState: S, data?: Data<S>, silent?: boolean): void
}

/**
 * A dispatcher that construct a new `Data` which record information of
 * new change of state by calling `Action` and call `updateState()` to
 * change state predictably.
 *
 * @template S The type of state to be held by the store.
 */
export interface Dispatch<S extends object> {
  (actionType: string, actionPayload?: PayloadFromAction<Action<S>>): S
}

/**
 * An state updator which get the final next state and call `replaceState()`
 * to change state.
 *
 * @template S The type of state to be held by the store.
 *
 * @param nextState all type which `Action` may return a state.
 *
 * @returns The next state object.
 */
export interface StateUpdator<S extends object> {
  (nextState: S): S
}

/**
 * An object which export all API for change `state` and attach listener.
 *
 * @template S The type of state to be held by the store.
 * @template AS The type of actions consist of `Action`.
 */
export interface Store<S extends object, AS extends Actions<S>> {
  /**
   * Contain all caller curring from `Action` passed in `createStore` and
   * `dispatch`. Could call dispatch whith mapped `Action` type.
   *
   * CurryingAction
   */
  actions: Partial<Currings<S, AS>>

  /**
   * Reads the state tree managed by the store.
   *
   * @returns The current state tree of your application that just can read.
   */
  getState(): S

  /**
   * Cover the state with the new state and the data passed in. It will
   * change the state unpredictably called by user directly.
   *
   * @param nextState It could be a state `object` will be the next state.
   * @param [data] The object that record al information of current change.
   * @param [silent] The signature indicate if we need to `publish()`. `true`
   * indicate not. `false` indicate yes. Default value is `false`.
   */
  replaceState: ReplaceState<S>
  /**
   * Dispatches an Action. It is the only way to trigger a state change.
   *
   *
   * The base implementation only supports plain object actions. If you want
   * to dispatch a Promise, you need pass in a Promise `Action`.
   *
   * @param actionType A plain string that is the identifier of an `Action`
   * which representing “what changed”. It is a good idea to keep actions
   * serializable so you can record and replay user sessions, or use the time
   * travelling `redux-devtools`. It is a requirement to use string constants
   * for Action types.
   * @param [actionPayload] Some useful data help to create new `state`. So
   * we can set it optionally.
   *
   * @returns For convenience, the next state object you changed to.
   */
  dispatch: Dispatch<S>

  /**
   * Adds a change listener. It will be called any time an Action is
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
   *
   * @returns `unsubscribe` A function to remove this listener.
   */
  subscribe: Subscribe<S>

  /**
   * Broadcast all the listener attached before.
   *
   * @param data The state change information.The data object that need to
   * pass in all `Listener`.
   */
  publish: Publish<S>
}

/**
 * A *StoreCreator* can create a global Relite store that hold the state tree,
 * state, and also create getter and setter, `dispatch` and currying `actions`,
 * of it with `actions` and initialState. It support subscribe changes of state
 * implements with Observer design pattern.
 *
 * `createStore(reducer, preloadedState)` exported from the Relite package,
 * from store creators.
 *
 * @template S The type of state to be held by the store.
 * @template AS The type of actions those may be call by dispatch.
 */
export interface StoreCreator {
  <S extends object, AS extends Actions<S & StateFromAS<AS>>>(
    actions: AS,
    initialState?: S
  ): Store<S & StateFromAS<AS>, AS>
}

/**
 * Create a global Relite store that hold the state tree, state, and also export
 * getter and setter, `dispatch` and `actions`,of it with `actions` and
 * initialState. It support subscribe changes of state implements with Observer
 * design pattern.
 *
 * @param actions An object who contains all the actions those can create state
 * and return it through passed previous state and `Payload` data.
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
 *
 * @template S The type of state to be held by the store.
 */
export interface LoggerCreator {
  <S extends object>(props?: LoggerProps<S>): LogInfo<S>
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
 *
 * @template S The type of state to be held by the store.
 */
export interface LoggerProps<S extends object> {
  /** the identifier of this logger */
  name?: string
  /** a middleware which will adapt `data` */
  filter?: Filter<S>
}

/**
 * A type of `listener` of Relite store.
 *
 * @template S The type of state to be held by the store.
 *
 * @param data A record of store state change.
 */
export interface LogInfo<S extends object> {
  (data: Data<S>): void
}

/**
 * A *Filter* is a middleware to sort `data`.
 *
 * @template S The type of state to be held by the store.
 *
 * @param data The `data` before sorting.
 *
 * @returns The `data` after sorting.
 */
export interface Filter<S extends object> {
  (data: Data<S>): Data<S>
}

/**
 * A time string formatter.
 */
export interface Pad {
  (num: number): string
}
