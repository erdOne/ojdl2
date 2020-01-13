import PropTypes from "prop-types";

import verdicts from "common/verdicts";

function Verdict({ verdict, msg, openDialog }) {
  const handleClick = ()=> msg && openDialog(msg);
  var style = { color: verdicts[verdict ?? verdicts.UN].color[0] };
  if (msg) style.borderBottom = "1px dotted";
  return <span style={style} onClick={handleClick}>
    {verdicts[verdict ?? verdicts.UN].status}
  </span>;
}

Verdict.propTypes = {
  verdict: PropTypes.number.isRequired,
  msg: PropTypes.string,
  openDialog: PropTypes.func.isRequired
};

export default Verdict;
