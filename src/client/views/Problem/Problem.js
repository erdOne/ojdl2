import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { withSnackbar } from "notistack";

import { Typography, CircularProgress, Button, Fab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { CheckSharp as AC, ChangeHistorySharp as Tried } from "@material-ui/icons";
import { MDRenderer } from "client/components";
import { SubtaskDisplay, SampleDisplay } from "./components";
import styles from "./styles";
import verdicts from "common/verdicts";

function mapStateToProps({ user }) {
  return { user };
}

class Problem extends Component {
  static propTypes = {
    /* FromStyle */
    classes: PropTypes.object.isRequired,
    /* FromState */
    user: PropTypes.object,
    /* FromRouter */
    match: PropTypes.object,
    /* FromSnackbar */
    enqueueSnackbar: PropTypes.func
  }

  constructor(props) {
    super(props);
    var params = this.props.match.params;
    this.state = { dataLoaded: false, error: false };
    axios.post("/api/get_prob", { pid: params.pid, uid: this.props.user.uid, cid: params.cid })
      .then(res=>{
        console.log(res.data);
        if (res.data.error) throw res.data;
        this.setState({ prob: res.data.prob,
          status: res.data.AC ? "AC" : res.data.tried ? "TRIED" : null,
          dataLoaded: true });
      }).catch(res=>{
        this.setState({ error: true, errMsg: res.msg });
      });
  }

  render() {
    const { classes } = this.props;
    if (this.state.error)
      return (<div style={{ "textAlign": "center" }}><h4>{this.state.errMsg}</h4></div>);
    if (!this.state.dataLoaded)
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);

    const { pid, ppid } = this.state.prob, inContest = !!this.props.match.params.cid;
    return (
      <div className={classes.root}>
        <Typography variant="h1" style={{ marginBottom: 10 }}>
          {this.state.status &&
            (this.state.status === "AC"
              ? (<AC fontSize="large"
                style={{ verticalAlign: "text-top", color: verdicts[verdicts.AC].color[0] }} />)
              : (<Tried fontSize="large"
                style={{ verticalAlign: "text-top", color: verdicts[verdicts.PAC].color[0] }} />))}
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
              this.state.prob.samples.map((sample, si) =>
                <SampleDisplay sample={sample} id={si} key={si} />
              )
            }
          </div>
          {
            this.state.prob.testSuite.map((s, i) =>
              <SubtaskDisplay subtask={{ ...s, no: i }} key={i} />
            )
          }
          <big><MDRenderer source={this.state.prob.note} /></big>
          {this.state.prob.difficulty &&
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

export default connect(mapStateToProps)(withSnackbar(withStyles(styles)(Problem)));
