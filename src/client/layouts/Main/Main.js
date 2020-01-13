import React from "react";
import PropTypes from "prop-types";
import { Container, CssBaseline } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";


import { Sidebar, Topbar, Footer } from "./components";

//import './index.css';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex",
  },
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
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
});

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: false
    };
  }
  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Topbar title="OJ的啦" isOpen={this.state.isOpen} onSidebarOpen={()=>this.setState({ isOpen: true })} />
        <Sidebar isOpen={this.state.isOpen} onSidebarClose={()=>this.setState({ isOpen: false })}/>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            {this.props.children}
          </Container>
          <Footer />
        </main>
      </div>
    );
  }
}

Main.propTypes = {
  children: PropTypes.node,
  /* FromStyle */
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Main);
