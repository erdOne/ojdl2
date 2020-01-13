import * as actions from "./actions.js";

export function signOut() {
  return { type: actions.SIGN_OUT };
}

export function signIn(uid, isAdmin) {
  return { type: actions.SIGN_IN, uid, isAdmin };
}

export function leaveContest() {
  return { type: actions.LEAVE_CONTEST };
}

export function enterContest(contest) {
  return { type: actions.ENTER_CONTEST, contest };
}
