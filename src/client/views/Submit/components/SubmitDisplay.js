import { Component } from "react";
import PropTypes from "prop-types";

import { Typography, Paper, Button } from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

import AutoSuggestWrapper from "components/AutoSuggestWrapper";
import Editor from "components/Editor";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    "& .CodeMirror": {
      height: "auto"
    },
    "& .CodeMirror-scroll": {
      minHeight: "300px"
    }
  }
});

class SubmitDisplay extends Component {
  static propTypes = {
    problems: PropTypes.arrayOf(PropTypes.string),
    problemSelected: PropTypes.string,
    languages: PropTypes.arrayOf(PropTypes.string),
    languageSelected: PropTypes.string,
    handleChange: PropTypes.func,
    handleSubmit: PropTypes.func,
    editorMode: PropTypes.string,
    /* FromStyle */
    classes: PropTypes.object
  }

  render() {
    const {
      problems, problemSelected,
      languages, languageSelected,
      handleChange, handleSubmit,
      editorMode, classes
    } = this.props;
    return (
      <div>
        <Typography variant="h3">Submit</Typography>
        <AutoSuggestWrapper label="Problem" margin="normal" fullWidth
          options={problems}
          value={problemSelected}
          onChange={handleChange("problem")}
        />
        <AutoSuggestWrapper label="Language" margin="normal" fullWidth
          options={languages}
          value={languageSelected}
          onChange={handleChange("language")}
        />
        <Paper className = {classes.paper}>
          <Editor mode = {editorMode} onChange={handleChange("code")}/>
        </Paper>
        <Button variant="contained" color="primary"
          margin="normal" onClick={handleSubmit} >
          <SendIcon />Submit
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(SubmitDisplay);
