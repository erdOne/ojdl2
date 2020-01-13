import {Component} from "react";
import PropTypes from "prop-types";


import { Paper, Button } from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

import AutoSuggestWrapper from "../../components/auto-suggest-wrapper.jsx";
import Editor from "../../components/editor.jsx";

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    }
});

class Submit extends Component{
    render(){
        var { classes } = this.props;
        return (
            <div>
                <AutoSuggestWrapper label="Problem" margin="normal" fullWidth options={["jizz1", "jizz2", "jizz3"]} />
                <AutoSuggestWrapper label="Language" margin="normal" fullWidth options={["jizz1", "jizz2", "jizz3"]} />
                <Paper className = {classes.paper}>
                    <Editor />
                </Paper>
                <Button variant="contained" color="primary" margin="normal"><SendIcon />Submit</Button>
            </div>
        );
    }
}

Submit.propTypes = {
    /* FromStyle */
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Submit);
