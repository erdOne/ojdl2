import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import { withSnackbar } from "notistack";

import {
  Paper,
  Table,
  Dialog,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  DialogContent,
  CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Editor from "components/Editor";
import { SubtaskResultDisplay, Verdict } from "./components";
import verdicts from "common/verdicts";
import languages from "common/languages";

const styles = theme => ({
  root: {
    position: "relative"
  },
  paper: {
    position: "relative",
    border: [1, "solid"]
  },
  editor: {
    "& .CodeMirror": {
      height: "auto",
      boxShadow: "none"
    }
  },
  table: {
    width: "100%"
  },
  bold: {
    "&, & *": {
      fontWeight: 700,
      color: "rgba(0, 0, 0, 0.8)"
    }
  },
  actions: {
    position: "absolute",
    right: 0,
    top: 0
  },
  action: {
    zIndex: 10,
    //borderRadius: [0, 0, 0, 4],
    padding: [2, 15],
    margin: [2, 1],
    fontSize: "max(8px, 40%)"
  },
  dialog: {
    "&:first-child": {
      paddingTop: 0
    }
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
  }
});

function mapStateToProps({ user, contest }) {
  return { user, contest };
}

function typesetMath() {
    // typesetMath
    try {
      window.MathJax.startup.promise = window.MathJax.startup.promise.then(
        ()=>window.MathJax.typesetPromise()
      );
    } catch (e) {
      console.log("cannot typeset");
      console.log(e);
    }
}

class Submission extends Component {
  static propTypes = {
    /* FromStyle */
    classes: PropTypes.object.isRequired,
    /* FromState */
    user: PropTypes.object,
    contest: PropTypes.object,
    /* FromRouter */
    match: PropTypes.object,
    history: PropTypes.object,
    /* FromSnackbar */
    enqueueSnackbar: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = { dataLoaded: false, error: false, sub: {}, dialogOpen: false, dialogContent: "" };
    this.pollingId = 0;
    this.loadSub(true);
    this.onEdit = this.onEdit.bind(this);
    this.loadSub = this.loadSub.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.copy = this.copy.bind(this);
    this.componentDidMount = this.componentDidUpdate = () => typesetMath();
  }

  loadSub(withData, pollingId) {
    if (withData)pollingId = ++this.pollingId;
    else if (pollingId !== this.pollingId) return;
    const params = this.props.match.params;
    axios.post("/api/get_sub",
      { sid: params.sid, uid: this.props.user.uid, cid: params.cid, withData })
      .then(res=>{
        console.log(res.data);
        if (res.data.error) throw res.data;
        if (withData)
          this.setState({
            sub: res.data.sub,
            code: res.data.file.data,
            hasCode: res.data.file.hasData, dataLoaded: true
          });
        else
          this.setState({ sub: { ...this.state.sub, ...res.data.sub } });
        if (res.data.sub.result.pending)
          setTimeout(()=>this.loadSub(false, pollingId), 300);
      }).catch(res=>{
        this.setState({ error: true, errMsg: res.msg });
      });
  }

  onEdit() {
    axios.post("/api/edit_sub", {
      sid: this.state.sub.sid,
      uid: this.props.user.uid,
      code: this.state.code
    }).then(res=>{
      if (res.error)console.log(res.errMsg);
      else this.loadSub(true);
    });
  }

  openDialog(dialogContent) {
    this.setState({
      dialogOpen: true,
      dialogContent
    });
  }

  copy(text) {
    if (navigator.clipboard)
      navigator.clipboard.writeText(text)
        .then(()=>this.props.enqueueSnackbar("已成功複製"));
  }

  render() {
    const { classes } = this.props;
    if (this.state.error)
      return (<div style={{ "textAlign": "center" }}><h4>{this.state.errMsg}</h4></div>);
    if (!this.state.dataLoaded || (this.props.match.params.cid && !this.props.contest.inContest))
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);

    const { sub } = this.state, { openDialog } = this;
    const { inContest } = this.props.contest;
    const pid = inContest ? sub.pid = this.props.contest.problems.find(prob => prob.ppid === sub.pid).pid : sub.pid;
    var verdict = verdicts[sub.verdict || verdicts.UN];
    return (
      <div className={classes.root}>
        <Typography variant="h2" style={{ marginBottom: 10 }}>
          Submission
          <small style={{ fontSize: "", color: "gray" }}>
            {" #" + sub.sid}
          </small>
        </Typography>
        <Paper className={classes.paper}
          style={{ borderColor: verdict.color[1], borderWidth: sub.result.pending ? 0 : 1 }}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow className={classes.bold}
                style={{ backgroundColor: sub.result.pending ? undefined : verdict.color[2] }}>
                <TableCell>題目</TableCell>
                <TableCell>上傳者</TableCell>
                <TableCell>語言</TableCell>
                <TableCell>繳交時間</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Link to={`../problem/${pid}`} className={classes.link}>
                    {`#${pid}: ${sub.problem.title}`}
                  </Link>
                </TableCell>
                <TableCell>{sub.user.handle}</TableCell>
                <TableCell>{languages[sub.language].text}</TableCell>
                <TableCell>{new Date(sub.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Table className={classes.table} size="small">
            <TableHead className={classes.bold}>
              <TableRow className={classes.bold}>
                <TableCell></TableCell>
                <TableCell>Total time (ms)</TableCell>
                <TableCell>Max Memory (KB)</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{sub.result.time}</TableCell>
                <TableCell>{sub.result.memory}</TableCell>
                <TableCell className={classes.bold}>{sub.result.score}</TableCell>
                <TableCell className={classes.bold}>
                  <Verdict
                    verdict={sub.result.verdict}
                    msg={sub.result.msg}
                    openDialog={openDialog}
                  />
                </TableCell>
              </TableRow>
              {
                sub.result.subtaskResult.map((subRes, key) =>
                  <SubtaskResultDisplay {...{ subRes, key, classes, openDialog }}/>
                )
              }
            </TableBody>
          </Table>
          {this.state.hasCode &&
            <div style={{ position: "relative" }}>
              <div className={classes.actions}>
                {this.props.user.isAdmin &&
                  <Button variant="contained" color="primary" onClick={this.onEdit}
                    className={classes.action}>
                    Edit+Rejudge
                  </Button>
                }
                <Button variant="contained" color="primary" onClick={() => this.copy(this.state.code)}
                  className={classes.action}>
                  Copy
                </Button>
              </div>
              <Editor mode={languages[sub.language].mode} className={classes.editor}
                onChange={code => this.setState({ code })} code={this.state.code}
                readOnly={!this.props.user.isAdmin}/>
            </div>
          }
        </Paper>
        <Dialog open={this.state.dialogOpen} onClose={()=>this.setState({ dialogOpen: false })}>
          <DialogContent classes={{ root: classes.dialog }}>
            <pre>{this.state.dialogContent}</pre>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withSnackbar(withRouter(withStyles(styles)(Submission))));
