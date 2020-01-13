import { Component } from "react";
import PropTypes from "prop-types";

import {
  List,
  Divider,
  ListItem,
  Typography,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from "@material-ui/core";
import {
  ExpandMore as ExpandMoreIcon
} from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    backgroundColor: "rgba(246, 246, 246, 0.2)"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "15%",
    flexShrink: 0,
    marginTop: "auto",
    marginBottom: "auto"
  },
  summaryContent: {
    width: "100%",
    justifyContent: "space-between"
  },
  expandDetails: {
    padding: theme.spacing(0, 3)
  },
  testcaseItem: {
    "@media (max-width: 500px)": {
      flexDirection: "column"
    }
  },
  limits: {
    flexBasis: "25%",
    textAlign: "right"
  }
});

class SubtaskDisplay extends Component{
  static propTypes = {
    subtask: PropTypes.object,
    /* FromStyle */
    classes: PropTypes.object
  }

  constructor(props){
    super(props);
    this.state = { expanded: false };
  }

  render(){
    const { classes, subtask } = this.props;
    const { expanded } = this.state;
    return (
      <ExpansionPanel expanded={expanded && !!subtask.testcases.length}
        onChange={()=>this.setState({ expanded: !expanded })} classes={{ root: classes.root }}>
        <ExpansionPanelSummary classes={{ content: classes.summaryContent }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.heading} variant="h4">
          Subtask #{subtask.no + 1}
          </Typography>
          <Typography style={{ flexBasis: "70%" }}>{subtask.description}</Typography>
          <Typography style={{ flexBasis: "15%" }}>Score:{subtask.score}</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails className={classes.expandDetails}>
          <List style={{ width: "100%" }}>
            { this.props.subtask.testcases.map((testcase, i) =>
              [i ? <Divider key={i + "div"}/> : null,
                <ListItem className={classes.testcaseItem} key={i}>
                  <Typography style={{ flexBasis: "50%" }}>Testcase #{testcase.tid}</Typography>
                  <Typography className={classes.limits}>{testcase.timeLimit} ms</Typography>
                  <Typography className={classes.limits}>{testcase.memLimit} KB</Typography>
                </ListItem>])
            }
          </List>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(SubtaskDisplay);
