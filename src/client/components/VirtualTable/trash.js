import React from "react";
import PropTypes from "prop-types";

import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel } from "@material-ui/core";

function EnhancedTableHead(props) {
  const { classes, order, onRequestSort, headCells } = props;

  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className={classes.tableRow}>
        {headCells.map(headCell => {
          const { id, align, style, disablePadding } = headCell;
          const sortDirection = order[id];
          return (
            <TableCell
              key={id}
              align={align}
              padding={disablePadding ? "none" : "default"}
              sortDirection={sortDirection || false}
              style = {style}
              className={classes.headCell}
            >
              <TableSortLabel
                active={order[id] !== undefined}
                direction={sortDirection}
                onClick={createSortHandler(id)}
                classes={sortDirection ? {} : { icon: classes.visuallyHidden }}
              >
                {headCell.label}
                {
                  sortDirection ? (
                    <span className={classes.visuallyHidden}>
                      {sortDirection === "desc" ? "sorted descending" : "sorted ascending"}
                    </span>
                  ) : null
                }
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.arrayOf(PropTypes.array).isRequired,
  headCells: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    numeric: PropTypes.bool.isRequired,
    disablePadding: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

export default EnhancedTableHead;
