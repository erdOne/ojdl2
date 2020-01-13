import { Component } from "react";
import PropTypes from "prop-types";

import { TableRow, TableCell } from "@material-ui/core";
import Verdict from "./Verdict.js";

class SubtaskResultDisplay extends Component {
  static propTypes = {
    subRes: PropTypes.object,
    openDialog: PropTypes.func,
    /* FromStyle */
    classes: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  render() {
    const { classes, subRes, openDialog } = this.props;
    const { expanded } = this.state;
    return (
      <>
        <TableRow onClick={()=>this.setState({ expanded: !expanded })}>
          <TableCell className={classes.bold}>Subtask #{subRes.no}</TableCell>
          <TableCell>{subRes.time}</TableCell>
          <TableCell>{subRes.memory}</TableCell>
          <TableCell>{subRes.score}</TableCell>
          <TableCell>
            <Verdict verdict={subRes.verdict} msg={subRes.msg} openDialog={openDialog} />
          </TableCell>
        </TableRow>
        { this.state.expanded &&
          subRes.testResult.map(res =>
            <TableRow key={res.tid}>
              <TableCell>Testcase #{res.tid}</TableCell>
              <TableCell>{res.time}</TableCell>
              <TableCell>{res.memory}</TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Verdict verdict={res.verdict} msg={res.msg} openDialog={openDialog} />
              </TableCell>
            </TableRow>
          )
        }
      </>
    );
  }
}

export default SubtaskResultDisplay;
