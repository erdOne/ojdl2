import React from "react";
import { Link as RouterLink } from "react-router-dom";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: "none"
  },
  title: {
    flexGrow: 1,
    fontWeight: 500,
    fontFamily: "HanWangYanKai"
  }
}));

const Topbar = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
      color="primary"
      position="fixed"
    >
      <Toolbar>
        <Typography variant="h2" color="inherit" noWrap className={classes.title}>
          <RouterLink style={{ color: "white", textDecoration: "none" }} to="/">
            OJ的啦
          </RouterLink>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
