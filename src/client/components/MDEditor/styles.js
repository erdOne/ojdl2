const buttonGutter = 4;

export default {

  editor: {
    border: [1, "solid", "#ccc"],
    borderRadius: 4,
    overflow: "hidden",
    position: "relative"
  },

  root: {
    display: "flex"
  },

  editorContainer: {
    width: "40%",
    margin: 20
  },

  editorPreview: {
    width: "40%",
    margin: 20
  },

  toolbar: {
    marginBottom: buttonGutter,
    marginTop: buttonGutter
  },

  toolbarButton: {
    background: "#eee",
    border: [1, "solid", "transparent"],
    borderRadius: 4,
    cursor: "pointer",
    display: "inline-block",
    marginRight: buttonGutter,
    padding: [10, 0],
    textAlign: "center",
    verticalAlign: "middle",
    width: 40,

    // transitions
    transition: "all 180ms",
    "-webkit-transition": "all 180ms",

    "&:hover, &:focus, &--pressed": {
      backgroundColor: "white",
      borderColor: "rgba(0, 0, 0, 0.1)",
      boxShadow: [0, 1, 1, "rgba(0, 0, 0, 0.05)"],
      outline: "none",
      transition: "none",
      "-webkit-transition": "none"
    },

    "&:active, &--pressed": {

      backgroundColor: "rgba(0, 0, 0, 0.15)",
      borderColor: "rgba(0, 0, 0, 0.1)",
      boxShadow: ["inset", 0, 1, 1, "rgba(0, 0, 0, 0.1)"],
      "&:hover": {
        background: "rgba(0, 0, 0, 0.2)"
      }
    }
  },

  toolbarButtonIcon: {
    display: "inline-block",
    height: 16,
    width: 16,

    "& > svg": {
      height: 16,
      width: 16
    }
  },
  // hide the label when there's an icon

  toolbarButtonLabel: {
    display: "none"
  },

  // can't find decent icons for headings so just use text

  toolbarButtonLabelIcon: {
    display: "inline-block",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: .9,
    height: 16,
    textTransform: "uppercase"
  }

};
