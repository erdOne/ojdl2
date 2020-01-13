import { Component } from "react";
import { Switch, Redirect } from "react-router-dom";

import { RouteWithLayout as Route } from "./components";
import { Main, Minimal } from "./layouts";

import Controller from "./controllers";

import {
  Dashboard,
  Account,
  Settings,
  SignUp,
  SignIn,
  NotFound,
  Problems,
  Submit,
  Problem,
  AddProblem,
  Submission,
  AddContest,
  Contests,
  Contest,
  Standings,
  Bulletin,
  Submissions
} from "./views";

class Routes extends Component {
  render() {
    return (
      <div>
        <Controller />
        <Switch>
          <Route component={Dashboard} layout={Main} exact path={["/", "/dashboard"]} />
          <Route component={Problems} layout={Main} strict exact
            path={["/problems", "/contest/:cid/problems"]} />
          <Route component={Bulletin} layout={Main} strict exact path="/contest/:cid/bulletin" />
          <Route component={Standings} layout={Main} strict exact path="/contest/:cid/standings" />
          <Route component={Contest} layout={Main} strict exact path="/contest/:cid" />
          <Route component={Submission} layout={Main} strict exact
            path={["/submission/:sid", "/contest/:cid/submission/:sid"]} />
          <Route component={Contests} layout={Main} exact path="/contests" />
          <Route component={AddContest} layout={Main} strict exact
            path={["/add/contest", "/edit/contest/:cid"]} />
          <Route component={AddProblem} layout={Main} strict exact
            path={["/add/problem", "/edit/problem/:pid"]} />
          <Route component={Problem} layout={Main} strict exact
            path={["/problem/:pid", "/contest/:cid/problem/:pid"]} />
          <Route component={Submit} layout={Main} strict exact
            path={["/submit/:pid?", "/contest/:cid/submit/:pid?"]} />
          <Route component={Submissions} layout={Main} strict exact
            path={["/submissions", "/contest/:cid/submissions"]} />
          <Route component={Account} layout={Main} exact path="/account" />
          <Route component={Settings} layout={Main} exact path="/settings" />
          <Route component={SignUp} layout={Minimal} exact path="/sign-up" />
          <Route component={SignIn} layout={Minimal} exact path="/sign-in" />
          <Route component={NotFound} layout={Minimal} exact path="/not-found" />
          <Redirect to="/not-found" />
        </Switch>
      </div>
    );
  }
}


export default Routes;
