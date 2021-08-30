import { useState, useEffect } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  Typography,
  LinearProgress,
  FormHelperText,
  IconButton,
} from "@material-ui/core";

import { AttachFile as AttachFileIcon } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  root: {},
  progress: {
    margin: theme.spacing(1, 0)
  },
  textField: {
    // margin: theme.spacing(1, 0)
  },
  uploadButton: {
    textTransform: "none",
    textAlign: "left",
    marginRight: theme.spacing(1),
  }
}));

const fields = [
  /*
  {
    helperText: "Changing handle feature WIP",
    name: "handle",
    label: "Handle",
    type: "text",
    required: true
  },
  */
  {
    name: "email",
    label: "Email address",
    type: "text",
  },
  {
    name: "motto",
    label: "Motto",
    type: "text",
  },
  {
    name: "avatar",
    label: "Avatar",
    type: "file",
  },
  {
    name: "currentPassword",
    label: "Current password",
    type: "password",
    required: true,
  },
  {
    name: "password",
    label: "New password",
    type: "password",
  },
  {
    name: "passwordConfirm",
    label: "New password confirmation",
    type: "password",
  }
];

const AccountEditForm = props => {
  const { className, user, handleSubmit, ...rest } = props;

  const classes = useStyles();

  const [form, setForm] = useState({
    handle: null,
    email: null,
    motto: null,
    currentPassword: null,
    password: null,
    passwordConfirm: null
  });

  const handleChangeForm = event => {
    const { name, value } = event.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleChangeFile = event => {
    const { name, files } = event.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: files[0]
    }));
  };

  useEffect(() => {
    setForm(prevForm => ({
      ...prevForm,
      ...user,
      avatar: null
    }));
  }, [user]);

  // const completeness = 100;

  const renderField = (field) =>  {
    const { helperText, label, name, type, required } = field;
    const onChange = (type === "file" ? () => null : handleChangeForm);
    const value = (type === "file" ? (form[name]?.name ?? "*No file selected") : form[name] ?? "");
    let InputProps = {};
    if (type == "file") {
      InputProps.endAdornment = (
        <label>
          <input
            accept="image/*"
            onChange={handleChangeFile}
            label={label}
            name={name}
            type="file"
            hidden
          />
          <IconButton
            component="span"
            variant="outlined"
            className={classes.uploadButton}
            size="small"
            edge="end"
          >
            <AttachFileIcon />
          </IconButton>
        </label>
      );
      InputProps.readOnly = true;
    }
    return (
      <Grid item key={name} >
        <TextField
          fullWidth
          margin="dense"
          variant="outlined"
          className={classes.textField}
          onChange={onChange}
          value={value}
          helperText={helperText}
          label={label}
          name={name}
          required={required}
          type={type === "file" ? "text" : type}
          autoComplete="new-text"
          InputProps={InputProps}
        />
      </Grid>
    );
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          title="Profile"
          subheader="These information can be edited"
        />
        {
          /*
          <div className={classes.progress}>
            <Typography variant="body1">Profile Completeness: {completeness}%</Typography>
            <LinearProgress
              value={completeness}
              variant="determinate"
            />
          </div>
          */
        }
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={1}
            direction="column"
          >
            {fields.map(renderField)}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleSubmit(form)}
          >
            Save details
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

AccountEditForm.propTypes = {
  className: PropTypes.string
};

export default AccountEditForm;
