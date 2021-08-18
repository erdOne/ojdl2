import { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import { enterContest, leaveContest } from "client/actions";

function mapStateToProps({ contest, user }) {
  //var inContest = !!state.contest;
  return {
    inContest: contest.inContest,
    user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    leave: ()=>dispatch(leaveContest()),
    enter: cont=>dispatch(enterContest(cont))
  };
}

class Controller extends Component {
  static propTypes = {
    /* FromState */
    inContest: PropTypes.bool.isRequired,
    user: PropTypes.object,
    /* FromRouter */
    history: PropTypes.object,
    /* FromDispatch */
    leave: PropTypes.func.isRequired,
    enter: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onEnter = this.onEnter.bind(this);
  }

  onEnter({ match }) {
    axios.post("/api/get-cont", { uid: this.props.user.uid, cid: match.params.cid })
      .then(res => {
        if (res.data.error)
          this.props.history.push("/not-found");
        else this.props.enter(res.data.cont);
      });
    return null;
  }

  render() {
    var { inContest, leave } = this.props;
    return (
      <Switch>
        <Route path="/contest/:cid" component={inContest ? null : this.onEnter } />
        <Route component={()=>((inContest && leave(), null))} />
      </Switch>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Controller));
