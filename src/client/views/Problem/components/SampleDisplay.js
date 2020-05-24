import { Component } from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";

import { withStyles } from "@material-ui/core/styles";
import { SampleDisplayStyles as styles } from "./styles";

class SampleDisplay extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    sample: PropTypes.arrayOf(PropTypes.string).isRequired,
    /* FromStyle */
    classes: PropTypes.object,
    /* FromSnackbar */
    enqueueSnackbar: PropTypes.func
  }

  copy(text) {
    if (navigator.clipboard)
      navigator.clipboard.writeText(text)
        .then(()=>this.props.enqueueSnackbar("已成功複製"));
  }

  render() {
    const { classes, sample, id } = this.props;
    return (
      <div style={{ marginBottom: 10 }} key={id}>
        <pre className={classes.codeblock} style={{ marginBottom: 0 }}>
          <span className={classes.labels}>
            <span>Input</span>
            <span onClick={()=>this.copy(sample[0])}>Copy</span>
          </span>
          <code>
            {
              sample[0].split("\n").map((x, i) => (
                [<span key={`Sample${id}-Input${i}`}>{x}</span>, <br key={i} />]
              ))
            }
          </code>
        </pre>
        <pre className={classes.codeblock} style={{ borderTop: 0, marginTop: 0 }}>
          <span className={classes.labels}>
            <span>Output</span>
            <span onClick={()=>this.copy(sample[1])}>Copy</span>
          </span>
          <code>
            {
              sample[1].split("\n").map((x, i) => (
                [<span key={`Sample${id}-Output${i}`}>{x}</span>, <br key={i} />]
              ))
            }
          </code>
        </pre>
      </div>
    );
  }
}

export default withSnackbar(withStyles(styles)(SampleDisplay));
