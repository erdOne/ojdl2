import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { withSnackbar } from "notistack";
import { react as bind } from "auto-bind";
import { toChars } from "common/char";

import {
  Paper,
  Typography,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  List,
  ListItemSecondaryAction,
  ListItemText,
  ListItem,
  IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Delete as DeleteIcon } from "@material-ui/icons";
import { KeyboardDateTimePicker } from "@material-ui/pickers";

import { MDEditor } from "components";

const styles = theme => ({
  text: {
    "& > p": {
      marginBottom: 30,
      marginTop: 10
    }
  },
  actions: {
    position: "absolute",
    top: 0,
    right: 0
  },
  buttons: {
    margin: theme.spacing(0, 1)
  },
  root: {
    position: "relative"
  },
  textField: {
    margin: theme.spacing(1, 1),
    width: "max(200px, 25vw)",
    fallbacks: {
      width: 200
    }
  },
  textFieldHalf: {
    margin: theme.spacing(1, 1),
    width: `calc(50% - 2 * ${theme.spacing(1)}px)`
  },
  textFieldThird: {
    margin: theme.spacing(1, 1),
    width: `calc(33% - 2 * ${theme.spacing(1)}px)`
  },
  hidden: {
    display: "none"
  },
  paper: {
    padding: theme.spacing(1, 1),
    margin: theme.spacing(3, 2),
    background: "none"
  },
  sliderContainer: {
    width: "40%",
    margin: theme.spacing(0, 1)
  },
  listItemText: {
    display: "flex",
    alignItems: "baseline"
  },
  title: {
    margin: theme.spacing(1, 1, -2, 1)
  },
  listItem: {
    paddingBottom: 0,
    paddingTop: 0
  }
});

function mapStateToProps({ user }) {
  return { user };
}

class AddContest extends Component {
  static propTypes = {
    /* FromRouter */
    match: PropTypes.object,
    /* FromState */
    user: PropTypes.object,
    /* FromStyle */
    classes: PropTypes.object.isRequired,
    /* FromSnackBar */
    enqueueSnackbar: PropTypes.func,
    /* FromRouter */
    history: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false,
      error: false,
      title: "",
      abbr: "",
      visibility: "hidden",
      content: "",
      problems: [],
      start: new Date(),
      end: new Date()
    };
    this.init().catch(err=>{
      this.setState({ error: true, errMsg: err });
    });
    bind(this);
  }

  async getAdmin() {
    return this.props.user.active && (this.props.user.isAdmin ||
        (await axios.post("/api/is-admin", {
          uid: this.props.user.uid
        })).data);
  }

  async loadData(cid) {
    var res = await axios.post("/api/get_cont", { cid, uid: this.props.user.uid });
    if (res.error) throw res.errMsg;
    var cont = res.data.cont;
    cont.problems = cont.problems.map(x => x.ppid);
    this.setState({ cid, ...cont, dataLoaded: true });
  }

  async init() {
    if (!await this.getAdmin()) {
      this.props.enqueueSnackbar("你沒有權限瀏覽此頁面");
      this.props.history.goBack();
      return;
    }
    this.allProblems =
      (await axios.post("/api/get_probs", { uid: this.props.user.uid })).data.probs;
    console.log(this.allProblems);
    var cid = this.props.match.params.cid;
    if (cid) await this.loadData(cid);
    else this.setState({ dataLoaded: true });
  }

  getCont() {
    var cont = { ...this.state };
    delete cont.dataLoaded; delete cont.error;
    return cont;
  }

  handleSubmit(e) {
    e.preventDefault();
    axios.post("/api/add-cont", { uid: this.props.user.uid, cont: this.getCont() })
      .then(res => {
        if (res.data.error) throw res.data.msg;
        this.props.history.push(`/contest/${res.data.cid}`);
      })
      .catch(err => this.setState({ error: true, errMsg: err }));
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleStartDateChange(v) {
    this.setState({ start: v });
  }

  handleEndDateChange(v) {
    this.setState({ end: v });
  }

  handleProblemChange(e) {
    this.setState({
      problems: Object.assign([...this.state.problems], { [e.target.name]: e.target.value })
    });
  }

  getProps(key, style = "") {
    var { classes } = this.props, className = ({
      "": classes.textField,
      half: classes.textFieldHalf,
      full: classes.textFieldWide,
      third: classes.textFieldThird
    })[style];
    return {
      label: key.split(/(?=[A-Z])/).map(i => i.toLowerCase()).join(" ").capitalize(),
      name: key,
      value: this.state[key],
      onChange: this.handleChange,
      className
    };
  }

  render() {
    if (this.state.error)
      return (<div style={{ "textAlign": "center" }}><h4>{this.state.errMsg}</h4></div>);
    if (!this.state.dataLoaded)
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);

    const { classes } = this.props;
    const { cid, content, start, end, problems } = this.state;
    const { getProps, allProblems } = this;
    console.log(allProblems);

    return (
      <div className={classes.root}>
        <Typography variant="h2" style={{ marginBottom: 10 }}>
          {cid ? <>
              Edit contest
              <small style={{ fontSize: "", color: "gray" }}>
                {" #" + cid}
              </small>
              </> : "Add contest"
          }
        </Typography>
        <Typography variant="body1" component="div" className={classes.text}>
          <form onSubmit = {this.handleSubmit}>
            <Paper className={classes.paper}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <TextField {...getProps("title", "half")}/>
                <TextField {...getProps("abbr", "half")}/>
                <TextField select {...getProps("visibility", "third")}>
                  {
                    ["visible", "hidden"]
                      .map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)
                  }
                </TextField>
                <KeyboardDateTimePicker
                  variant="inline"
                  ampm={false}
                  label="Contest start"
                  value={start}
                  maxDate={end}
                  onChange={this.handleStartDateChange}
                  onError={console.log}
                  format="yyyy/MM/dd HH:mm"
                  className={classes.textFieldThird}
                />
                <KeyboardDateTimePicker
                  variant="inline"
                  ampm={false}
                  label="Contest end"
                  value={end}
                  minDate={start}
                  onChange={this.handleEndDateChange}
                  onError={console.log}
                  format="yyyy/MM/dd HH:mm"
                  className={classes.textFieldThird}
                />
              </div>
            </Paper>
            <Paper className={classes.paper}>
              <MDEditor value={content} onChange={v=>this.setState({ content: v })} />
            </Paper>
            <Paper className={classes.paper}>
              <Typography variant="h3" className={classes.title}>Problem list
                <Button onClick={()=>this.setState({ problems: problems.concat([""]) })}
                  className={classes.buttons} variant="contained" color="primary">
                  Add problem
                </Button>
              </Typography>
              <List>
              {problems.map((pid, i) => {
                  var prob = allProblems.find(x => x.pid === Number(pid)),
                    error = !(prob || pid === "");
                  return (<ListItem key={i} classes={{ gutters: classes.listItem }}>
                    <ListItemText
                      classes={{ primary: classes.listItemText }}
                      primary={
                        <>
                        <Typography variant="subtitle2">
                          {`p${toChars(i)}.  `}
                        </Typography>
                          <TextField
                            name={i.toString()} value={pid} error={error}
                            className={classes.textField}
                            onChange={this.handleProblemChange} helperText={prob?.title}
                          />
                        </>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={e => this.setState({
                        problems: problems.slice(0, i).concat(problems.slice(i + 1))
                      })}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>);
                })}
              </List>
            </Paper>
            <Button variant="contained" color="primary" type="submit">
              {cid ? "Edit" : "Add"}
            </Button>
          </form>
        </Typography>
      </div>
    );

  }
}

export default connect(mapStateToProps)(withStyles(styles)(withSnackbar(withRouter(AddContest))));
