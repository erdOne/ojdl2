// import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Grid,
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  LinearProgress
} from "@material-ui/core";

import { formattedDate } from "common/date.js";

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: "flex"
  },
  avatar: {
    marginLeft: "auto",
    height: 180,
    width: 200,
    flexShrink: 0,
    flexGrow: 0
  },
  motto: {
    fontStyle: "italic",
    // marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
}));

const AccountProfile = (props) => {
  const { className, user, stats, ...rest } = props;

  const classes = useStyles();

  const { acProbs, totalProbs, acSubs, totalSubs } = stats;
  const triedProbs = totalProbs - acProbs;

  const acRatio = ((acSubs / totalSubs) * 100).toFixed(2) + "%";

  return (
    <Box
      {...rest}
      className={clsx(classes.root, className)}
    >
        <div className={classes.details}>
          <div>
            <Typography
              gutterBottom
              variant="h2"
            >
              {user.handle}
            </Typography>
            <Typography
              className={classes.motto}
              color="textSecondary"
              variant="h4"
            >
              {user.motto}
            </Typography>
          </div>
          <Avatar
            variant="rounded"
            className={classes.avatar}
            src={user.avatar && user.avatar !== "" ? `/images/avatars/${user.avatar}` : ""}
          />
        </div>
        <Grid container spacing={2}>
          <Grid item>
            Accepted Problems: <br />
            Unsolved Problems: <br />
            AC submission ratio: <br />
          </Grid>
          <Grid item>
            {acProbs} <br />
            {triedProbs} <br />
            {`${acRatio}(${acSubs}/${totalSubs})`} <br />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item>
            Sign up at: <br />
            Last sign in: <br />
          </Grid>
          <Grid item>
            {formattedDate(user.createdAt)} <br />
            {formattedDate(user.lastSignIn)} <br />
          </Grid>
        </Grid>
    </Box>
  );
};

AccountProfile.propTypes = {
  className: PropTypes.string,
  // user: PropTypes.object
};

export default AccountProfile;
