import { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class Title extends Component {

  static propTypes = {
    pageTitle: PropTypes.string,
    siteTitle: PropTypes.string
  };

  static defaultProps = {
    pageTitle: null,
    siteTitle: "Your Site Name Here",
  };
  constructor(props) {
    super(props);
    this.titleEl = document.getElementsByTagName("title")[0];
  }

  render() {
    let fullTitle = this.props.pageTitle;
    if(this.props.pageTitle)
      fullTitle += " - " + this.props.siteTitle;

    return ReactDOM.createPortal(fullTitle || "", this.titleEl);
  }
}

export default Title;
