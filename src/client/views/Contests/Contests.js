import { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { CircularProgress } from "@material-ui/core";

import DataTable from "components/DataTable";

const columns = [
  { id: "cid", align: "right", numeric: true,
    disablePadding: false, label: "#", style: { width: 75 } },
  { id: "title", align: "left", numeric: false, disablePadding: false, label: "競賽名稱" },
  { id: "start", align: "left", numeric: false, disablePadding: true, label: "開始時間",
    display: cont=>new Date(cont.start).toLocaleString() },
  { id: "end", align: "left", numeric: false, disablePadding: true, label: "結束時間",
    display: cont=>new Date(cont.end).toLocaleString() },
];

function mapStateToProps({ user }) {
  return { user };
}

class Contests extends Component {
  static propTypes = {
    /* FromState */
    user: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = { dataLoaded: false };
    axios.post("/api/get_conts", { uid: this.props.user.uid })
      .then(res=>{
        console.log(res.data);
        this.setState({ rows: res.data.conts, dataLoaded: true });
      });
  }
  render() {
    if (this.state.dataLoaded)
      return (
        <DataTable columns={columns} rows={this.state.rows} title="Contests"
          config={{ key: "cid", link: cont=>`/contest/${cont.cid}/home` }} />
      );
    else
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);

  }
}

export default connect(mapStateToProps)(Contests);
