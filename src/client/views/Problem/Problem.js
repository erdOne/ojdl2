import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { withSnackbar } from "notistack";

import { Typography, CircularProgress, Button, Fab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { MDRenderer } from "components";
import { SubtaskDisplay } from "./components";

const styles = theme => ({
  codeblock: {
    color: "saddlebrown",
    /* text-shadow: "0 1px white", */
    fontFamily: "'Inconsolata', Monaco, Consolas, 'Andale Mono', monospace",
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.3",
    tabSize: "4",
    hyphens: "none",
    position: "relative",
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: [25, 12, 7, 12],
    border: ["solid", 1, "rgba(51, 51, 51, 0.12)"],
    background: "rgba(246, 246, 246, 0.2)",
    counterReset: "line",
    "& code span::before": {
      counterIncrement: "line",
      content: "counter(line)",
      display: "inline-block",
      borderRight: "1px solid #ddd",
      textAlign: "right",
      width: 20,
      padding: "0 0.3em 0 0",
      marginRight: ".5em",
      color: "#888"
    }
  },
  labels: {
    position: "absolute",
    background: "#e8e6e3",
    top: 0,
    left: 0,
    fontFamily: ["BlinkMacSystemFont", "Segoe UI", "Roboto",
      "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", "sans-serif"],
    color: "#555",
    fontSize: ".9rem",
    border: "none",
    borderBottom: ["solid", 1, "rgba(51, 51, 51, 0.12)"],
    "& > span": {
      padding: [1, 5],
      borderRight: ["solid", 1, "rgba(51, 51, 51, 0.12)"]
    }
  },
  actions: {
    position: "absolute",
    top: 0,
    right: 0,
    "& button": {
      width: 90
    }
  },
  root: {
    position: "relative"
  },
  fab: {
    "&$disabled": {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontSize: "24pt"
    }
  },
  disabled: {}
});

function mapStateToProps({ user }) {
  return { user };
}

class Problem extends Component {
  constructor(props) {
    super(props);
    var params = this.props.match.params;
    this.state = { dataLoaded: false, error: false };
    axios.post("/api/get_prob", { pid: params.pid, uid: this.props.user.uid, cid: params.cid })
      .then(res=>{
        console.log(res.data);
        if (res.data.error) throw res.data;
        this.setState({ prob: res.data.prob, dataLoaded: true });
      }).catch(res=>{
        this.setState({ error: true, errMsg: res.msg });
      });
  }

  componentDidUpdate() {
/*
    try {
      window.MathJax.startup.promise = window.MathJax.startup.promise.then(
        ()=>window.MathJax.typesetPromise()
      );
    } catch (e) {
      console.log("cannot typeset");
    }
*/
  }

  render() {
    const { classes } = this.props;
    const copy = text => {
      if (navigator.clipboard)
        navigator.clipboard.writeText(text)
          .then(()=>this.props.enqueueSnackbar("已成功複製"));
    };
    if (this.state.error)
      return (<div style={{ "textAlign": "center" }}><h4>{this.state.errMsg}</h4></div>);
    if (!this.state.dataLoaded)
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);

    const { pid, ppid } = this.state.prob, inContest = !!this.props.match.params.cid;
    return (
      <div className={classes.root}>
        <Typography variant="h1" style={{ marginBottom: 10 }}>
          {this.state.prob.title}
          <small style={{ fontSize: "", color: "gray" }}>
            {" #" + pid}
          </small>
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {this.state.prob.subtitle}
        </Typography>
        <div className={classes.actions}>
          <Link to={`../submit/${pid}`} style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">Submit</Button>
          </Link>
          {this.props.user.isAdmin &&
            <Link to={`/edit/problem/${inContest ? ppid : pid}`}
              style={{ textDecoration: "none", margin: 10 }}
            >
              <Button variant="contained" color="primary">Edit</Button>
            </Link>
          }
        </div>
        <Typography variant="body1" component="div" className={classes.text}>
          <big>
            <MDRenderer source={this.state.prob.content} />
            <h2>Samples: </h2>
          </big>
          <div>
            {
              this.state.prob.samples.map((sample, si) => (
                <div style={{ marginBottom: 10 }} key={si}>
                  <pre className={classes.codeblock} style={{ marginBottom: 0 }}>
                    <span className={classes.labels}>
                      <span>Input</span>
                      <span onClick={()=>copy(sample[0])}>Copy</span>
                    </span>
                    <code>
                      {
                        sample[0].split("\n").map((x, i) => (
                          [<span key={`Sample${si}-Input${i}`}>{x}</span>, <br key={i} />]
                        ))
                      }
                    </code>
                  </pre>
                  <pre className={classes.codeblock} style={{ borderTop: 0, marginTop: 0 }}>
                    <span className={classes.labels}>
                      <span>Output</span>
                      <span onClick={()=>copy(sample[1])}>Copy</span>
                    </span>
                    <code>
                      {
                        sample[1].split("\n").map((x, i) => (
                          [<span key={`Sample${si}-Output${i}`}>{x}</span>, <br key={i} />]
                        ))
                      }
                    </code>
                  </pre>
                </div>
              ))
            }
          </div>
          {
            this.state.prob.testSuite.map((s, i) =>
              <SubtaskDisplay subtask={{ ...s, no: i }} key={i}/>
            )
          }
          <big><MDRenderer source={this.state.prob.note} /></big>
          {this.state.prob.difficulty === undefined ? null :
            <div>
              <Fab disabled classes={{ root: classes.fab, disabled: classes.disabled }}>
                {this.state.prob.difficulty}
              </Fab>
            </div>
          }
        </Typography>
      </div>
    );
  }
}

Problem.propTypes = {
  /* FromStyle */
  classes: PropTypes.object.isRequired,
  /* FromState */
  user: PropTypes.object,
  /* FromRouter */
  match: PropTypes.object,
  /* FromSnackbar */
  enqueueSnackbar: PropTypes.func
};

export default connect(mapStateToProps)(withSnackbar(withStyles(styles)(Problem)));
