export const UNDEFINED = (state: object) => {
  let a;
  return a;
};

export const STANDARD = (state: {}) => {
  return {
    bb: "bb",
  };
};

export const PAYLOAD = (
  state: {},
  payload: {
    cc: number;
  }
) => {
  return {
    cc: "bb",
  };
};

export const ANY = (state: {}) => {
  let a: any;
  return a;
};
