const INITIAL_STATE = {
  tcro: []
};

export default function models(state = INITIAL_STATE.tcro, action) {
  switch (action.type) {
    case "FETCH_TCRO":
    default:
      return state;
  }
};
