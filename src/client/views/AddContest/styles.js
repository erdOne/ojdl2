export default theme => ({
  root: {
    position: "relative"
  },
  paper: {
    padding: theme.spacing(1, 1),
    margin: theme.spacing(3, 2),
    background: "none"
  },
  title: {
    margin: theme.spacing(1, 1, -2, 1)
  },
  text: {
    "& > p": {
      marginBottom: 30,
      marginTop: 10
    }
  },
  buttons: {
    margin: theme.spacing(0, 1)
  },
  textField: {
    margin: theme.spacing(1, 1),
    width: "max(200px, 25vw)",
    fallbacks: {
      width: 200
    }
  },
  textFieldHalf: {
    margin: theme.spacing(1, 1),
    width: `calc(50% - 2 * ${theme.spacing(1)}px)`
  },
  textFieldThird: {
    margin: theme.spacing(1, 1),
    width: `calc(33% - 2 * ${theme.spacing(1)}px)`
  },
  listItemText: {
    display: "flex",
    alignItems: "baseline"
  },
  listItem: {
    paddingBottom: 0,
    paddingTop: 0
  }
});
