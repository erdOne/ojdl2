export const SampleDisplayStyles = theme => ({
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
      width: 20,
      padding: "0 .5em",
      marginRight: ".5em",
      color: "#888",
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
  }
});
