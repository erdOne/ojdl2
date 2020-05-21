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
    flex: "3 1 300%"
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

const EnhancedTableToolbar = ({ title, queryWhiteList, sendQuery }) => {
  const classes = useToolbarStyles();
  const [form, setForm] = useState({});

  function handleChangeForm(evt) {
    setForm(prevForm => {
      return { ...prevForm, [evt.target.name]: evt.target.value };
    });
  }

  function getOptionsProps(key) {
    return {
      label: key.split(/(?=[A-Z])/).map(i => i.toLowerCase()).join(" ").capitalize(),
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
      <form onSubmit={() => sendQuery(form)} style={{ display: "flex", flexDirection: "row" }}> 
        <div className={classes.filter}>
          {Object.entries(queryWhiteList).map(([term, options]) =>
            options ? (
              <>
                <InputLabel shrink>{term}</InputLabel>
                <TextField select {...getOptionsProps(term)}>
                  {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                </TextField>
              </>
            ) : <TextField {...getOptionsProps(term)} />
          )}
        </div>
        <Button variant="contained" color="primary" type="submit"> Submit </Button>
      </form>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  title: PropTypes.string.isRequired,
};

export default EnhancedTableToolbar;
