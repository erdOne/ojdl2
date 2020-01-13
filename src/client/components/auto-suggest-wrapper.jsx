import { Component } from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";

import { withStyles } from "@material-ui/core/styles";

import { renderInputComponent, renderSuggestion, renderSuggestionsContainer } from "./auto-suggest-display.jsx";

const styles = theme => ({
  root: {
    height: 250,
    flexGrow: 1,
  },
  container: {
    position: "relative",
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 99,
    marginTop: -theme.spacing(1),
    left: 0,
    right: 0,
  },
  suggestion: {
    display: "block",
    color: theme.palette.primary.main
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
  },
  divider: {
    height: theme.spacing(2),
  },
});

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSuggestionValue( item ) {
  return item;
}

class AutoSuggestWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value || "",
      suggestions: this.getSuggestions("")
    };

    this.getSuggestions = this.getSuggestions.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());
    const regex = new RegExp("^" + escapedValue, "i");
    return this.props.options.filter(x => regex.test(x));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  render() {
    const { classes, onChange } = this.props;
    const { suggestions } = this.state;
    const inputProps = {
      suggestions,
      onSuggestionsFetchRequested: ({ value }) => this.setState({ suggestions: this.getSuggestions(getSuggestionValue(value)) }),
      onSuggestionsClearRequested: () => this.setState({ suggestions: this.getSuggestions("") }),
      shouldRenderSuggestions: ()=>true,
      getSuggestionValue,
      renderSuggestion,
      renderInputComponent,
      renderSuggestionsContainer,
      inputProps: {
        ...this.props,
        value: this.state.value,
        onChange: (e, { newValue }) => { console.log(newValue); onChange(newValue); this.setState({ value: newValue }); },
        classes
      },
      theme: classes,

    };
    return (
      <Autosuggest {...inputProps} />
    );
  }
}

AutoSuggestWrapper.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string
  ),
  value: PropTypes.string,
  /* FromStyle */
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AutoSuggestWrapper);
