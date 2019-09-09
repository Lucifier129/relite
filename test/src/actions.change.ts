export const NOCHANGE = (state) => {
  return state
}

export const CHANGE = state => {
  return {
    ...state,
    count: state.count
  }
}