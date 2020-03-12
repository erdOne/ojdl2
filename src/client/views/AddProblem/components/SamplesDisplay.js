import { Component } from "react";
import PropTypes from "prop-types";

import {
  Paper,
  Button,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SampleDisplay from "./SampleDisplay";

const styles = theme => ({
  root: {
    width: "100%",
  },
  paper: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(3, 2),
    background: "none"
  },
  buttons: {
    margin: theme.spacing(0, 1)
  },
});

function splice(arr, ...args) { arr.splice(...args); return arr; }



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
                {...{ sample: { ...s, no: i }, onChange }} />
            )
          }
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(SamplesDisplay);
