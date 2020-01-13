import { Component } from "react";
import PropTypes from "prop-types";

import {
  Paper,
  Button,
  Divider,
  Typography,
  IconButton,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import Editor from "components/editor.jsx";

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
    justifyContent: "space-between"
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
    padding: theme.spacing(0),
    display: "flex",
  },
  editorContainer: {
    flexBasis: "50%",
    "& .CodeMirror": {
      height: 200
    }
  }
});

function splice(arr, ...args) { arr.splice(...args); return arr; }

class SampleDisplay extends Component {
  static propTypes = {
    classes: PropTypes.object,
    sample: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  deleteSample() {
    this.props.onChange(s=>splice([...s], this.props.sample.no, 1));
  }

  render() {
    const { classes, sample } = this.props;
    const { expanded } = this.state;
    var handleChange = (io, val) => console.log(io, val) ||
      this.props.onChange(s => Object.assign([...s], {
        [this.props.sample.no]: (v=>io ? [v[0], val] : [val, v[1]])(s[this.props.sample.no])
      }));
    return (
      <ExpansionPanel expanded={expanded}
        onChange={()=>this.setState({ expanded: !expanded })}>
        <ExpansionPanelSummary classes={{ content: classes.summaryContent }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading} variant="h4">
          Sample #{sample.no + 1}
          </Typography>
          <div className = {classes.expandActions} onClick={e=>e.stopPropagation()}>
            <IconButton color="default" aria-label="delete"
              onClick={()=>this.deleteSample()}>
              <DeleteIcon />
            </IconButton>
          </div>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails className={classes.expandDetails}>
          <div className={classes.editorContainer}>
            <Editor mode="text/plain"
              onChange={v => handleChange(0, v)}
              code={this.props.sample[0]} />
          </div>
          <div className={classes.editorContainer}>
            <Editor mode="text/plain"
              onChange={v => handleChange(1, v)}
              code={this.props.sample[1]} />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

class SamplesDisplay extends Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    /* FromStyle */
    classes: PropTypes.object.isRequired
  }
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      dialog: false
    };
  }

  update(newState) {
    this.props.onChange({ target: { value: newState.value, name: this.props.name } });
    this.setState(newState);
  }

  addSample(i = this.state.value.length) {
    this.setState({ value: splice([...this.state.value], i, 0, ["", ""]) });
  }

  render() {
    const { classes } = this.props;
    var onChange = (modifier) =>
      this.update({ value: modifier(this.state.value), dialog: false });
    return (
      <Paper className={classes.paper}>
        <Typography variant="h3" style={{ marginBottom: 10 }}>
        Samples
          <Button onClick={()=>this.addSample()} className={classes.buttons}
            variant="contained" color="primary">
            Add sample
          </Button>
        </Typography>
        <div className={classes.root}>
          {
            this.state.value.map((s, i) =>
              <SampleDisplay key={i}
                {...{ classes, sample: { ...s, no: i }, onChange }} />
            )
          }
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(SamplesDisplay);
