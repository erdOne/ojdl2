import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Table,
  TableBody,
  TableHead,
  TableFooter,
  TableCell,
  TableRow,
  TablePagination,
  Paper,
  FormControlLabel,
  Switch,
  CircularProgress } from "@material-ui/core";

import { TablePaginationActions, VirtualTableToolbar } from "./components";

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
    tableLayout: "fixed"
  },
  headCell: {
    padding: theme.spacing(0, 1)
  },
  tableCell: {
    textOverflow: "ellipsis",
    overflowX: "hidden",
    whiteSpace: "nowrap",
    [theme.breakpoints.down('sm')]: {
      textOverflow: "clip",
      whiteSpace: "normal"
    }
  },
  tableRow: {
    maxHeight: 48,
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

function useAPI({ loadData, page, rowsPerPage, filters }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (data) setData(([rows, rowsLength]) => [[], rowsLength]);
    loadData({ limit: rowsPerPage, offset: page * rowsPerPage, filters })
      .then(res => setData(res))
      .catch(msg => setData({ error: true, errMsg: msg }));
  }, [loadData]);
  return data;
}

function VirtualTable({ columns, config, api, history, location, title }) {
  const classes = useStyles();

  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  let qs = new URLSearchParams(location.search);
  let filters = {};
  for(const key of qs.keys()) if(key in api.queryWhiteList) filters[key] = qs.get(key);
  const page = parseInt(qs.get("page") ?? 1) - 1;
  const data = useAPI({ loadData: api.loadData, filters, page, rowsPerPage });

  useEffect(() => {
    if (!config.typesetMath) return;
    // typesetMath
    try {
      window.MathJax.startup.promise = window.MathJax.startup.promise.then(
        ()=>window.MathJax.typesetPromise()
      );
    } catch (e) {
      console.log("cannot typeset");
    }
  });

  function handleChangeDense(event) {
    setDense(event.target.checked);
  }

  function handleChangePage(event, newPage) {
    qs.set("page", newPage + 1);
    history.push({ search: qs.toString() });
  }
  
  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value));
    qs.set("page", 1); 
    history.push({ search: qs.toString() });
  }

  function sendQuery(form) {
    const qs = new URLSearchParams({ page: 1, ...form });
    history.push({ search: qs.toString() });
  }
  if (!data)
    return (<div style={{ textAlign: "center" }}><CircularProgress /></div>);
  if (data.error)
    return (<div style={{ textAlign: "center" }}><h4>{data.errMsg}</h4></div>);

  const [rows = [], rowsLength] = data ?? [];
  const emptyRows = rowsPerPage - rows.length;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <VirtualTableToolbar title={title} queryWhiteList={api.queryWhiteList} sendQuery={sendQuery} />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >

            <TableHead>
              <TableRow className={classes.tableRow}>
                {
                  columns.map(({ id, align, style, disablePadding, label }) => (
                    <TableCell
                      key={id}
                      align={align}
                      style={style}
                      padding={disablePadding ? "none" : "normal"}
                      className={classes.headCell}
                    >
                     {label}
                    </TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            
            <TableBody>
              {
                rows.map((row, index) => {
                  const onRowClick = evt => {
                    if (!config.link) return;
                    evt.preventDefault();
                    //history.push(config.link(row));
                    window.open(config.link(row));
                  };

                  return (
                    <TableRow
                      hover
                      onClick={onRowClick}
                      tabIndex={-1}
                      key={row[config.key]}
                    >
                      {
                        columns.map((column, i) => (
                          <TableCell
                            {...(i ? {} : { component: "th", scope: "row" })}
                            align={column.align} key={i} className={classes.tableCell}
                          >
                            {column.display ? column.display(row) : row[column.id]}
                          </TableCell>
                        ))
                      }
                    </TableRow>
                  );
                })}
              {
                emptyRows > 0 && Array(emptyRows).fill().map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={columns.length} className={classes.tableCell}>&nbsp;</TableCell> 
                  </TableRow>
                ))
              }
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
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
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

export default withRouter(VirtualTable);
