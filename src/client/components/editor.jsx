import { Component } from "react";
import PropTypes from "prop-types";
import cm from "codemirror";
import "codemirror/mode/clike/clike";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/solarized.css";

export default class Editor extends Component {
  static propTypes = {
    code: PropTypes.string,
    onChange: PropTypes.func,
    mode: PropTypes.string.isRequired,
    className: PropTypes.string,
    readOnly: PropTypes.bool
  }

  static defaultProps = {
    readOnly: false
  }

  constructor(props){
    super(props);
    this.editorRef = React.createRef();
  }
  componentDidMount() {
    if(!this.codeMirror){
      this.codeMirror = cm.fromTextArea(this.editorRef.current, {
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: this.props.mode,
        theme: "solarized light",
        viewportMargin: Infinity,
        readOnly: this.props.readOnly
      });
      this.codeMirror.on("change", x=>{
        this.props.onChange(this.codeMirror.getDoc().getValue());
      });
    }
  }
  componentDidUpdate(prevProps){
    if(this.props.mode !== prevProps.mode)
      this.codeMirror.setOption("mode", this.props.mode);
    if(this.props.readOnly !== prevProps.readOnly)
      this.codeMirror.setOption("readOnly", this.props.readOnly);
    if(this.props.code !== prevProps.code)
      if(this.props.code !== this.codeMirror.getDoc().getValue())
        this.codeMirror.getDoc().setValue(this.props.code);

  }
  render() {
    return (
      <div style={{ fontSize: "120%" }} className = {this.props.className}>
        <textarea ref={this.editorRef} autoComplete='off'
          defaultValue={this.props.code} readOnly/>
      </div>
    );
  }
}
