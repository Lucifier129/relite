// actions

export let INCREMENT = (state) => {
    let count = state.count + 1
    return {
        ...state,
        count,
    }
}

export let INCREMENT_ASYNC = async (state) => {
    await delay(10)
    return INCREMENT
}

export let DECREMENT = (state) => {
    let count = state.count - 1
    return {
        ...state,
        count,
    }
}

export let INCREMENT_IF_ODD = (state) => {
    return state.count % 2 !== 0 ? INCREMENT : state
}

export let EXEC_BY = (state, input) => {
    let value = Number(input)
    return isNaN(value) ? state : {
        ...state,
        count: state.count + value
    }
}

function delay(timeout = 0, value) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), timeout)
    })
}