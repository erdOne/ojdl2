import { SIGN_IN, SIGN_OUT } from "actions/actions";
import { createReducer } from "./utils.js";
import axios from "axios";

function signOut(state, action) {
  return { active: false };
}

function signIn(state, { uid, isAdmin }) {
  return { ...state, uid, isAdmin, active: true };
}

async function getUserFromStorage() {
  var uid = window.sessionStorage.getItem("uid");
  if (!uid) throw "no user";
  var res = await axios.post("/api/sign-in-uid", { uid });
  if (res.error) throw res.errMsg;
  console.log(res);
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
