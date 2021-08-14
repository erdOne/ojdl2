import { combineReducers } from "redux";

import userReducer from "./userReducers.js";
import contestReducer from "./contestReducers.js";

export default () => {
  return combineReducers({
    user: userReducer,
    contest: contestReducer
  });
};
