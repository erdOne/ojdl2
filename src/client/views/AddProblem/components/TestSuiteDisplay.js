import { PureComponent } from "react";
import PropTypes from "prop-types";
import { react as bind } from "auto-bind";

import {
  List,
  Paper,
  Button,
  Divider,
  ListItem,
  TextField,
  Typography,
  IconButton,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import EditAllDialog from "./EditAllDialog";

const NumString = PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired;

const styles = theme => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "15%",
    flexShrink: 0,
    marginTop: "auto",
    marginBottom: "auto"
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  textFieldWide: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    flexBasis: "70%"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  summaryContent: {
    width: "100%",
    "@media (max-width: 600px)": {
      flexDirection: "column"
    }
  },
  paper: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(3, 2),
    background: "none"
  },
  buttons: {
    margin: theme.spacing(0, 1)
  },
  expandActions: {
    display: "flex",
    flexDirection: "row",
    "& > *": {
      flexBasis: "33%"
    }
  },
  expandDetails: {
    padding: theme.spacing(0, 3)
  },
  testcaseItem: {
    "@media (max-width: 500px)": {
      flexDirection: "column"
    }
  },
  hidden: {
    display: "none"
  }
});

function splice(arr, ...args) { arr.splice(...args); return arr; }

class TestcaseDisplay extends PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    timeLimit: NumString,
    memLimit: NumString,
    onChange: PropTypes.func.isRequired,
    no: PropTypes.number,
    offset: PropTypes.number
  }

  constructor(props) {
    super(props);
    bind(this);
  }

  handleChange(modifier) {
    let no = this.props.no;
    this.props.onChange(s => {
      s.testcases[no] = modifier(s.testcases[no]);
      s.updateFlag = Symbol("UPD");
      return s;
    });
  }

  deleteTestcase() {
    this.props.onChange(s=>{
      s.testcases.splice(this.props.no, 1);
      s.updateFlag = Symbol("UPD");
      return s;
    });
  }

  render() {
    const { classes, timeLimit, memLimit, no, offset } = this.props;
    return (
      <ListItem className={classes.testcaseItem}>
        <Typography style={{ flexBasis: "30%" }}>Testcase #{no + offset}</Typography>
        <TextField className={classes.textField} style={{ flexBasis: "30%" }}
          label="Time limit (ms)" value={timeLimit} onClick={e=>e.stopPropagation()}
          onChange={
            e=>this.handleChange(s => ({ ...s, timeLimit: e.target.value.replace(/[^0-9]/g, "") }))
          } />
        <TextField className={classes.textField} style={{ flexBasis: "30%" }}
          label="Memory limit (KB)" value={memLimit} onClick={e=>e.stopPropagation()}
          onChange={
            e=>this.handleChange(s => ({ ...s, memLimit: e.target.value.replace(/[^0-9]/g, "") }))
          } />
        <IconButton color="default" aria-label="delete"
          onClick={()=>this.deleteTestcase()}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
    );
  }
}

class SubtaskDisplay extends PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    subtask: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    callDialog: PropTypes.func.isRequired,
    no: PropTypes.number,
    offset: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { expanded: false };
    bind(this);
  }

  handleChange(modifier) {
    let no = this.props.no;
    this.props.onChange(s=>{
      s[no] = modifier(s[no]);
      //console.log(s);
      return s;
    });
  }

  deleteSubtask() {
    this.props.onChange(s=>splice(s, this.props.no, 1));
  }

  addTestCase() {
    this.handleChange(s => {
      s.testcases.push({
        timeLimit: "",
        memLimit: ""
      });
      s.updateFlag = Symbol("UPD");
      return s;
    });
  }

  render() {
    const { classes, subtask, callDialog, offset, no } = this.props;
    const { expanded } = this.state;
    return (
      <ExpansionPanel expanded={expanded && !!subtask.testcases.length}
        onChange={()=>this.setState({ expanded: !expanded })}>
        <ExpansionPanelSummary classes={{ content: classes.summaryContent }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading} variant="h4">
          Subtask #{no + 1}
          </Typography>
          <TextField label="Description" className={classes.textField} style={{ flexBasis: "70%" }}
            value={subtask.description} onClick={e=>e.stopPropagation()}
            onChange={e=>this.handleChange(s => {
              s.description = e.target.value;
              s.updateFlag = Symbol("UPD");
              return s;
            })}
          />
          <TextField label="Score" className={classes.textField} style={{ flexBasis: "15%" }}
            value={subtask.score} onClick={e=>e.stopPropagation()}
            onChange={e=>this.handleChange(s => {
              s.score = e.target.value.replace(/[^0-9]/g, "");
              s.updateFlag = Symbol("UPD");
              return s;
            })}
          />
          <div className = {classes.expandActions} onClick={e=>e.stopPropagation()}>
            <IconButton color="default" aria-label="delete"
              onClick={this.deleteSubtask}>
              <DeleteIcon />
            </IconButton>
            <IconButton color="primary" aria-label="edit all" onClick={()=>callDialog(no)}>
              <EditIcon />
            </IconButton>
            <IconButton color="primary" aria-label="add testcase"
              onClick={this.addTestCase}>
              <AddIcon />
            </IconButton>
          </div>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails className={classes.expandDetails}>
          <List style={{ width: "100%" }}>
            { this.props.subtask.testcases.map((x, i) =>
              [i ? <Divider key={i + "div"}/> : null,
                <TestcaseDisplay key={i}
                  {...{ classes, onChange: this.handleChange,
                    ...x, no: i, offset } }
                />]
            ) }
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

class TestSuiteDisplay extends PureComponent {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.shape({
      description: PropTypes.string.isRequired,
      score: NumString,
      testcases: PropTypes.arrayOf(PropTypes.shape({
        timeLimit: NumString,
        memLimit: NumString,
      }))
    })),
    onChange: PropTypes.func,
    name: PropTypes.string.isRequired,
    fileUploadRef: PropTypes.any,
    /* FromStyle */
    classes: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      dialog: false,
      fileDisplay: ""
    };
    bind(this);
  }

  wrap(value) {
    return { target: { name: this.props.name, value } };
  }

  addSubtask(i = this.props.value.length) {
    this.onChange(v => splice(v, i, 0, {
      description: "",
      score: "",
      testcases: []
    }));
  }

  onChange(modifier) {
    this.props.onChange(this.wrap(modifier([ ...this.props.value ])));
  }

  callDialog(id) {
    this.setState({ dialog: true, dialogPending: id });
  }

  dialogOnClose(x) {
    this.setState({ dialog: false });
    if (!x) return;
    var { timeLimit, memLimit } = x;
    if (timeLimit === undefined || memLimit === undefined)
      return;
    var sub = this.props.value[this.state.dialogPending];
    if (!sub) return;
    this.onChange(v => Object.assign(v, {
      [this.state.dialogPending]: {
        ...sub,
        testcases: Array.from(sub.testcases, ()=>({ timeLimit, memLimit }))
      }
    }));
  }

  fileOnChange(e) {
    this.setState({
      fileDisplay: Array.from(e.target.files).map(x=>x.name).join(", ")
    });
  }

  render() {
    const { classes, value } = this.props;
    var offsets = [1];
    for (var subtask of value)
      offsets.push(offsets[offsets.length - 1] + subtask.testcases.length);
    return (
      <Paper className={classes.paper}>
        <Typography variant="h3" style={{ marginBottom: 10 }}>
        Test suite
          <Button onClick={()=>this.addSubtask()} className={classes.buttons}
            variant="contained" color="primary">
            Add subtask
          </Button>
          <input id="upload" multiple type="file" onChange={this.fileOnChange}
            className={classes.hidden} ref={this.props.fileUploadRef} />
          <label htmlFor="upload">
            <Button component="span" variant="contained" color="primary">Upload</Button>
          </label>
          <TextField style={{ marginLeft: 8, width: 250, top: -8, marginTop: 0 }} margin="dense"
            label="Uploaded files" value={this.state.fileDisplay} readOnly />
        </Typography>
        <div className={classes.root}>
          {
            value.map((s, i) =>
              <SubtaskDisplay key={i}
                {...{ classes, subtask: s, no: i, offset: offsets[i], upd: s.updateFlag ?? true,
                  onChange: this.onChange, callDialog: this.callDialog }} />
            )
          }
        </div>
        <EditAllDialog open={this.state.dialog} onClose={this.dialogOnClose} />
      </Paper>
    );
  }
}

export default withStyles(styles)(TestSuiteDisplay);
