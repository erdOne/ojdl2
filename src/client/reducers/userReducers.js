import { SIGN_IN, SIGN_OUT } from "client/actions/actions.js";
import { createReducer } from "./utils.js";
import axios from "axios";

function signOut(state, action) {
  return { active: false };
}

function signIn(state, { uid, isAdmin }) {
  return { ...state, uid, isAdmin, active: true };
}

async function getUserFromCookie() {
  const res = await axios.post("/api/sign-in-cookie");
  if (res.data.error) throw res.data.msg;
  const { uid, isAdmin } = res.data;
  if (!uid) throw "no user";
  return {
    active: true,
    uid, isAdmin,
  };
}

const userReducer = getUserFromCookie()
  .catch(e => ({ active: false }))
  .then(state => createReducer(state, {
    [SIGN_IN]: signIn,
    [SIGN_OUT]: signOut
  }));

export default userReducer;
