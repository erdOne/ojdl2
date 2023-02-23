import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { VirtualTable } from "client/components";

import { formattedDate } from "common/date";

const columns = [
  { id: "cid", align: "right", numeric: true,
    disablePadding: false, label: "#", style: { width: 75 } },
  { id: "title", align: "left", numeric: false, disablePadding: false, label: "競賽名稱" },
  { id: "start", align: "left", numeric: false, disablePadding: true, label: "開始時間",
    display: cont=>formattedDate(cont.start) },
  { id: "end", align: "left", numeric: false, disablePadding: true, label: "結束時間",
    display: cont=>formattedDate(cont.end) },
];

function mapStateToProps({ user }) {
  return { user };
}

const Contests = ({ user }) => (
  <VirtualTable columns={columns} title="Contests"
    config={{
      key: "cid",
      link: cont => `/contest/${cont.cid}/home`
    }}
    api={{
      loadData: ({ limit, offset, filters }) => {
        return axios.post("/api/get_conts",
          { uid: user.uid, order: [["cid", "desc"]], limit, offset, filters })
          .then(res => {
            if (res.data.error) throw res.data.msg;
            return [res.data.conts, res.data.contCount];
          });
      },
      queryWhiteList: {
      }
    }}
  />
);

Contests.propTypes = {
  user: PropTypes.object
};
export default connect(mapStateToProps)(Contests);
