import { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { Typography, TextField, Button, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { hashUid } from "common/hash";

const styles = theme => ({
  paper: {
    padding: theme.spacing(1)
  },
  button: {
    margin: theme.spacing(1)
  }
});


class Login extends Component{
  constructor(props){
    super(props);
    this.state = {
      handle: "",
      handleError: false,
      password: "",
      passwordError: false
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(){
    axios.post("/api/login", {
      handle: this.state.handle,
      password: this.state.password
    }).then(res=>{
      if(res.error){
        if(res.msg === "no such user") { this.setState({ handleError: true }); }
        if(res.msg === "wrong password") { this.setState({ passwordError: true }); }
      }else{
        sessionStorage.setItem("uid", hashUid(this.state.handle, this.state.password));
      }
    });
  }

  render(){
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <Typography variant="h3">Login</Typography>
        <TextField type="text" label="帳號" fullWidth
          value={this.state.handle} onChange={event => this.setState({ handle: event.target.value })}
          error={this.state.handleError} helperText={this.state.handleError ? "此帳號不存在" : ""}
        />
        <TextField type="text" label="帳號" fullWidth
          value={this.state.psw} onChange={event => this.setState({ password: event.target.value })}
          error={this.state.passwordError} helperText={this.state.passwordError ? "此帳號不存在" : ""}
        />
        <Button variant="contained" className={classes.button} onClick={this.onClick}>登入</Button>
      </Paper>);
  }
}

Login.propTypes = {
  /* FromStyle */
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Login);
