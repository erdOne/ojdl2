import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Divider,
  Grid,
  Button,
  TextField,
  Typography,
  LinearProgress,
  FormHelperText
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {},
  textField: {
    margin: theme.spacing(1, 0)
  },
  progress: {
    margin: theme.spacing(1, 0)
  },
  uploadButton: {
    textTransform: "none",
    margin: theme.spacing(1, 1, 1, 0),
  }
}));

const fields = [
  {
    // helperText: "please specify first name",
    name: "handle",
    label: "Handle",
    type: "text",
    required: true
  },
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
    name: "password",
    label: "Current password",
    type: "password",
    required: true,
  },
  {
    name: "newPassword",
    label: "New password",
    type: "password",
  },
  {
    name: "newPasswordConfirm",
    label: "New password confirmation",
    type: "password",
  }
];

const AccountEditForm = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [form, setForm] = useState({
    handle: "Benq",
    email: "test@ojdl.ck",
    motto: "",
    password: "",
  });

  const [status, setStatus] = useState({ error: false });

  const handleChangeForm = event => {
    setForm(prevForm => ({
      ...prevForm,
      [event.target.name]: event.target.value
    }));
  };

  const handleChangeFile = event => {
    setForm(prevForm => ({
      ...prevForm,
      [event.target.name]: event.target.files[0]
    }));
  };

  const completeness = 100;

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
          subheader="The information can be edited"
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
            spacing={3}
            direction="column"
          >
            {
              fields.map((field, key) => {
                const { helperText, label, name, value, type, required } = field;
                if (type == "file") {
                  return (
                    <Grid item key={key}>
                      <input
                        label={label}
                        name={name}
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleChangeFile}
                        hidden
                      />
                      <label htmlFor="contained-button-file">
                        <Button
                          component="span"
                          variant="outlined"
                          className={classes.uploadButton}
                        >
                          Change avatar
                        </Button>
                        <FormHelperText component="span">
                          {form[name] ? form[name].name : "*No file selected"}
                        </FormHelperText>
                      </label>
                    </Grid>
                  );
                }
                return (
                  <Grid item key={key} >
                    <TextField
                      margin="dense"
                      variant="outlined"
                      className={classes.textField}
                      onChange={handleChangeForm}
                      value={form[name]}
                      helperText={helperText}
                      label={label}
                      name={name}
                      type={type}
                      required={required}
                    />
                  </Grid>
                );
              })
            }
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
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
