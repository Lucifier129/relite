export const NOCHANGE = (state: any) => {
  return state
}

export const CHANGE = (state: any) => {
  return {
    ...state,
    count: state.count
  }
}