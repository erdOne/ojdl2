import { useState, useEffect } from "react";
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
  progress: {
    margin: theme.spacing(1, 0)
  },
  textField: {
    // margin: theme.spacing(1, 0)
  },
  uploadButton: {
    textTransform: "none",
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
  /*
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
  */
];

const AccountEditForm = props => {
  const { className, user, handleSubmit, ...rest } = props;

  const classes = useStyles();

  const [form, setForm] = useState({
    handle: "",
    email: "",
    motto: "",
    currentPassword: "",
    password: "",
    passwordConfirm: "",
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
      ...user
    }));
  }, [user]);

  // const completeness = 100;

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
            {
              fields.map((field, key) => {
                const { helperText, label, name, type, required } = field;
                if (type == "file") {
                  return (
                    <Grid item key={name}>
                      <input
                        accept="image/*"
                        className={classes.input}
                        onChange={handleChangeFile}
                        id="contained-button-file"
                        label={label}
                        name={name}
                        type="file"
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
                } else {
                  return (
                    <Grid item key={name} >
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
                        autoComplete="new-text"
                      />
                    </Grid>
                  );
                }
              })
            }
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
