import { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link, CircularProgress } from "@material-ui/core";

import DataTable from "components/DataTable";

const columns = [
  { id: "pid", align: "right", numeric: true,
    disablePadding: false, label: "#", style: { width: 75 } },
  { id: "title", align: "left", numeric: false, disablePadding: false, label: "題目",
    display: prob => (<Link href={`./problem/${prob.pid}`} color="textPrimary"> {prob.title}  </Link>) },
  { id: "subtitle", align: "left", numeric: false, disablePadding: false, label: "",
    display: prob => (<small style={{ color: "gray" }}> {prob.subtitle} </small>) },
  { id: "updatedAt", align: "left", numeric: false, disablePadding: false, label: "上次修改",
    display: prob => new Date(prob.updatedAt).toLocaleString() }
];

function mapStateToProps({ user }) {
  return { user };
}

class Problems extends Component {
  static propTypes = {
    /* FromState */
    user: PropTypes.object,
    /* FromRouter */
    match: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = { dataLoaded: false };
    axios.post("/api/get_probs", { uid: this.props.user.uid, cid: this.props.match.params.cid })
      .then(res=>{
        console.log(res.data);
        this.setState({ rows: res.data.probs, dataLoaded: true });
      });
  }
  render() {
    if (this.state.dataLoaded)
      return (
        <DataTable columns={columns} rows={this.state.rows} title="Problems"
          config={{ key: "pid" }} />
      );
    else
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);

  }
}

export default connect(mapStateToProps)(Problems);
