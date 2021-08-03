import { Component } from "react";
import PropTypes from "prop-types";

import {
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
import { Editor } from "client/components";
import { SampleDisplayStyles as styles } from "./styles";

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

export default withStyles(styles)(SampleDisplay);
