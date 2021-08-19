import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { withSnackbar } from "notistack";
import { react as bind } from "auto-bind";
import axios from "axios";

import { Typography, Divider, CircularProgress, Paper as RawPaper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { AddPost, VisibilitySwitch } from "./components";

function mapStateToProps({ user }) {
  return { user };
}

const Paper = withStyles({
  root: {
    margin: 10,
    padding: 15
  }
})(RawPaper);

class Bulletin extends Component {
  static propTypes = {
    /* FromRouter */
    match: PropTypes.object,
    history: PropTypes.object,
    /* FromSnackbar */
    enqueueSnackbar: PropTypes.func,
    /* FromState */
    user: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = { dataLoaded: false, error: false };
    axios.post("/api/get-posts", { cid: this.props.match.params.cid, uid: this.props.user.uid })
      .then(res=>{
        console.log(res.data);
        if (res.data.error) throw res.data;
        this.setState({ posts: res.data.posts, dataLoaded: true });
      }).catch(res=>{
        this.setState({ error: true, errMsg: res.msg });
      });
    bind(this);
  }

  handleSubmit(_, content) {
    axios.post("/api/add-post", {
      content, cid: this.props.match.params.cid, uid: this.props.user.uid
    }).then(res => {
      if (res.data.error) throw res.data;
      this.props.history.go(0);
    }).catch(err => {
      this.props.enqueueSnackbar(err.msg);
    });
  }

  handleReply(poid, reply) {
    axios.post("/api/reply-post", {
      poid, reply, uid: this.props.user.uid
    }).then(res => {
      if (res.data.error) throw res.data;
      this.props.enqueueSnackbar("Success");
    }).catch(err => {
      this.props.enqueueSnackbar(err.msg);
    });
  }

  handleToggle(poid, visibility) {
    visibility = visibility ? "visible" : "hidden";
    axios.post("/api/alter-post", {
      poid, visibility, uid: this.props.user.uid
    }).then(res => {
      if (res.data.error) throw res.data;
      this.props.enqueueSnackbar("Success");
    }).catch(err => {
      this.props.enqueueSnackbar(err.msg);
    });
  }

  render() {
    if (this.state.error)
      return (<div style={{ "textAlign": "center" }}><h4>{this.state.errMsg}</h4></div>);
    if (!this.state.dataLoaded)
      return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);
    return <div>
      <Typography variant="h3">Bulletin</Typography>
      {this.props.user.active ?
        <Paper>
          <AddPost handleSubmit={this.handleSubmit} label="Ask a question / Make a post" />
        </Paper>
        : null}
      {this.state.posts.map(post =>
        <Paper key={post.poid}>
          <Typography variant="caption">
            {post.user.handle} at {new Date(post.createdAt).toLocaleString()}
          </Typography>
          <Typography>{post.content}</Typography>
          {this.props.user.isAdmin ?
            <AddPost poid={post.poid} value={post.reply} label="Reply"
              handleSubmit={this.handleReply}
              secondaryAction={
                <VisibilitySwitch
                  poid={post.poid}
                  checked={post.visibility === "visible"}
                  handleToggle={this.handleToggle}
                />
              }
            />
            : post.reply ?
            <>
              <Divider />
              <Typography variant="caption">
                Reply at {new Date(post.updatedAt).toLocaleString()}
              </Typography>
              <Typography>{post.reply}</Typography>
            </>
              : null}
        </Paper>
      )}
    </div>;
  }
}

export default connect(mapStateToProps)(withRouter(withSnackbar(Bulletin)));
