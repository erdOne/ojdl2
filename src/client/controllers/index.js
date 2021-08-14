import { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import { enterContest, leaveContest, signIn, signOut } from "client/actions";

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
    enter: cont=>dispatch(enterContest(cont)),
    signIn: (uid,isAdmin)=>dispatch(signIn(uid,isAdmin)),
    signOut: ()=>dispatch(signOut())
  };
}

let sleep = ms => new Promise(r=>setTimeout(r,ms));
let waitFor = async function waitFor(f){
  // need adjust
  for (let i = 0; i < 20 && !f(); i++) {
    await sleep(20);
  }
  return f();
};

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
    signIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.onEnter = this.onEnter.bind(this);
  }

  onEnter({ match }) {
    const cid = match.params.cid;
    waitFor(() => this.props.user.uid)
      .then(uid => axios.post("/api/get-cont", { uid, cid }))
      .then(res => {
        if (res.data.error)
          this.props.history.push("/not-found");
        else
          this.props.enter(res.data.cont);
      });
    return null;
  }

  componentDidMount() {
    // https://stackoverflow.com/questions/20325763/browser-sessionstorage-share-between-tabs
    let shareSessionStorage = function() {
      // console.log('share');
      let sessionStorage_transfer = function(event) {
        if (!event) { event = window.event; } // ie suq
        if (!event.newValue) return;          // do nothing if no value to work with
        if (event.key == 'getSessionStorage') {
          localStorage.setItem('sessionStorage', JSON.stringify(window.sessionStorage));
          localStorage.removeItem('sessionStorage');
        } else if (event.key == 'sessionStorage' && !window.sessionStorage.length) {
          // another tab sent data <- get it
          let data = JSON.parse(event.newValue);
          for (let key in data) {
            window.sessionStorage.setItem(key, data[key]);
          }
        }
      };

      // listen for changes to localStorage
      if (window.addEventListener) {
        window.addEventListener('storage', sessionStorage_transfer, false);
      } else {
        window.attachEvent('onstorage', sessionStorage_transfer);
      };

      // Ask other tabs for session storage (this is ONLY to trigger event)
      if (!window.sessionStorage.length) {
        localStorage.setItem('getSessionStorage', 'trigger');
        localStorage.removeItem('getSessionStorage', 'trigger');
      };
    };

    const { signIn, signOut } = this.props;
    const getUserFromStorage = async () => {
      var uid = await waitFor(() => window.sessionStorage.getItem("uid"));
      const res = await axios.post("/api/sign-in-uid", { uid });
      if (res.data.error) {
        // console.log({ uid });
        throw res.data.msg;
      }
      // console.log('login!', res);
      return { uid, isAdmin: res.data.isAdmin };
    };

    shareSessionStorage();
    getUserFromStorage()
      .then(({ uid, isAdmin }) => signIn(uid, isAdmin))
      .catch(e => { console.log(e); signOut() });
  }

  render() {
    const { inContest, leave } = this.props;
    return (
      <Switch>
        <Route path="/contest/:cid" component={inContest ? null : this.onEnter } />
        <Route component={()=>((inContest && leave(), null))} />
      </Switch>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Controller));
