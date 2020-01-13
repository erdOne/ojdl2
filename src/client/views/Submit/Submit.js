import { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";

import { CircularProgress } from "@material-ui/core";

import { SubmitDisplay } from "./components";
import languages from "common/languages";

function mapStateToProps({ user }) {
  return { user };
}

function findLanguageFromText(text) {
  return languages[Object.keys(languages).find(l=>languages[l].text === text)] || {};
}

class Submit extends Component {
  static propTypes = {
    /* FromRouter */
    match: PropTypes.object.isRequired,
    /* FromSnackbar */
    enqueueSnackbar: PropTypes.func,
    /* FromState */
    user: PropTypes.object,
    /* FromRouter */
    history: PropTypes.object
  }
  constructor(props) {
    super(props);
    const { cid = 0 } = this.props.match.params,
      { uid } = this.props.user;
    this.innerProps = {
      handleSubmit: () => {
        if (!this.props.user.active) {
          this.props.enqueueSnackbar("請先登入再上傳唷");
          return;
        }
        var lang = findLanguageFromText(this.state.language);
        if (!lang) {
          this.props.enqueueSnackbar("請選擇語言");
          return;
        }
        var pid = this.state.problem.match(/.+?(?= - )/);
        if (!pid) {
          this.props.enqueueSnackbar("請選擇題目");
          return;
        }
        pid = pid[0];
        axios.post("/api/submit", {
          pid,
          language: lang.id,
          code: this.state.code,
          uid,
          cid
        }).then(res => {
          if (res.error) throw new Error(res.errMsg);
          else this.props.history.push(`../submission/${res.data.sid}`);
        }).catch(err=>{
          this.setState({ error: true, errorMsg: err.message });
        });
      },
      handleChange: key => value =>
        this.setState({ [key]: value })
      ,
      languages: Object.keys(languages).map(l => languages[l].text)
    };
    this.state = { problemsLoaded: false };
    axios.post("/api/get_probs", { cid, uid })
      .then(res=>{
        if (res.data.err) throw new Error(res.data.msg);
        console.log(res.data);
        var problemDisplay = prob => prob ? `${prob.pid} - ${prob.title}` : "";
        this.innerProps.problems = res.data.probs.map(problemDisplay);
        this.setState({ problemsLoaded: true, problem: problemDisplay(
          res.data.probs.find(({ pid }) => pid.toString() === this.props.match.params.pid)
        ) });
      }).catch(err=>{
        this.setState({ error: true, errorMsg: err.message });
      });
  }

  render() {
    if (this.state.error)
      return (<div style={{ "textAlign": "center" }}><h4>{this.state.errMsg}</h4></div>);
    else if (this.state.problemsLoaded)
      return (<SubmitDisplay {...this.innerProps}
        problemSelected = {this.state.problem}
        languageSelected = {this.state.language} editorMode={
          findLanguageFromText(this.state.language).mode || "text/plain"
        } />);
    else
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);

  }
}

export default connect(mapStateToProps)(withSnackbar(withRouter(Submit)));
