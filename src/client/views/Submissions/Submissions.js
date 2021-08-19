import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { VirtualTable } from "client/components";
import verdicts from "common/verdicts";
import languages from "common/languages";

const columns = [
  { id: "sid", align: "right", numeric: true,
    disablePadding: true, label: "#", style: { width: 60 },
    display: sub=>sub.sid },
  { id: "pid", align: "left", numeric: false, disablePadding: true, label: "題目",
    style: { width: 150, textOverflow: "ellipsis" },
    display: sub => `#${sub.pid}: ${sub.problem.title}` },
  { id: "handle", align: "left", numeric: false, disablePadding: true,
    label: "上傳者", style: { width: 150 },
    display: sub=>sub.user.handle },
  { id: "time", align: "right", numeric: true, disablePadding: true,
    label: "時間(ms)", style: { width: 100 } },
  { id: "memory", align: "right", numeric: true, disablePadding: true,
    label: "記憶體(KB)", style: { width: 100 } },
  { id: "verdict", align: "right", numeric: false, disablePadding: true,
    label: "結果", style: { width: 75 },
    display: s=>(<span style={{ color: verdicts[s.verdict].color[0] }}>
      {verdicts[s.verdict].abbr}</span>) },
  { id: "score", align: "right", numeric: true, disablePadding: true,
    label: "分數", style: { width: 75 } },
  { id: "language", align: "right", numeric: false, disablePadding: true,
    label: "語言", style: { width: 75 } },
  { id: "timestamp", align: "right", numeric: false, disablePadding: true,
    label: "上傳時間", style: { width: 150 },
    display: sub=>new Date(sub.timestamp).toLocaleString() },
];

function mapStateToProps({ user, contest }) {
  return { user, contest };
}

function Submissions({ user, contest }) {
  const { uid } = user;
  const { cid } = contest;
  return (
    <VirtualTable columns={columns} title="Submissions"
      config={{
        key: "sid",
        link: sub => `./submission/${sub.sid}`,
        typesetMath: true
      }}
      api={{
        loadData: ({ limit, offset, filters }) => {
          return axios.post("/api/get_subs",
            { uid, cid, order: [["sid", "desc"]], limit, offset, filters })
            .then(res => {
              if (res.data.error) throw res.data.msg;
              // console.log(res.data);
              if (cid) {
                const probs = contest.problems;
                for (let sub of res.data.subs)
                  sub.pid = probs.find(prob => prob.ppid === sub.pid).pid;
              }
              return [res.data.subs, res.data.subCount];
            });
        },
        queryWhiteList: {
          "user_name": null,
          "problem_id": null,
          "filter_verdict": Object.keys(verdicts).filter(k => isNaN(parseInt(k))).sort(),
          "filter_language": Object.keys(languages).sort()
        }
      }}
    />
  );
}
Submissions.propTypes = {
  /* FromState */
  user: PropTypes.object,
  contest: PropTypes.object,
  /* FromRouter */
  match: PropTypes.object
};

export default connect(mapStateToProps)(Submissions);
