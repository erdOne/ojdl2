import { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { withRouter } from "react-router";
import { withSnackbar } from "notistack";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, CircularProgress } from "@material-ui/core";

import { hashPswAtClient } from "common/hash.js";

import { AccountProfile, AccountEditForm } from "./components";

function mapStateToProps({ user }) {
  return { user };
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Account = (props) => {
  const classes = useStyles();

  const [values, setValues] = useState(null);

  const handleSubmit = async (form) => {
    props.enqueueSnackbar("請靜候資料送出");

    const uid = props.user.uid;
    const currentPassword = hashPswAtClient(form.currentPassword);
    const { motto, email, avatar } = form;

    let formData = new FormData();
    formData.set("uid", uid);
    formData.set("currentPassword", currentPassword);
    if (motto)
      formData.set("motto", motto);
    if (email)
      formData.set("email", email);
    if (avatar)
      formData.set("avatar", avatar);

    const res = await axios.post("/api/update-user", formData);
    if (res.data.error) {
      props.enqueueSnackbar(res.data.msg);
      return;
    } else {
      props.history.go(0);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const uid = props.user.uid;
      const handle = props.match.params.handle;
      const res = await axios.post("/api/get-user", { handle, uid });
      if (res.data.error) {
        setValues({ error: true, msg: res.data.msg });
        return;
      }
      const { user, stats, editable } = res.data;
      // console.log(user, stats, editable);
      setValues({ user, stats, editable });
    }
    fetchData();
  }, []);

  if (!props.match.params.handle && !props.user.active)
    return "GO SIGN IN";
  if (!values)
    return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);
  if (values.error)
    return values.msg;

  const { user, stats, editable } = values;

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={4}
          md={5}
          xl={4}
          xs={12}
        >
          <AccountProfile user={user} stats={stats} />
        </Grid>
        {
          editable &&
          <Grid
            item
            lg={8}
            md={6}
            xl={8}
            xs={12}
          >
            <AccountEditForm user={user} handleSubmit={handleSubmit} />
          </Grid>
        }
      </Grid>
    </div>
  );
};

export default connect(mapStateToProps)(withSnackbar(withRouter(Account)));
