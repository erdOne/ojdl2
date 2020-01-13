import classNames from "classnames";
import CM from "codemirror";
import React, { Component } from "react";
import { PropTypes } from "prop-types";
import * as Icons from "./icons";
import marked from "marked";
import { withStyles } from "@material-ui/core/styles";

require("codemirror/mode/xml/xml");
require("codemirror/mode/markdown/markdown");
require("codemirror/addon/edit/continuelist");

import { getCursorState, applyFormat } from "./format";
import styles from "./styles";


function getMarkdownText(text) {
  var rawMarkup = marked(text || "");
  return { __html: rawMarkup };
}

function getOptions(options){
  return {
    mode: "markdown",
    lineNumbers: false,
    indentWithTabs: true,
    tabSize: "2",
    ...options
  };
}

class MDViewer extends Component {
  static propTypes = {
    html: PropTypes.string,
    className: PropTypes.string
  }
  constructor(props){
    super(props);
    var pendingRender = 1;
    this.componentDidUpdate = prevProps => {
      if(prevProps.html !== this.props.html)
        pendingRender++;
    };
    this.componentWillUnmount = () => {
      clearInterval(this.renderID);
    };
    this.renderID = setInterval(()=>{
      if(!pendingRender)return;
      pendingRender = 0;
      window.MathJax.startup.promise = window.MathJax.startup.promise.then(
        ()=>window.MathJax.typesetPromise()
      );
    }, 200);
  }

  render(){
    return (
      <div className={this.props.className}
        dangerouslySetInnerHTML={getMarkdownText(this.props.html)}
      >
      </div>);
  }
}

class MDEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.object,
    path: PropTypes.string,
    value: PropTypes.string,
    /* FromStyle */
    classes: PropTypes.object
  }

  constructor(props){
    super(props);
    this.pendingRender = 1;
    this.state = { value: this.props.value || "", isFocused: false, cs: {} };
    this.CMref = React.createRef();
    this.currentCodemirrorValue = this.props.value;
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  componentDidMount() {
    this.codeMirror = CM.fromTextArea(this.CMref.current, getOptions(this.props.options));
    this.codeMirror.on("change", this.codemirrorValueChanged.bind(this));
    this.codeMirror.on("focus", this.focusChanged.bind(this, true));
    this.codeMirror.on("blur", this.focusChanged.bind(this, false));
    this.codeMirror.on("cursorActivity", this.updateCursorState.bind(this));
  }

  componentWillUnmount() {
    if (this.codeMirror)
      this.codeMirror.toTextArea();
  }

  focusChanged(focused) {
    this.setState({ isFocused: focused });
  }

  updateCursorState() {
    this.setState({ cs: getCursorState(this.codeMirror) });
  }

  codemirrorValueChanged(doc, change) {
    var newValue = doc.getValue();
    this.currentCodemirrorValue = newValue;
    if(this.props.onChange) this.props.onChange(newValue);
  }

  toggleFormat(formatKey, e) {
    e.preventDefault();
    applyFormat(this.codeMirror, formatKey);
  }

  renderIcon(icon) {
    return <span
      dangerouslySetInnerHTML={{ __html: icon }}
      className={this.props.classes.toolbarButtonIcon}
    />;
  }


  renderToolbar() {
    return (
      <div className={this.props.classes.toolbar}>
        {this.renderButton("h1", "h1")}
        {this.renderButton("h2", "h2")}
        {this.renderButton("h3", "h3")}
        {this.renderButton("bold", "b")}
        {this.renderButton("italic", "i")}
        {this.renderButton("oList", "ol")}
        {this.renderButton("uList", "ul")}
        {this.renderButton("quote", "q")}
        {/*renderButton('link', 'a')*/}
      </div>
    );
  }


  renderButton(formatKey, label, action) {
    var { classes } = this.props;
    if (!action) action = this.toggleFormat.bind(this, formatKey);

    var isTextIcon = (formatKey === "h1" || formatKey === "h2" || formatKey === "h3");
    var className = classNames(classes.toolbarButton, {
      [classes.toolbarButton + "--pressed"]: this.state.cs[formatKey]
    }, `${classes.toolbarButton}--${formatKey}`);

    var labelClass = isTextIcon ?
      classes.toolbarButtonLabelIcon
      : classes.toolbarButtonLabel;

    return (
      <button className={className} onClick={action} title={formatKey}>
        {isTextIcon ? null : this.renderIcon(Icons[formatKey])}
        <span className={labelClass}>{label}</span>
      </button>
    );
  }


  render() {
    var editorClassName =
      classNames(this.props.classes.editor,
        { [this.props.classes.editor + "--focused"]: this.state.isFocused }
      );
    return (
      <div className={this.props.classes.root}>
        <div className={this.props.classes.editorContainer}>
          {this.renderToolbar()}
          <div className={editorClassName}>
            <textarea
              ref={this.CMref} name={this.props.path}
              defaultValue={this.props.value} autoComplete="off"
            />
          </div>
        </div>
        <MDViewer html={this.currentCodemirrorValue} className={this.props.classes.editorPreview} />
      </div>
    );
  }
}


export default withStyles(styles)(MDEditor);
