import { Component } from "react";
import { PropTypes } from "prop-types";
import marked from "marked";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";

marked.setOptions({
  gfm: true,
  breaks: true
});

function getMarkdownText(text) {
  var rawMarkup = marked(text || "");
  return { __html: rawMarkup };
}

const styles = {
  root: {
    "& :not(pre) > code": {
      color: "saddlebrown",
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
      padding: [".1em", ".2em"],
      border: ["solid", 1, "rgba(51, 51, 51, 0.12)"],
      borderRadius: 3,
      background: "rgba(246, 246, 246, 1)"
    }
  }
};

class MDRenderer extends Component {
  static propTypes = {
    source: PropTypes.string,
    className: PropTypes.string,
    /* FromStyle */
    classes: PropTypes.object
  }

  componentDidUpdate(prevProps) {
    if (prevProps.source !== this.props.source)
      window.MathJax.startup.promise = window.MathJax.startup.promise.then(
        ()=>window.MathJax.typesetPromise()
      );
  }

  componentDidMount() {
    window.MathJax.startup.promise = window.MathJax.startup.promise.then(
      ()=>window.MathJax.typesetPromise()
    );
  }

  render() {
    return (
      <div className={clsx(this.props.className, this.props.classes.root)}
        dangerouslySetInnerHTML={getMarkdownText(this.props.source)}
      />
    );
  }
}
export default withStyles(styles)(MDRenderer);
