// actions

export let INCREMENT = (state) => {
  let current = state.count + 1
  return {
      ...state,
      count: current
  }
}

export let DECREMENT = (state = { count: 0 }) => {
  let count = state.count - 1
  return {
    ...state,
    count
  }
}

export let EXEC_BY = ({ count = 0, ...rest } = {}, input = 0) => {
  let value = Number(input)
  return isNaN(value) ? {
    count,
    ...rest
  } : {
    ...rest,
    count: count + value
  }
}

function delay(timeout = 0, value?: any) {
  return new Promise(resolve => {
      setTimeout(() => resolve(value), timeout)
  })
}