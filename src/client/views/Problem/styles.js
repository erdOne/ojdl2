export default theme => ({
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
  disabled: {}
});
