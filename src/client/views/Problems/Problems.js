import { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { CircularProgress } from "@material-ui/core";

import { VirtualTable } from "components";

const columns = [
  { id: "pid", align: "right", numeric: true,
    disablePadding: false, label: "#", style: { width: 60 } },
  { id: "title", align: "left", numeric: false, disablePadding: false, label: "題目", style: { width: 150 },
    display: prob => prob.title },
  { id: "subtitle", align: "left", numeric: false, disablePadding: false, label: "", style: { width: 150 },
    display: prob => (<small style={{ color: "gray" }}> {prob.subtitle} </small>) },
  { id: "updatedAt", align: "left", numeric: false, disablePadding: false, label: "上次修改", style: { width: 150 },
    display: prob => new Date(prob.updatedAt).toLocaleString() }
];

function mapStateToProps({ user }) {
  return { user };
}

function Problems(props) {
  const uid = props.user.uid;
  const cid = props.match.params.cid;
  return (
    <VirtualTable columns={columns} title="Problems"
      config={{
        key: "pid",
        order: [["pid", "asc"]],
        link: prob => `./problem/${prob.pid}`,
        typesetMath: true
      }}
      api={{
        url: "/api/get_probs",
        extract: data => [data.probs, data.probCount],
        queryWhiteList: {
          "problem_name": null,
          "problem_id": null,
        },
        args: { uid, cid }
      }}
    />
  );
}
Problems.propTypes = {
  /* FromState */
  user: PropTypes.object,
  /* FromRouter */
  match: PropTypes.object
}


export default connect(mapStateToProps)(Problems);
