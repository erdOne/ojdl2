import { Component } from "react";
import PropTypes from "prop-types";

import { TextField, Button } from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";


class AddPost extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    buttonText: PropTypes.string,
    label: PropTypes.string,
    secondaryAction: PropTypes.object,
    value: PropTypes.string,
    poid: PropTypes.number
  }

  static defaultProps = {
    secondaryButton: null
  }

  constructor(props) {
    super(props);
    this.state = { value: props.value || "" };
    this.handleSubmit = () => this.props.handleSubmit(this.props.poid, this.state.value);
  }

  render() {
    return (<>
      <TextField
        label={this.props.label}
        multiline
        fullWidth
        value={this.state.value}
        onChange={e => this.setState({ value: e.target.value })}
      />
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        {this.props.secondaryAction}
        <Button color="primary"
          margin="normal" onClick={this.handleSubmit} >
          <span style={{ marginRight: "10px" }}><SendIcon /></span>
            send
        </Button>
      </div>
    </>);
  }
}

export default AddPost;
