import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { withSnackbar } from "notistack";

import { Typography, CircularProgress, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ReactMarkdown from "react-markdown";

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
      width: 20,
      padding: "0 .5em",
      marginRight: ".5em",
      color: "#888",
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
  disabled: {}
});

function mapStateToProps({ user }) {
  return { user };
}

class Contest extends Component {
  constructor(props) {
    super(props);
    var params = this.props.match.params;
    this.state = { dataLoaded: false, error: false };
    axios.post("/api/get_cont", { cid: params.cid, uid: this.props.user.uid })
      .then(res=>{
        console.log(res.data);
        if (res.data.error) throw res.data;
        this.setState({ cont: res.data.cont, dataLoaded: true });
      }).catch(res=>{
        this.setState({ error: true, errMsg: res.msg });
      });
  }

  componentDidUpdate() {
    try {
      window.MathJax.startup.promise = window.MathJax.startup.promise.then(
        ()=>window.MathJax.typesetPromise()
      );
    } catch (e) {
      console.log("cannot typeset");
    }
  }

  render() {
    const { classes } = this.props;
    if (this.state.error)
      return (<div style={{ "textAlign": "center" }}><h4>{this.state.errMsg}</h4></div>);
    if (!this.state.dataLoaded)
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);
    const { cid } = this.state.cont;
    return (
      <div className={classes.root}>
        <div className={classes.actions}>
          {this.props.user.isAdmin &&
              <Link to={`/edit/contest/${cid}`}
                style={{ textDecoration: "none", margin: 10 }}
              >
                <Button variant="contained" color="primary">Edit</Button>
              </Link>
          }
        </div>
        <Typography variant="body1" component="div" className={classes.text}>
          <ReactMarkdown source={this.state.cont.content} />
        </Typography>
      </div>
    );
  }
}

Contest.propTypes = {
  /* FromStyle */
  classes: PropTypes.object.isRequired,
  /* FromState */
  user: PropTypes.object,
  /* FromRouter */
  match: PropTypes.object,
  /* FromSnackbar */
  enqueueSnackbar: PropTypes.func
};

export default connect(mapStateToProps)(withSnackbar(withStyles(styles)(Contest)));
