import { Component } from "react";
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
        first: false
      };
    if (scoreP.score >= i.score) continue;
    users[i.uid].scoresT.push(
      { t: new Date(i.timestamp) - start, y: user.totalScore },
      { t: new Date(i.timestamp) - start, y: user.totalScore += i.score - scoreP.score }
    );
    scoreP.score = i.score;
    if (i.verdict === verdicts.AC && !ACprobs.has(i.pid)) {
      ACprobs.add(i.pid);
      scoreP.first = true;
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

class Standings extends Component {
  static propTypes = {
    /* FromState */
    user: PropTypes.object,
    contest: PropTypes.object,
  }
  constructor(props) {
    super(props);
    this.state = { dataLoaded: false, chart: false };
    this.init();
  }

  loadData() {
    axios.post("/api/get_subs", { uid: this.props.user.uid, cid: this.props.contest.cid })
      .then(res=>{
        console.log(res.data);
        console.log(this.props.contest);
        this.setState({
          data: datasetFromData(new Date(this.props.contest.start), new Date(this.props.contest.end), res.data.subs),
          dataLoaded: true
        });
      });
  }

  componentDidMount() {
    this.interval ||= setInterval(() => {
      if (new Date(this.props.contest.end) > new Date())
        this.loadData();
      else clearInterval(this.interval);
    }, 5000);
  }

  componentDidUpdate() {
    if (!this.initted) this.init();
  }

  init() {
    if (!this.props.contest.inContest) return;
    this.initted = true;
    this.columns =
      [{ id: "user", align: "left", numeric: false, disablePadding: false, label: "" }]
        .concat(this.props.contest.problems.map((prob, i) => ({
          label: `p${toChars(i)}`, align: "right", numeric: true, disablePadding: false, id: `${i}`,
          display: user => user.scoresP[prob.ppid]?.score || 0
        })))
        .concat([{ id: "totalScore", label: "總分", align: "right", numeric: true, disablePadding: false }]);

    console.log("columns =", this.columns);
    this.loadData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    //const { classes } = this.props;
    if (this.state.error)
      return (<div style={{ "textAlign": "center" }}><h4>{this.state.errMsg}</h4></div>);
    else if (!this.state.dataLoaded)
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);
    else return (
      <>
        <DataTable
          columns={this.columns}
          rows={this.state.data}
          title="Standings"
          config={{ key: "user", defaultOrder: "desc", defaultOrderBy: "totalScore" }}
        />
        <LineChart
          data={{
            datasets: this.state.data.map(u => ({
              label: u.user,
              data: u.scoresT
            }))
          }}
          options={chartOptions}
        />
      </>
    );
  }
}

export default connect(mapStateToProps)(Standings);
