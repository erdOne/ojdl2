import { Component } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Dialog, DialogTitle } from "@material-ui/core";

const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  }
});

class Footer extends Component {
  constructor(props){
    super(props);
    this.state = { jizz: false };
  }
  render(){
    const { className, classes, ...rest } = this.props;
    return (
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Typography variant="body1">
        &copy;{" "}
          <span onClick={()=>this.setState({ jizz: true })}>
          No Code No Life
          </span>
      : CK focus group. 2019
        </Typography>
        <Typography variant="caption">
        Created by erd1 with love for coding.
        </Typography>
        <Dialog open={this.state.jizz} keepMounted
          onClose={()=>this.setState({ jizz: false })}>
          <DialogTitle>不知道這個東西能不能活到沒有高中生知道RE:0的那天</DialogTitle>
        </Dialog>
      </div>
    );
  }
}

Footer.propTypes = {
  className: PropTypes.string,
  /* FromStyle */
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
