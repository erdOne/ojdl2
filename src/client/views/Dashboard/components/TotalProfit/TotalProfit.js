import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent, Grid, Typography, Avatar } from "@material-ui/core";
import { Star as StarIcon } from "@material-ui/icons";
import DiamondIcon from "./DiamondIcon";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  },
  content: {
    alignItems: "center",
    display: "flex"
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.white,
    color: theme.palette.primary.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  }
}));

const TotalProfit = props => {
  const { className, totalScore, ...rest } = props;

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
              color="inherit"
              gutterBottom
              variant="body2"
            >
              OVERALL SCORE
            </Typography>
            <Typography
              color="inherit"
              variant="h3"
            >
              {totalScore.toString().replace(/(.)(?=(\d{3})+$)/g, "$1,")}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <StarIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalProfit.propTypes = {
  className: PropTypes.string,
  totalScore: PropTypes.number
};

export default TotalProfit;
