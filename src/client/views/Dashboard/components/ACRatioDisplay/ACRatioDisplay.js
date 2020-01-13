import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Card, CardContent, Grid, Typography, Avatar } from "@material-ui/core";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%"
  },
  content: {
    alignItems: "center",
    display: "flex"
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.success.main,
    height: 56,
    width: 56,
    fontFamily: ["Share Tech Mono", "monospace"],
    fontSize: 30,
    fontWeight: 700
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center"
  },
  succes: {
    color: theme.palette.success.dark
  },
  error: {
    color: theme.palette.error.dark
  },
  differenceValue: {
    marginRight: theme.spacing(1)
  }
}));

const ACRatioDisplay = props => {
  const { className, totalACs, totalSubs, pastRatio, ...rest } = props;
  const ACRatio = Math.floor(totalACs / totalSubs * 100);
  const difference = ACRatio - pastRatio;
  const classes = useStyles();


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              AC Ratio
            </Typography>
            <Typography variant="h3">{isNaN(ACRatio) ? "Any" : ACRatio}%</Typography>
            <small style={{ fontSize: "", color: "gray" }}>
              {`${totalACs} out of ${totalSubs}`}
            </small>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <span className={classes.icon}>AC</span>
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          {isNaN(difference) ? "Seems like you are new here! Welcome!" :
            <>
            { difference > 0 ?
              <ArrowUpwardIcon className={clsx(classes.success, classes.differenceIcon)} /> :
              <ArrowDownwardIcon className={clsx(classes.error, classes.differenceIcon)} />
            }
            <Typography
              className={difference > 0 ? classes.success : classes.error}
              variant="body2"
            >{Math.abs(difference)}%&nbsp;
            </Typography>
            <Typography
              className={classes.caption}
              variant="caption"
            >
              Since last week
            </Typography>
            </>
          }
        </div>
      </CardContent>
    </Card>
  );
};

ACRatioDisplay.propTypes = {
  className: PropTypes.string,
  totalACs: PropTypes.number,
  totalSubs: PropTypes.number,
  pastRatio: PropTypes.number
};

export default ACRatioDisplay;
