import { SIGN_IN, SIGN_OUT } from "client/actions/actions.js";
import { createReducer } from "./utils.js";
import axios from "axios";

function signOut(state, action) {
  return { active: false };
}

function signIn(state, { uid, isAdmin }) {
  return { ...state, uid, isAdmin, active: true };
}

const userReducer = createReducer({ active: false }, {
  [SIGN_IN]: signIn,
  [SIGN_OUT]: signOut
});

export default userReducer;
