import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import verdicts from "common/verdicts";
import { toChars } from "common/char";
import { DataTable } from "components";
import { Line as LineChart } from "react-chartjs-2";

import { CircularProgress } from "@material-ui/core";

import "./chartjsTimeAdaptor";
import "chartjs-plugin-colorschemes";

function mapStateToProps({ user, contest }) {
  return { user, contest };
}

function datasetFromData(start, end, subs) {
  var users = {}, ACprobs = new Set();
  subs.forEach(s => { s.timestamp = new Date(s.timestamp); });
  for (let i of subs.sort((a, b) => a.timestamp - b.timestamp).filter(s => s.timestamp <= end)) {
    var user = users[i.uid] ||= {
        user: i.user.handle,
        scoresT: [{ t: 0, y: 0 }],
        scoresP: {},
        totalScore: 0
      },
      scoreP = user.scoresP[i.pid] ||= {
        score: 0,
        first: false,
        AC: false
      };
    if (scoreP.score >= i.score) continue;
    users[i.uid].scoresT.push(
      { t: new Date(i.timestamp) - start, y: user.totalScore },
      { t: new Date(i.timestamp) - start, y: user.totalScore += i.score - scoreP.score }
    );
    scoreP.score = i.score;
    if (i.verdict === verdicts.AC) {
      scoreP.AC = true;
      if (!ACprobs.has(i.pid)) {
        ACprobs.add(i.pid);
        scoreP.first = true;
      }
    }
  }
  var now = new Date() - start;
  if (now > end - start) now = end - start;
  for (var uid in users)
    users[uid].scoresT.push({ t: now, y: users[uid].totalScore });

  return Object.values(users).sort((a, b) => b.totalScore - a.totalScore);
}

const chartOptions = {
  responsive: true,
  animation: {
    easing: "easeInOutSine"
  },
  scales: {
    xAxes: [{
      type: "time",
      ticks: {
        beginAtZero: true,
        maxTicksLimit: 11,
        maxRotation: 30
      }
    }],
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: "score"
      },
      ticks: {
        beginAtZero: true,
        suggestedMax: 100
      }
    }]
  },
  datasets: {
    line: { lineTension: 0 },
  },
  plugins: {
    colorschemes: {
      scheme: "tableau.Classic20"
    }
  }
};

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Standings({ user, contest = {} }) {
  const [data, setData] = useState(null);
  const [columns, setColumns] = useState(null);

  useEffect(() => {
    if (!contest || !contest.inContest) return;
    setColumns([{ id: "user", align: "left", numeric: false, disablePadding: false, label: "" }]
      .concat(contest.problems.map((prob, i) => ({
        label: `p${toChars(i)}`, align: "right", numeric: true, disablePadding: false, id: `${i}`,
        display: user => {
          const scoreP = user.scoresP[prob.ppid];
          if (!scoreP) return 0;
          const { score, AC }  = scoreP;
          return (
            <span style={{ color: verdicts[verdicts[AC ? "AC" : "PAC"]].color[0] }}>
              {score}
            </span>
          );
        }
      })))
      .concat([{ id: "totalScore", label: "總分", align: "right", numeric: true, disablePadding: false }]));
  }, [contest]);

  // auto refresh
  useInterval(() => {
    if (!contest || !contest.inContest) return;
    axios.post("/api/get_subs", { uid: user.uid, cid: contest.cid })
      .then(res=>{
        if (res.data.error)
          setData({ error: true, errMsg: res.msg });
        else
          setData(datasetFromData(new Date(contest.start), new Date(contest.end), res.data.subs));
      });
  }, (!data || new Date() < new Date(contest.end)) ? 5000 : null);

  if (!data || !columns)
    return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);
  if (data.error)
    return (<div style={{ "textAlign": "center" }}><h4>{this.state.errMsg}</h4></div>);

  return (
    <>
      <DataTable
        columns={columns}
        rows={data}
        title="Standings"
        config={{ key: "user", defaultOrder: "desc", defaultOrderBy: "totalScore" }}
      />
      <LineChart
        data={{
          datasets: data.map(u => ({
            label: u.user,
            data: u.scoresT
          }))
        }}
        options={chartOptions}
      />
    </>
  );
}

Standings.propTypes = {
  user: PropTypes.object,
  contest: PropTypes.object
}

export default connect(mapStateToProps)(Standings);
