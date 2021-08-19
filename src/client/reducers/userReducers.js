import { SIGN_IN, SIGN_OUT } from "client/actions/actions.js";
import { createReducer } from "./utils.js";
import axios from "axios";

function signOut(state, action) {
  return { active: false };
}

function signIn(state, { uid, isAdmin }) {
  return { ...state, uid, isAdmin, active: true };
}

async function getUserFromStorage() {
  const { data } = await axios.post("/api/cookie-get-uid");
  if (data.error) throw data.msg;
  const { uid } = data;
  if (!uid) throw "no user";
  var res = await axios.post("/api/sign-in-uid", { uid });
  if (res.data.error) throw res.data.msg;
  return {
    active: true,
    uid,
    isAdmin: res.data.isAdmin
  };
}

const userReducer = getUserFromStorage()
  .catch(e => ({ active: false }))
  .then(state => createReducer(state, {
    [SIGN_IN]: signIn,
    [SIGN_OUT]: signOut
  }));

export default userReducer;
