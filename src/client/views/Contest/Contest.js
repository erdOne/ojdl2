import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { withSnackbar } from "notistack";

import { Typography, CircularProgress, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { MDRenderer } from "components";

const styles = theme => ({
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
  static propTypes = {
    /* FromStyle */
    classes: PropTypes.object.isRequired,
    /* FromState */
    user: PropTypes.object,
    /* FromRouter */
    match: PropTypes.object,
    /* FromSnackbar */
    enqueueSnackbar: PropTypes.func
  };

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
          <MDRenderer source={this.state.cont.content} />
        </Typography>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withSnackbar(withStyles(styles)(Contest)));
