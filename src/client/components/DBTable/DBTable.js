import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter, RouterLink as Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import { Table,
  TableBody,
  TableHead,
  TableFooter,
  TableCell,
  TableRow,
  TablePagination,
  Paper,
  FormControlLabel,
  Switch } from "@material-ui/core";
import axios from "axios";

import { TablePaginationActions, EnhancedTableHead, EnhancedTableToolbar } from "./components";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
  //  minWidth: 750,
  },
  headCell: {
    padding: theme.spacing(0, 1)
  },
  tableRow: {
    "&>:first-child": {
      paddingLeft: theme.spacing(2)
    },
    "&>:last-child": {
      paddingRight: theme.spacing(2)
    }
  },
  tableWrapper: {
    overflowX: "auto",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function useAPI({ url, order, page, rowsPerPage, extract, ...rest }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    axios.post(url, { order, limit: rowsPerPage, offset: page * rowsPerPage, ...rest })
      .then(res => setData(extract(res.data)))
      .catch(res => setData({ err: true, errMsg: res.msg }));
  }, [order, page, rowsPerPage]);
  return data;
}

function DBTable({ columns, config, history, location, title }) {
  const classes = useStyles();

  function handleChangeDense(event) {
    setDense(event.target.checked);
  }

  function handleChangePage(event, newPage) {
    qs.set("page", newPage + 1);
    history.push({ search: qs.toString() });
  }

  function sendQuery(form) {
    for(const { key, value } of Object.entries(form)) qs.set(key, value);
    history.push({ search: qs.toString() });
  }

  const [dense, setDense] = useState(false);
  const qs = new URLSearchParams(location.search);
  const rowsPerPage = 5;
  const page = parseInt(qs.get("page") ?? 1) - 1;
  const data = useAPI({
    url: config.api.url, order: config.order, extract: config.api.extract,
    filters: Object.fromEntries(Array.from(qs.entries()).filter(([key, val]) => (key in config.api.queryWhiteList))),
    page, rowsPerPage, ...config.api.args
  });

  if (data === null)
    return (<div style={{ "textAlign": "center" }}><CircularProgress /></div>);
  if (data.err)
    return (<div style={{ "textAlign": "center" }}><h4>{data.errMsg}</h4></div>);

  const [rows, rowsLength] = data;
  const emptyRows = rowsPerPage - rows.length;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar title={title} queryWhiteList={config.api.queryWhiteList} sendQuery={sendQuery} />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >

            <TableHead>
              <TableRow className={classes.tableRow}>
                {columns.map(({ id, align, style, disablePadding, label }) => {
                  return (
                    <TableCell
                      key={id}
                      align={align}
                      style={style}
                      padding={disablePadding ? "none" : "default"}
                      className={classes.headCell}
                    >
                     {label}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            
            <TableBody>
              {
                rows.map((row, index) => {
                  const onRowClick = evt => {
                    if(!config.link) return;
                    evt.preventDefault();
                    //history.push(config.link(row));
                    window.open(config.link(row));
                  };

                  return (
                    <TableRow
                      hover
                      onClick={onRowClick}
                      role="checkbox"
                      tabIndex={-1}
                      key={row[config.key]}
                    >
                      {
                        columns.map((column, i) => (
                          <TableCell
                            {...(i ? {} : { component: "th", scope: "row" })}
                            align={column.align} key={i}
                          >
                            {column.display ? column.display(row) : row[column.id]}
                          </TableCell>
                        ))
                      }
                    </TableRow>
                  );
                })}
              {
                Array(emptyRows).fill().map((_, index) => (
                  <TableRow key={`emptyRow-${index}`} style={{ "height": 49 }}>
                    <TableCell colSpan={columns.length} />
                  </TableRow>
                )
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={columns.length}
                  count={rowsLength}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={(event, x) => x}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}

export default withRouter(DBTable);
