import React, { Component } from "react";
import { PropTypes } from "prop-types";
import marked from "marked";

marked.setOptions({
  gfm: true,
  breaks: true
});

function getMarkdownText(text) {
  var rawMarkup = marked(text || "");
  return { __html: rawMarkup };
}

export default class MDRenderer extends Component {
  static propTypes = {
    source: PropTypes.string,
    className: PropTypes.string
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
      <div className={this.props.className}
        dangerouslySetInnerHTML={getMarkdownText(this.props.source)}
      >
      </div>);
  }
}
