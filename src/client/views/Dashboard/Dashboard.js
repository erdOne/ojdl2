import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import verdicts from "common/verdicts";

import { withStyles } from "@material-ui/styles";
import { Grid, CircularProgress } from "@material-ui/core";

import {
  StreakDisplay,
  ACRatioDisplay,
  TasksProgress,
  TotalProfit,
  LatestSales,
  UsersByDevice
} from "./components";

const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  }
});

function mapStateToProps({ user }) {
  return { user };
}

class Dashboard extends Component {
  static propTypes = {
    /* FromStyle */
    classes: PropTypes.object,
    /* FromState */
    user: PropTypes.object
  }

  constructor(props) {
    super(props);
    var active = this.props.user.active;
    this.state = { dataLoaded: !active, active };
    if (active)
      axios.post("/api/get-dashboard-data", { uid: this.props.user.uid })
        .then(res=>{
          console.log(res);
          this.setState({ ...res.data, dataLoaded: true });
          if (res.data.error) throw res.data;
        }).catch(res=>{
          this.setState({ error: true, errMsg: res.msg });
        });
  }

  render() {
    if (!this.state.active) return "GO Sign In";
    if (!this.state.dataLoaded)
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);
    const { classes } = this.props;
    const { user, probs } = this.state;
    var streak = 0;
    var totalSubs = 0, totalVerdicts = {},
      pastSubs = 0, pastACs = 0,
      ACCount = 0, totalProbs = probs.length,
      totalScore, data;
    {
      const days = 1000 * 60 * 60 * 24;
      const submissions = user?.submissions || [];
      let curDate = Math.floor(new Date() / days),
        ACSet = new Set(), scoreMap = new Map(),
        totalDays = submissions.length > 0 ?
          curDate - Math.floor(new Date(submissions[0].timestamp) / days) + 1 : 1;
      data = {
        labels: Array.fromFn(totalDays, i => new Date(new Date() - i * days)
          .toLocaleDateString(undefined, { month: "short", day: "numeric" })
        ),
        ACs: Array.init(totalDays, 0),
        Subs: Array.init(totalDays, 0),
      };
      for (let s of submissions.reverse()) {
        s.timestamp = new Date(s.timestamp);
        var sDate = curDate - Math.floor(s.timestamp / days);
        if (sDate === streak)streak++;
        if (s.verdict === verdicts.AC) {
          data.ACs[sDate]++;
          ACSet.add(s.pid);
          scoreMap.set(s.pid, Math.max(scoreMap.get(s.pid) || 0, s.score * s.problem.difficulty));
        }
        if (s.timestamp < new Date() - 7 * days) {
          if (s.verdict === verdicts.AC)pastACs++;
          pastSubs++;
        }
        data.Subs[sDate]++;
        totalSubs++;
        totalVerdicts[s.verdict] |= 0;
        totalVerdicts[s.verdict]++;
      }
      ACCount = ACSet.size;
      totalScore = Array.from(scoreMap.values()).sum();
      data.labels.reverse();
      data.ACs.reverse();
      data.Subs.reverse();
    }
    return (
      <div className={classes.root}>
        <Grid container spacing={4}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <StreakDisplay streak={streak} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <ACRatioDisplay
              totalACs={totalVerdicts[verdicts.AC]}
              totalSubs={totalSubs}
              pastRatio={Math.floor(pastACs / pastSubs * 100)}
            />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TasksProgress totalProbs={totalProbs} ACCount={ACCount} />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <TotalProfit totalScore={totalScore} />
          </Grid>
          <Grid item lg={8} md={8} xl={9} xs={12}>
            <LatestSales data={data} />
          </Grid>
          <Grid item lg={4} md={4} xl={3} xs={12}>
            <UsersByDevice data={totalVerdicts}/>
          </Grid>
          {/*
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <LatestProducts />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <LatestOrders />
          </Grid>
          */}
        </Grid>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Dashboard));
