import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import clsx from "clsx";
import { withSnackbar } from "notistack";

import { Drawer, List, Divider, IconButton } from "@material-ui/core";
import {
  ChevronLeft,
  Dashboard,
  Assignment,
  Publish,
  Storage,
  GolfCourse,
  BarChart,
  ArrowBack,
  Person,
  ExitToApp,
  FiberNew,
  Cancel,
  Edit,
  Add,
  Chat,
  Home } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import { signOut } from "actions";

import { SidebarItem } from "./components";

const drawerWidth = 240;

const styles = theme => ({
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  }
});

function mapStateToProps({ user, contest }) {
  return { user, contest };
}

function mapDispatchToProps(dispatch) {
  return { handleSignOut: ()=>dispatch(signOut()) };
}


class Sidebar extends React.Component {

  constructor(props) {
    super(props);
    this.Item = this.Item.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
  }

  Item({ display = true, exact = false, clean = false, ...other }) {
    console.log("oops rendered");
    if (!display) return null;
    const { contest } = this.props,
      pathPrefix = contest.inContest&&!clean ? `/contest/${contest.cid}` : "";
    if (!exact && other.href !== undefined)other.href = pathPrefix + other.href;
    return <SidebarItem {...other} />;
  }

  handleLeave() {
    window.sessionStorage.removeItem("uid");
    this.props.enqueueSnackbar("成功登出，歡迎下次再來");
    this.props.handleSignOut();
  }

  render() {
    const {
        classes,
        isOpen,
        onSidebarClose,
        contest,
        user
      } = this.props,
      Item = this.Item,
      { inContest } = contest,
      { isAdmin, active: isActive } = user;
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !isOpen && classes.drawerPaperClose),
        }}
        open={isOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={onSidebarClose}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <List>
          <Item href="/home" icon={<Home />} title="Home" display={inContest} />
          <Item href="/dashboard" icon={<Dashboard />} title="Dashboard" display={!inContest} />
          <Item href="/bulletin" icon={<Chat />} title="Bulletin" display={inContest} />
          <Item href="/problems" icon={<Assignment />} title="Problems" />
          <Item href="/submissions" icon={<Storage />} title="Submissions" />
          <Item href="/submit" icon={<Publish />} title="Submit" />
          <Item href="/standings" icon={<BarChart />} title="Standings" display={inContest} />
          <Item exact href="/" icon={<ArrowBack />} title="Leave Contest" display={inContest} />
          <Item href="/contests" icon={<GolfCourse />} title="Contests" display={!inContest} />
          { isAdmin ? <Divider /> : null }
          <Item exact href="/add/problem" icon={<Edit />} title="Add problem" display={Boolean(isAdmin)} />
          <Item exact href="/add/contest" icon={<Add />} title="Add contest" display={Boolean(isAdmin)} />
          <Divider />
          <Item exact href="/account" icon={<Person />} title="Profile" display={isActive} clean />
          <Item onClick={this.handleLeave} icon={<Cancel />} title="Sign out" display={isActive} />
          <Item href="/sign-in" icon={<ExitToApp />} title="Sign in" display={!isActive} clean />
          <Item href="/sign-up" icon={<FiberNew />} title="Sign up" display={!isActive} clean />
        </List>
      </Drawer>
    );
  }
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSidebarClose: PropTypes.func.isRequired,
  /* FromStyle */
  classes: PropTypes.object.isRequired,
  /* FromSnackbar */
  enqueueSnackbar: PropTypes.func.isRequired,
  /* FromState */
  user: PropTypes.object.isRequired,
  contest: PropTypes.object,
  /* FromDispatch */
  handleSignOut: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(withSnackbar(Sidebar))
);
