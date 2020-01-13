import { Component } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { connect } from "react-redux";

import { Typography, AppBar, Toolbar, IconButton, Badge } from "@material-ui/core";
import { Menu, Notifications } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { Clock } from "./components";

const drawerWidth = 240;

const styles = theme => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    fontWeight: 500,
    fontFamily: "HanWangYanKai"
  }
});

function mapStateToProps({ contest }) {
  return { contest };
}



class Header extends Component {
  render() {
    const { classes, contest } = this.props;
    return (
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, this.props.isOpen && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={this.props.onSidebarOpen}
            className={clsx(classes.menuButton, this.props.isOpen && classes.menuButtonHidden)}
          >
            <Menu />
          </IconButton>
          <Typography variant="h2" color="inherit" noWrap className={classes.title}>
            {contest.inContest ? contest.title : "OJ的啦"}
          </Typography>
          {contest.inContest ?
            <Clock start={new Date(contest.start)} end={new Date(contest.end)} />
            : null}

          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onSidebarOpen: PropTypes.func.isRequired,
  /* FromState */
  contest: PropTypes.object,
  /* FromStyle */
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(Header));
