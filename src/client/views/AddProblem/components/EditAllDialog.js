import { Component } from "react";
import PropTypes from "prop-types";

import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent
} from "@material-ui/core";

class EditAllDialog extends Component{

  static propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired
  }

  constructor(props){
    super(props);
    this.state = { open: this.props.open, timeLimit: "", memLimit: "" };
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidUpdate(prevprops){
    if(prevprops.open !== this.props.open){
      this.setState({ open: this.props.open });
      if(this.props.open)this.setState({ timeLimit: "", memLimit: "" });
    }
  }

  render(){
    var { onClose, open } = this.props;
    var val = e => e.target.value;
    return (
      <Dialog
        open={open}
        onClose={()=>onClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>Edit all testcases</DialogTitle>
        <DialogContent>
          <TextField autoFocus label="Time limit (ms)" style={{ width: "45%", margin: 10 }}
            value={this.state.timeLimit} onChange={e=>this.setState({ timeLimit: val(e) })}/>
          <TextField autoFocus label="Memory limit (KB)" style={{ width: "45%", margin: 10 }}
            value={this.state.memLimit} onChange={e=>this.setState({ memLimit: val(e) })}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>onClose()} color="default">
           Cancel
          </Button>
          <Button onClick={()=>onClose(this.state)} color="primary" autoFocus>
           Confirm
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default EditAllDialog;
