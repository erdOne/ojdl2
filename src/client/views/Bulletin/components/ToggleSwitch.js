import { Component } from "react";
import PropTypes from "prop-types";

import { FormControlLabel, Switch } from "@material-ui/core";


class ToggleSwitch extends Component {
  static propTypes = {
    handleToggle: PropTypes.func,
    checked: PropTypes.bool,
    poid: PropTypes.number,
    label: PropTypes.string
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
        label={this.props.label}
      />
    );
  }
}

export default ToggleSwitch;
