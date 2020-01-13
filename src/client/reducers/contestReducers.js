import { ENTER_CONTEST, LEAVE_CONTEST } from "actions/actions";
import { createReducer } from "./utils";

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
