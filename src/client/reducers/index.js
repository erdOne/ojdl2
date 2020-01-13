import { combineReducers } from "redux";

import userReducer from "./userReducers.js";
import contestReducer from "./contestReducers.js";

export default async () => {
  return combineReducers({
    user: await userReducer,
    contest: contestReducer
  });
};
