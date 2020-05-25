import { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { CircularProgress } from "@material-ui/core";
import { CheckSharp, ChangeHistorySharp } from "@material-ui/icons";

import { VirtualTable } from "components";
import verdicts from "../../common/verdicts";

const columns = [
  { id: "pid", align: "right", numeric: true,
    disablePadding: false, label: "#", style: { width: 60 } },
  { id: "title", align: "left", numeric: false, disablePadding: false, label: "題目", style: { width: 150 },
    display: prob => prob.title },
  { id: "subtitle", align: "left", numeric: false, disablePadding: false, label: "", style: { width: 150 },
    display: prob => (<small style={{ color: "gray" }}> {prob.subtitle} </small>) },
  { id: "status", align: "right", numeric: false, disablePadding: false, label: "狀態", style: { width: 75 },
    display: prob => !prob.status ? null
      : prob.status == "AC" ? (<CheckSharp style={{ height: 15, color: verdicts[verdicts.AC].color[0] }} />)
        : (<ChangeHistorySharp style={{ height: 15, color: verdicts[verdicts.PAC].color[0] }} />) },
  { id: "updatedAt", align: "right", numeric: false, disablePadding: false, label: "上次修改", style: { width: 150 },
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
        extract: ({ probs, probCount, subs }) => {
          let stat = {};
          for(const { pid, verdict } of subs) {
            if (!stat[pid]) stat[pid] = "TRIED";
            if (verdict === verdicts.AC) stat[pid] = "AC";
          }
          return [probs.map(prob => { return { ...prob, status: stat[cid ? prob.ppid : prob.pid] } }), probCount];
        },
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
