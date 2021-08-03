import { ENTER_CONTEST, LEAVE_CONTEST } from "client/actions/actions";
import { createReducer } from "./utils.js";

function leaveContest(state, action) {
  return { inContest: false };
}

function enterContest(state, { contest }) {
  return { inContest: true, ...contest };
}

const userReducer = createReducer({ inContest: false }, {
  [ENTER_CONTEST]: enterContest,
  [LEAVE_CONTEST]: leaveContest
});

export default userReducer;
