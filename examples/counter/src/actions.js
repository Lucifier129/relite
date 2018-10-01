// actions

export let INCREMENT = (state, a,b,c) => {
    console.log(state, a,b,c)
    let count = state.count + 1
    return {
        ...state,
        count,
    }
}

export let INCREMENT_ASYNC = async (state) => {
    await delay(1000)
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

export let CHANGE_INPUT = (state, event) => {
    let { value: input } = event.currentTarget
    return {
        ...state,
        input,
    }
}

export let EXEC = (state) => {
    let { count, input } = state
    let value = Number(input)
    if (isNaN(value)) {
        return state
    }
    count += value
    return {
        ...state,
        count,
    }
}

function delay(timeout = 0, value) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), timeout)
    })
}