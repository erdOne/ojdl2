export function createReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (typeof action.type !== "symbol") return state;
    console.log(action.type);
    if (action.type in handlers)
      return handlers[action.type](state, action);
    else
      // console.log("reducer not found");
      // console.log(action, handlers);
      return state;

  };
}
