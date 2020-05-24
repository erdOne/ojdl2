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
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap"
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
  textField: {
    margin: theme.spacing(1, 1),
    width: "max(150px, 10vw)",
    fallbacks: {
      width: 150
    }
  },
  filters: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    flex: "0 0 auto",
    [theme.breakpoints.down('sm')]: {
      flex: "0 0 80%"
    }
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
      key: key,
      label: key.replace(/[-_]/, " ").toLowerCase().capitalize(),
      name: key,
      value: form[key] ?? "",
      onChange: handleChangeForm,
      className: classes.textField
    };
  };

  return (
    <Toolbar className={classes.root}>
      <div className={classes.title}>
        <Typography variant="h4" id="tableTitle">
          {title}
        </Typography>
      </div>
      <form onSubmit={handleSubmit} className={classes.filters}> 
        {Object.keys(queryWhiteList).map(term => {
          const options = queryWhiteList[term];
          return options ? (
              <TextField select {...getOptionsProps(term)}>
                {options.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
              </TextField>
            ) : <TextField {...getOptionsProps(term)} />
          ;
        })}
        <Button variant="contained" color="primary" type="submit" style={{ height: "30px" }}>
          Search
        </Button>
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
