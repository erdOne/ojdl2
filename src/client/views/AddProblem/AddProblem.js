import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { withSnackbar } from "notistack";

import {
  Paper,
  Typography,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Slider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { MDEditor } from "components";
import { TestSuiteDisplay, SamplesDisplay } from "./components";

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
  }
});

const StyledSlider = withStyles(theme => ({
  root: {
    width: "98%"
  },
  mark: {
    height: 8,
    width: 1,
    marginTop: -3,
  },
  vertical: {

  }
}))(Slider);

function mapStateToProps({ user }) {
  return { user };
}

class Problem extends Component {
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
      dataLoaded: !this.props.match.params.pid,
      error: false,
      title: "",
      subtitle: "",
      testMethod: "string",
      judgeParam: "",
      visibility: "hidden",
      difficulty: 10,
      content: "\n\n## Input:\n\n## Output:\n",
      testSuite: [],
      samples: [],
      note: "## Note:\n"
    };
    this.fileUploadRef = React.createRef();
    this.init().catch(err=>{
      this.setState({ error: true, errMsg: err });
    });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDifficultySliderChange = this.handleDifficultySliderChange.bind(this);
    this.getProps = this.getProps.bind(this);
  }

  async getAdmin() {
    return this.props.user.active && (this.props.user.isAdmin ||
        (await axios.post("/api/is-admin", {
          uid: this.props.user.uid
        })).data);
  }

  async loadData(pid) {
    var res = await axios.post("/api/get_prob", { pid, uid: this.props.user.uid });
    if (res.error) throw res.errMsg;
    this.setState({ pid, ...res.data.prob, dataLoaded: true });
  }

  async init() {
    if (!await this.getAdmin()) {
      this.props.enqueueSnackbar("你沒有權限瀏覽此頁面");
      this.props.history.goBack();
      return;
    }
    var pid = this.props.match.params.pid;
    if (pid) await this.loadData(pid);
  }

  getProb() {
    var prob = { ...this.state };
    delete prob.dataLoaded; delete prob.error;
    return prob;
  }

  getFormData() {
    var formData = new FormData();
    formData.set("uid", this.props.user.uid);
    formData.set("prob", JSON.stringify(this.getProb()));
    for (var file of this.fileUploadRef.current.files)
      formData.append(file.name, file);
    return formData;
  }

  handleSubmit(e) {
    e.preventDefault();
    axios.post("/api/add-prob", this.getFormData())
      .then(res => this.props.history.push(`/problem/${res.data.pid}`))
      .catch(err => this.setState({ error: true, errMsg: err }));
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleDifficultySliderChange(e, v) {
    this.setState({ difficulty: v });
  }

  getProps(key, half = false) {
    return {
      label: key.split(/(?=[A-Z])/).map(i => i.toLowerCase()).join(" ").capitalize(),
      name: key,
      value: this.state[key] ?? "",
      onChange: this.handleChange,
      className: half ? this.props.classes.textFieldHalf : this.props.classes.textField
    };
  }

  render() {
    if (this.state.error)
      return (<div style={{ "textAlign": "center" }}><h4>{this.state.errMsg}</h4></div>);
    if (!this.state.dataLoaded)
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);

    const { classes } = this.props;
    const { pid, difficulty, samples, testSuite, note, content, testMethod } = this.state;
    const getProps = this.getProps;

    return (
      <div className={classes.root}>
        <Typography variant="h2" style={{ marginBottom: 10 }}>
          {pid ? <>
              Edit problem
              <small style={{ fontSize: "", color: "gray" }}>
                {" #" + pid}
              </small>
              </> : "Add problem"
          }
        </Typography>
        <Typography variant="body1" component="div" className={classes.text}>
          <form onSubmit = {this.handleSubmit}>
            <Paper className={classes.paper}>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <TextField {...getProps("title", "half")}/>
                <TextField {...getProps("subtitle", "half")}/>
                <TextField select {...getProps("visibility")}>
                  {
                    ["visible", "contest", "hidden"]
                      .map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)
                  }
                </TextField>
                <TextField select {...getProps("testMethod")}>
                  {
                    ["string", "float", "special"]
                      .map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)
                  }
                </TextField>
                <TextField {...getProps("judgeParam")} label="Error margin"
                  disabled={testMethod !== "float"}/>
                <div className={classes.sliderContainer}>
                  <Typography gutterBottom>Difficulty</Typography>
                  <StyledSlider
                    track={false}
                    min={0} max={20} value={difficulty}
                    marks={[0, 10, 20].map(i =>({ value: i, label: i }))}
                    valueLabelDisplay="auto"
                    onChange={this.handleDifficultySliderChange}
                  />
                </div>
              </div>
            </Paper>
            <Paper className={classes.paper}>
              <MDEditor value={content} onChange={v=>this.setState({ content: v })} />
            </Paper>
            <SamplesDisplay value={samples} name="samples" onChange={this.handleChange} />
            <TestSuiteDisplay
              value={testSuite}
              name="testSuite"
              onChange={this.handleChange}
              fileUploadRef={this.fileUploadRef} />
            <Paper className={classes.paper}>
              <MDEditor value={note} onChange={v=>this.setState({ note: v })} />
            </Paper>
            <Button variant="contained" color="primary" type="submit">
              {pid ? "Edit" : "Add"}
            </Button>
          </form>
        </Typography>
      </div>
    );

  }
}

export default connect(mapStateToProps)(withStyles(styles)(withSnackbar(withRouter(Problem))));
