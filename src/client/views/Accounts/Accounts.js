import React from "react";
import axios from "axios";

import { makeStyles } from "@material-ui/core/styles";
import { Grid, Avatar } from "@material-ui/core";

import { VirtualTable } from "client/components";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const columns = [
  { id: "handle", align: "left", label: "handle", style: { width: 75 },
    display: user => user.handle },
  { id: "avatar", align: "left", label: "avatar", disablePadding: true, style: { width: 75 },
    display: user =>
      <Avatar
        variant="rounded"
        src={user.avatar && user.avatar !== "" ? `/images/avatars/${user.avatar}` : ""}
      />
  },
  { id: "motto", align: "left", label: "motto", style: { width: 150 },
    display: user => user.motto },
  { id: "acProbCount", align: "right", label: "accepted",  style: { width: 75 },
    display: user => user.acProbCount },
];


const Accounts = () => {
  const classes = useStyles();

  const getUser = async ({ limit, offset, filters }) => {
    const res = await axios.post("/api/get-users", { limit, offset, filters });
    // console.log(res.data);
    if (res.data.error)
      throw res.data.msg;
    const { users, userCount } = res.data;
    return [users, userCount];
  };

  return (
    <div className={classes.root}>
      <VirtualTable
        title="Ranking"
        columns={columns}
        api={{
          loadData: getUser,
          queryWhiteList: {
            "handle": null
          }
        }}
        config={{
          key: "handle",
          link: user => `./account/${user.handle}`,
          typesetMath: true
        }}
      />
    </div>
  );
};

export default Accounts;
