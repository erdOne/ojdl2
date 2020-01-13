import { Component } from "react";
import PropTypes from "prop-types";

import { FormControlLabel, Switch } from "@material-ui/core";


class VisibilitySwitch extends Component {
  static propTypes = {
    handleToggle: PropTypes.func,
    checked: PropTypes.bool,
    poid: PropTypes.number
  }

  static defaultProps = {
    secondaryButton: null
  }

  constructor(props) {
    super(props);
    this.state = { checked: props.checked };
    this.toggleChecked = this.toggleChecked.bind(this);
  }

  toggleChecked() {
    var checked = !this.state.checked;
    this.props.handleToggle(this.props.poid, checked);
    this.setState({ checked });
  }

  render() {
    return (
      <FormControlLabel
        control={<Switch checked={this.state.checked} onChange={this.toggleChecked} />}
        label="Visible"
      />
    );
  }
}

export default VisibilitySwitch;
