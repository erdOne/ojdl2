import { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import {
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel } from "@material-ui/core";
import { Delete as DeleteIcon, FilterList as FilterListIcon } from "@material-ui/icons";

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  filter: {
    flex: "5 1 auto"
  },
  spacer: {
    flex: "1 1 100%",
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: "0 0 auto",
  },
}));

const VirtualTableToolbar = ({ title, queryWhiteList, sendQuery }) => {
  const classes = useToolbarStyles();
  const [form, setForm] = useState({});

  function handleChangeForm(evt) {
    const { name, value } = evt.target;
    setForm(prevForm => {
      return { ...prevForm, [name]: value };
    });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    sendQuery(form);
    setForm({});
  }

  function getOptionsProps(key) {
    return {
      label: key.replace(/[-_]/, " ").toLowerCase().capitalize(),
      name: key,
      value: form[key] ?? "",
      onChange: handleChangeForm
    };
  };

  return (
    <Toolbar className={classes.root}>
      <div className={classes.title}>
        <Typography variant="h4" id="tableTitle">
          {title}
        </Typography>
      </div>
      <div className={classes.spacer} />
      <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "nowrap", flex: "0 0 60%" }}> 
        {Object.entries(queryWhiteList).map(([term, options]) =>
          <div className={classes.filter} key={term}>
          {options ? (
              <TextField select {...getOptionsProps(term)} style={{ minWidth: 140 }}>
                {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </TextField>
          ) : <TextField {...getOptionsProps(term)} />}
          </div>
        )}
        <Button variant="contained" color="primary" type="submit" className={classes.filter}> Submit </Button>
      </form>
    </Toolbar>
  );
};
VirtualTableToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  queryWhiteList: PropTypes.object,
  sendQuery: PropTypes.func.isRequired
};

export default VirtualTableToolbar;
