
import React, { Component } from "react";
import PropTypes from "prop-types";
import highlight from "highlight.js";

export default class Highlight extends Component {

  constructor(props){
    super(props);
    this.codeRef = React.createRef();
  }

  componentDidMount() {
    highlight.highlightBlock(this.codeRef.current);
  }

  componentDidUpdate() {
    highlight.initHighlighting.called = false;
    highlight.highlightBlock(this.codeRef.current);
  }

  render() {
    const { children, className, language, style, dataLabel } = this.props;

    return (
      <pre className={className} style={style} data-label={dataLabel}>
        <code className={language} ref={this.codeRef}>
          {children}
        </code>
      </pre>
    );
  }
}

Highlight.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  language: PropTypes.string,
  style: PropTypes.object,
  dataLabel: PropTypes.string
};
