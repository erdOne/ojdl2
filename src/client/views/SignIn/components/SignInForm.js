import { Component } from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";
import {
  Button,
  TextField,
  Link,
  Typography
} from "@material-ui/core";
import { hashPswAtClient, hashUid } from "common/hash";
import { signIn } from "client/actions";

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
  signInButton: {
    margin: theme.spacing(2, 0)
  },
  none: {}
});


function mapStateToProps({ user }) {
  return { userActive: user.active };
}

function mapDispatchToProps(dispatch) {
  return {
    handleSignIn: (...x) => dispatch(signIn(...x))
  };
}

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: "",
      handleError: false,
      password: "",
      passwordError: false
    };
    this.onSignIn = this.onSignIn.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onSignIn(e) {
    e.preventDefault();
    var hashPsw = hashPswAtClient(this.state.password);
    axios.post("/api/sign-in", {
      handle: this.state.handle,
      password: hashPsw
    }).then(res=>{
      if (res.data.error) {
        if (res.data.msg === "no such user") this.setState({ handleError: true });
        if (res.data.msg === "wrong password") this.setState({ passwordError: true });
        console.error(res.data.msg);
      } else {
        var uid = hashUid(this.state.handle, hashPsw);
        this.props.handleSignIn(uid, res.data.isAdmin);
        this.props.enqueueSnackbar(`歡迎，${this.state.handle}～`);
        axios.post("/api/cookie-make", { uid })
          .then(res => {
            if (res.data.error) throw res.data.msg;
            // console.log("cookie make success");
          })
          .catch(err => console.log(err));
      }
    });
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { classes } = this.props;
    if (this.props.userActive)
      return (<Redirect to="/" />);

    return (
      <form className={classes.form} onSubmit={this.onSignIn}>
        <Typography className={classes.title} variant="h2">
                登入
        </Typography>
        <TextField type="text" name="handle" label="帳號" autoComplete="username"
          fullWidth variant="outlined" className={classes.textField}
          value={this.state.handle} onChange={this.onChange}
          InputProps={{ classes: { notchedOutline: classes.none } }}
          error={this.state.handleError} helperText={this.state.handleError ? "此帳號不存在" : ""}
        />
        <TextField type="password" name="password" label="密碼" autoComplete="current-password"
          fullWidth variant="outlined" className={classes.textField}
          value={this.state.password} onChange={this.onChange}
          InputProps={{ classes: { notchedOutline: classes.none } }}
          error={this.state.passwordError} helperText={this.state.passwordError ? "密碼錯誤" : ""}
        />
        <Button
          className={classes.signInButton}
          color="primary"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
                登入
        </Button>
        <Typography color="textSecondary" variant="body1">
                沒有帳號嗎?{" "}
          <Link component={RouterLink} to="/sign-up" variant="h6">
                  立即註冊
          </Link>
        </Typography>
      </form>
    );
  }
}

SignInForm.propTypes = {
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
  withSnackbar(withStyles(styles)(SignInForm))
);
