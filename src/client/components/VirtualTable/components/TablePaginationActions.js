import PropTypes from "prop-types";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import { IconButton, TextField } from "@material-ui/core";
import { LastPage, FirstPage, KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";


const useStyles = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
  textField: {
    width: "50px",
    "& input": {
      "text-align": "center"
    }
  }
}));

function TablePaginationActions(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const lastPage = Math.ceil(count / rowsPerPage) - 1;
  return (
    <div className={classes.root}>
      <IconButton onClick={e => onPageChange(e, 0)} disabled={page === 0}>
        {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton onClick={e => onPageChange(e, page - 1)} disabled={page === 0}>
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <TextField
        value={page + 1}
        className={classes.textField}
        margin="dense"
        hiddenLabel
      />
      <IconButton onClick={e => onPageChange(e, page + 1)} disabled={page >= lastPage}>
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={e => onPageChange(e, lastPage)} disabled={page >= lastPage}>
        {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default TablePaginationActions;
