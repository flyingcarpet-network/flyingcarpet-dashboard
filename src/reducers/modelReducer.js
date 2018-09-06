const INITIAL_STATE = {
  models: []
};

export default function models(state = INITIAL_STATE.models, action) {
  switch (action.type) {
    case "FETCH_MODELS":
    default:
      return state;
  }
};
