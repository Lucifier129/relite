/**
 * relite
 */
import $createStore from './createStore'
import $createLogger from './createLogger'


const Relite = {
  createStore: $createStore,
  createLogger: $createLogger
}

export const createStore = $createStore
export const createLogger = $createLogger

export default Relite

namespace Relite {
  export interface State {
    [propName: string]: any
  }

  export type Type = string

  export type Payload = any

  export interface Data {
    actionType: Type
    actionPayload: Payload
    previousState: State
    currentState: State
    start: Date
    end: Date
    isAsync: boolean
  }

  export interface Action {
    (
      state: State,
      payload?: Payload
    ): State | Promise<State>
  }

  export interface InnerAction {
    (payload?: Payload): State | Promise<State>
  }

  export interface InnerActions {
    [propName: string]: InnerAction
  }

  export interface Actions {
    [propName: string]: Action
  }

  export interface Store {
    actions?: InnerActions
    getState: GetState
    replaceState: ReplaceState
    dispatch: Dispatch
    subscribe: Subscribe
    publish: Publish
  }

  export interface CreateStore {
    (
      actions: Actions,
      initialState?: State
    ): Store
  }

  export interface Listener {
    (data: Data): void
  }

  export interface Subscribe {
    (listener: Listener): () => void
  }

  export interface Publish {
    (data: Data): void
  }

  export interface GetState {
    (): State
  }

  export interface ReplaceState {
    (
      nextState: State,
      data?: Data,
      silent?: boolean
    ): void
  }

  export interface NextStateFun {
    (
      currentState: State,
      actionPayload: Payload
    ): State
  }

  export type NextStatePromise = Promise<State | NextStateFun>

  export type NextState = State | NextStateFun | NextStatePromise

  export interface UpdateState {
    (nextState: NextState): State
  }

  export interface Dispatch {
    (actionType: Type, actionPayload?: Payload): State
  }
  
  export interface Filter {
    (data: Data): Data
  }

  export interface LoggerProps {
    name?: string
    filter?: Filter
  }
  
  export interface LogInfo {
    (data: any): void
  }

  export interface CreateLogger {
    (prop: LoggerProps): LogInfo
  }

  export interface Pad {
    (num: number): string
  }

  export interface Identity {
    (obj: any): any
  }
}