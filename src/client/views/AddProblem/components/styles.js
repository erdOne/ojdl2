export let SampleDisplayStyles = theme => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "15%",
    flexShrink: 0,
    marginTop: "auto",
    marginBottom: "auto"
  },
  summaryContent: {
    width: "100%",
    justifyContent: "space-between"
  },
  expandActions: {
    display: "flex",
    flexDirection: "row",
    "& > *": {
      flexBasis: "33%"
    }
  },
  expandDetails: {
    padding: theme.spacing(0),
    display: "flex",
  },
  editorContainer: {
    flexBasis: "50%",
    "& .CodeMirror": {
      height: 200
    }
  }
});
