
const drawerWidth = 240;
/* eslint-disable max-lines-per-function */
const style = theme => ({
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
  codeblock: {	
    color: "saddlebrown",	
    /* text-shadow: "0 1px white", */	
    fontFamily: "'Inconsolata', Monaco, Consolas, 'Andale Mono', monospace",	
    direction: "ltr",	
    textAlign: "left",	
    whiteSpace: "pre",	
    wordSpacing: "normal",	
    wordBreak: "normal",	
    lineHeight: "1.3",	
    tabSize: "4",	
    hyphens: "none",	
    position: "relative",	
    overflow: "hidden",	
    textOverflow: "ellipsis",	
    padding: [25, 12, 7, 12],	
    border: ["solid", 1, "rgba(51, 51, 51, 0.12)"],	
    background: "rgba(246, 246, 246, 0.2)",	
    counterReset: "line",	
    "& code span::before": {	
      counterIncrement: "line",	
      content: "counter(line)",	
      display: "inline-block",	
      borderRight: "1px solid #ddd",	
      textAlign: "right",	
      width: 20,	
      padding: "0 0.3em 0 0",	
      marginRight: ".5em",	
      color: "#888"	
    }	
  },	
  labels: {	
    position: "absolute",	
    background: "#e8e6e3",	
    top: 0,	
    left: 0,	
    fontFamily: ["BlinkMacSystemFont", "Segoe UI", "Roboto",	
      "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", "sans-serif"],	
    color: "#555",	
    fontSize: ".9rem",	
    border: "none",	
    borderBottom: ["solid", 1, "rgba(51, 51, 51, 0.12)"],	
    "& > span": {	
      padding: [1, 5],	
      borderRight: ["solid", 1, "rgba(51, 51, 51, 0.12)"]	
    }	
  },	
  actions: {	
    position: "absolute",	
    top: 0,	
    right: 0,	
    "& button": {	
      width: 90	
    }	
  },	
  fab: {	
    "&$disabled": {	
      position: "fixed",	
      bottom: theme.spacing(2),	
      right: theme.spacing(2),	
      backgroundColor: theme.palette.primary.main,	
      color: theme.palette.common.white,	
      fontSize: "24pt"	
    }	
  },
});

export default style;
