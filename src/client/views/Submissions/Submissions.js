import { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link, CircularProgress } from "@material-ui/core";

import DataTable from "components/DataTable";
import verdicts from "common/verdicts";

const columns = [
  { id: "sid", align: "right", numeric: true,
    disablePadding: true, label: "#", style: { width: 75 },
    display: sub=>(<Link href={`./submission/${sub.sid}`} color="textPrimary"> {sub.sid} </Link>) },
  { id: "pid", align: "left", numeric: false, disablePadding: true, label: "題目",
    display: sub=>(<Link href={`./problem/${sub.pid}`} color="textPrimary"> {`${sub.pid} - ${sub.problem.title}`} </Link>)},
  { id: "handle", align: "left", numeric: false, disablePadding: true, label: "上傳者",
    display: sub=>sub.user.handle },
  { id: "time", align: "right", numeric: true, disablePadding: true, label: "時間(ms)" },
  { id: "memory", align: "right", numeric: true, disablePadding: true, label: "記憶體(KB)" },
  { id: "verdict", align: "left", numeric: false, disablePadding: true, label: "結果",
    display: s=>(<span style={{ color: verdicts[s.verdict].color[0] }}>
      {verdicts[s.verdict].abbr}</span>) },
  { id: "score", align: "right", numeric: true, disablePadding: true, label: "分數" },
  { id: "language", align: "left", numeric: false, disablePadding: true, label: "語言" },
  { id: "timestamp", align: "left", numeric: false, disablePadding: true, label: "上傳時間",
    display: sub=>new Date(sub.timestamp).toLocaleString() },
];

function mapStateToProps({ user }) {
  return { user };
}

class Submissions extends Component {
  static propTypes = {
    /* FromState */
    user: PropTypes.object,
    /* FromRouter */
    match: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = { dataLoaded: false };
    axios.post("/api/get_subs", { uid: this.props.user.uid, cid: this.props.match.params.cid })
      .then(res=>{
        console.log(res.data);
        this.setState({ rows: res.data.subs, dataLoaded: true });
      });
  }

  render() {
    if (this.state.dataLoaded)
      return (
        <DataTable columns={columns} rows={this.state.rows} title="Submissions"
          config={{ key: "sid" }} />
      );
    else
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);

  }
}

export default connect(mapStateToProps)(Submissions);
