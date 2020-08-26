// actions

export let INCREMENT = (state: any) => {
  let current = state.count + 1;
  return {
    ...state,
    count: current,
  };
};

export let DECREMENT = (state: any) => {
  let count = state.count - 1;
  return {
    ...state,
    count,
  };
};

export let EXEC_BY = (state: any, input: any) => {
  let value = Number(input);
  return isNaN(value)
    ? state
    : {
        ...state,
        count: state.count + value,
      };
};

function delay(timeout = 0, value?: any) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), timeout);
  });
}
