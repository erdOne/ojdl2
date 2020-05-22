import { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link, CircularProgress } from "@material-ui/core";

import { VirtualTable } from "components";
import verdicts from "common/verdicts";
import languages from "common/languages";

const columns = [
  { id: "sid", align: "right", numeric: true,
    disablePadding: true, label: "#", style: { width: 75 },
    display: sub=>sub.sid },
  { id: "pid", align: "left", numeric: false, disablePadding: true, label: "題目",
    display: sub=>`#${sub.pid}: ${sub.problem.title}`},
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

function Submissions(props) { 
  const uid = props.user.uid;
  const cid = props.match.params.cid;
  return (
    <VirtualTable columns={columns} title="Submissions"
      config={{
        key: "sid",
        order: [["sid", "desc"]],
        link: sub => `./submission/${sub.sid}`,
        typesetMath: true
      }}
      api={{
        url: "/api/get_subs",
        extract: data => [data.subs, data.subCount],
        queryWhiteList: {
          "user_name": null,
          "problem_id": null,
          "filter_verdict": Object.keys(verdicts).filter(k => isNaN(parseInt(k))),
          "filter_language": Object.keys(languages)
        },
        args: { uid, cid }
      }}
    />
  );
}
Submissions.propTypes = {
    /* FromState */
  user: PropTypes.object,
    /* FromRouter */
  match: PropTypes.object
}

export default connect(mapStateToProps)(Submissions);
