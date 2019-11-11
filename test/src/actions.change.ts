interface State {
  count: number
}

export type Action<
  State extends object,
  Payload = unknown
> = unknown extends Payload
  ? (state: State) => State
  : (state: State, payload: Payload) => State

export const NOCHANGE: Action<State> = (state) => {
  return state
}

export const CHANGE: Action<State, number> = (state, count) => {
  return {
    ...state,
    count
  }
}