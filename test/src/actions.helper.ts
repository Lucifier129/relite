// actions

export let INCREMENT = (state) => {
  let current = state.count + 1
  return {
      ...state,
      count: current
  }
}

export let DECREMENT = (state) => {
  let count = state.count - 1
  return {
    ...state,
    count
  }
}

export let EXEC_BY = (state, input) => {
  let value = Number(input)
  return isNaN(value) ? state : {
    ...state,
    count: state.count + value
  }
}

function delay(timeout = 0, value?: any) {
  return new Promise(resolve => {
      setTimeout(() => resolve(value), timeout)
  })
}