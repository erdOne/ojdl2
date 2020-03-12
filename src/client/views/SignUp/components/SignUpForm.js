import { Component } from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import { deepAssign } from "utils";
import {
  Button,
  TextField,
  Link,
  FormHelperText,
  Checkbox,
  Typography
} from "@material-ui/core";
import { hashPswAtClient, hashUid } from "common/hash";
import { signIn } from "actions";


const fieldTypes = {
  text: {
    value: "",
    valueName: "value"
  },
  checkbox: {
    value: false,
    valueName: "checked"
  }
};

const styles = theme => ({
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down("sm")]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: "flex",
    alignItems: "center"
  },
  policyCheckbox: {
    marginLeft: "-14px"
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
});

function mapStateToProps({ user }) {
  return { userActive: user.active };
}

function mapDispatchToProps(dispatch) {
  return {
    handleSignIn: uid => dispatch(signIn(uid))
  };
}

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.deepSetState = x => this.setState(deepAssign(this.state, x));
    this.fields = {
      handle: {
        type: "text",
        validate: targ => /[A-z0-9]{6,100}/.test(targ.value)
      },
      password: {
        type: "text",
        validate: targ => /.{6,100}/.test(targ.value)
      },
      confpsw: {
        type: "text",
        validate: targ => targ.value === this.state.fields.password.value
      },
      policy: {
        type: "checkbox",
        validate: targ => targ.checked
      },
    };

    this.state = {
      fields: Object.keys(this.fields).reduce((acc, cur) => ({
        ...acc,
        [cur]: {
          value: fieldTypes[this.fields[cur].type].value,
          error: false
        }
      }), {}),
      handleServerError: false
    };

    this.onSignUp = this.onSignUp.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSignUp(e) {
    e.preventDefault();
    var hashPsw = hashPswAtClient(this.state.fields.password.value);
    axios.post("/api/sign-up", {
      handle: this.state.fields.handle.value,
      password: hashPsw
    }).then(res=>{
      if (res.data.error) {
        if (res.data.msg === "handle taken") this.setState({ handleServerError: true });
        console.error(res.data.msg);
      } else {
        this.props.handleSignIn(hashUid(this.state.handle, hashPsw));
        this.props.enqueueSnackbar("註冊成功");
      }
    });
  }

  onChange(event) {
    var { type, validate } = this.fields[event.target.name];
    var fields = { [event.target.name]: {
      value: event.target[fieldTypes[type].valueName],
      error: !validate(event.target)
    } };
    if (event.target.name === "password" && this.state.fields.confpsw.value !== "")
      fields.confpsw = { error: this.state.fields.confpsw.value !== event.target.value };

    var handleServerError = this.state.handleServerError && event.target.name !== "handle";
    this.setState(deepAssign(this.state, { handleServerError, fields }));
  }

  render() {
    const { classes } = this.props;
    if (this.props.userActive)
      return (<Redirect to="/" />);

    return (
      <form className={classes.form} onSubmit={this.onSignUp}>
        <Typography className={classes.title} variant="h2" >
          創建新帳號
        </Typography>
        <Typography color="textSecondary" gutterBottom >
          密碼有hash過，請放心食用。
        </Typography>
        <TextField type="text" name="handle" label="帳號"
          fullWidth variant="outlined" className={classes.textField}
          value={this.state.fields.handle.value} onChange={this.onChange}
          error={this.state.fields.handle.error || this.state.handleServerError}
          helperText={this.state.fields.handle.error ?
            "請使用6~100個英數字元" :
            (this.state.handleServerError ? "此帳號已被使用" : "")
          }
        />
        <TextField type="password" name="password" label="密碼"
          fullWidth variant="outlined" className={classes.textField}
          {...this.state.fields.password} onChange={this.onChange}
          helperText={this.state.fields.password.error ? "請使用6~100個字元" : ""}
        />
        <TextField type="password" name="confpsw" label="確認密碼"
          fullWidth variant="outlined" className={classes.textField}
          {...this.state.fields.confpsw} onChange={this.onChange}
          helperText={this.state.fields.confpsw.error ? "與密碼不相符" : ""}
        />
        <div className={classes.policy}>
          <Checkbox
            checked={this.state.fields.policy.value}
            className={classes.policyCheckbox}
            color="primary"
            name="policy"
            onChange={this.onChange}
          />
          <Typography className={classes.policyText} color="textSecondary" variant="body1">
            我已認真閱讀並同意
            <Link color="primary" component={RouterLink} to="#" underline="always" variant="h6">
              使用條款
            </Link>
          </Typography>
        </div>
        {this.state.fields.policy.error && (
          <FormHelperText error>請確認不存在的使用條款</FormHelperText>
        )}
        <Button
          className={classes.signUpButton}
          color="primary"
          disabled={
            !this.state.fields.policy.value ||
            Object.keys(this.state.fields)
              .map(field => this.state.fields[field].error || this.state.fields[field].value === "")
              .reduce((a, b) => a || b)
          }
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
                  Sign up now
        </Button>
        <Typography color="textSecondary" variant="body1">
                  Have an account?{" "}
          <Link component={RouterLink} to="/sign-in" variant="h6" >
                    Sign in
          </Link>
        </Typography>
      </form>
    );
  }
}

SignUpForm.propTypes = {
  /* FromStyle */
  classes: PropTypes.object.isRequired,
  /* FromSnackbar */
  enqueueSnackbar: PropTypes.func.isRequired,
  /* FromState */
  userActive: PropTypes.bool.isRequired,
  /* FromDispatch */
  handleSignIn: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withSnackbar(withStyles(styles)(SignUpForm))
);
