interface State {
  count: number
}

export type Action<
  State extends object,
  Payload = unknown
> = unknown extends Payload
  ? <S extends State>(state: S) => S
  : <S extends State>(state: S, payload: Payload) => S

export const NOCHANGE: Action<State> = (state) => {
  return state
}

export const CHANGE: Action<State, number> = (state, count) => {
  return {
    ...state,
    count
  }
}