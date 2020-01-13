import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Line as LineChart } from "react-chartjs-2";
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  Menu,
  MenuItem
} from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import { options } from "./chart";

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 250,
    position: "relative"
  },
  actions: {
    justifyContent: "flex-end"
  }
}));

const LatestSales = props => {
  const { className, data, ...rest } = props;
  console.log(data);
  const classes = useStyles();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [xLen, setXLen] = React.useState(7);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (c) => {
    setXLen(c.currentTarget.value);
    setAnchorEl(null);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <Button size="small" variant="text" onClick={handleClick}>
            Last {xLen} days <ArrowDropDownIcon />
          </Button>
        }
        title="Recent Activity"
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {
          [7, 30, 365]
            .map(i => <MenuItem onClick={handleClose} key={i} value={i}>Last {i} days</MenuItem>)
        }
      </Menu>
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <LineChart
            data={{
              labels: data.labels.slice(-xLen),
              datasets: [
                {
                  label: "Total",
                  backgroundColor: theme.palette.neutral,
                  data: data.Subs.slice(-xLen)
                },
                {
                  label: "AC",
                  backgroundColor: theme.palette.primary.main,
                  data: data.ACs.slice(-xLen)
                }
              ]
            }}
            options={options}
          />
        </div>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          variant="text"
        >
          Overview <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

LatestSales.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object
};

export default LatestSales;
