import React from "react";
import PropTypes from "prop-types";

import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel } from "@material-ui/core";

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, headCells, isRequestedSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className={classes.tableRow}>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
            style = {{ ...headCell.style }}
            className={classes.headCell}
          >
            <TableSortLabel
              active={isRequestedSort && orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
              classes={orderBy === headCell.id ? {} : { icon: classes.visuallyHidden }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  headCells: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    numeric: PropTypes.bool.isRequired,
    disablePadding: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

export default EnhancedTableHead;
