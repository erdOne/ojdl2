import { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { withSnackbar } from "notistack";

import { Typography, CircularProgress, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { MDRenderer } from "components";

const styles = theme => ({
  actions: {
    position: "absolute",
    top: 0,
    right: 0,
    "& button": {
      width: 90
    },
    [theme.breakpoints.down("sm")]: {
      position: "relative"
    }
  },
  root: {
    position: "relative"
  },
  disabled: {}
});

function mapStateToProps({ user, contest }) {
  return { user, contest };
}

function Contest({ classes, user, contest }) {
  useEffect(() => {
    try {
      window.MathJax.startup.promise = window.MathJax.startup.promise.then(
        ()=>window.MathJax.typesetPromise()
      );
    } catch (e) {
      console.log("cannot typeset");
    }
  });

  if (!contest.inContest)
    return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);
  const { cid, content = "" } = contest;
  return (
    <div className={classes.root}>
      <Typography variant="body1" component="div" className={classes.text}>
        <MDRenderer source={content} />
      </Typography>
      <div className={classes.actions}>
        {user.isAdmin &&
            <Link to={`/edit/contest/${cid}`}
              style={{ textDecoration: "none", margin: 10 }}
            >
              <Button variant="contained" color="primary">Edit</Button>
            </Link>
        }
      </div>
    </div>
  );
}

Contest.propTypes = {
  /* FromStyle */
  classes: PropTypes.object.isRequired,
  /* FromState */
  user: PropTypes.object,
  contest: PropTypes.object,
  /* FromRouter */
  match: PropTypes.object,
  /* FromSnackbar */
  enqueueSnackbar: PropTypes.func
};
export default connect(mapStateToProps)(withSnackbar(withStyles(styles)(Contest)));
