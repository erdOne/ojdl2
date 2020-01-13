import { Component } from "react";
import PropTypes from "prop-types";

function difference(t1, t2) {
  var ms = t2 - t1;
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  if (t1.getDate() !== t2.getDate())
    return `${Math.floor(t2 / MS_PER_DAY) - Math.floor(t1 / MS_PER_DAY)}天`;
  var s = Math.floor(ms / 1000);
  var h = Math.floor(s / 60 / 60);
  s -= h * 60 * 60;
  var m = Math.floor(s / 60);
  s -= m * 60;
  return `${h}:${(m < 10 ? "0" : "") + m}:${(s < 10 ? "0" : "") + s}`;
}

class Clock extends Component {

  static propTypes = {
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date)
  }

  constructor(props) {
    super(props);
    this.state = { now: new Date() };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ now: new Date() }));
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { now } = this.state,
      { start, end } = this.props;
    var displayText = "";

    if (now < start)
      displayText = `${difference(now, start)}後開始`;
    else if (now < end)
      displayText = `${difference(now, end)}後結束`;

    return <span style={{ fontFamily: "monospace", fontSize: "130%" }}>{displayText}</span>;
  }
}

export default Clock;
