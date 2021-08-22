import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { formattedDate } from "common/date.js";

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

const useStyles = makeStyles(theme => ({
  root: {},
  details: {
    display: "flex"
  },
  avatar: {
    marginLeft: "auto",
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  motto: {
    fontStyle: "italic",
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
}));

const AccountProfile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const user = {
    handle: "Benq",
    motto: "Lorem ipsum.",
    email: "test@ojdl.ck",
    lastSignIn: new Date(),
    createdAt: new Date(0),
    acProbs: 1,
    triedProbs: 2,
    acSubs: 1,
    totalSubs: 10,
    avatar: "/images/avatars/avatar_11.png"
  };

  user.acRatio = ((user.acSubs / user.totalSubs) * 100).toFixed(2) + "%";

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
            className={classes.avatar}
            src={user.avatar}
          />
        </div>
        <Grid container spacing={2}>
          <Grid item>
            Accepted Problems: <br />
            Unsolved Problems: <br />
            AC submission ratio: <br />
          </Grid>
          <Grid item>
            {user.acProbs} <br />
            {user.triedProbs} <br />
            {`${user.acRatio}(${user.acSubs}/${user.totalSubs})`} <br />
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
  className: PropTypes.string
};

export default AccountProfile;
