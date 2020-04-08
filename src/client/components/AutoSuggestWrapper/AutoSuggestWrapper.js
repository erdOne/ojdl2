import { Component } from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";

import { withStyles } from "@material-ui/core/styles";

import { react as bind } from "auto-bind";

import {
  InputComponent as renderInputComponent,
  Suggestion as renderSuggestion,
  SuggestionsContainer as renderSuggestionsContainer
} from "./components";

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

function getSuggestionValue( item ) { return item; }

function shouldRenderSuggestions() { return true; }

class AutoSuggestWrapper extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.string,
    onChange: PropTypes.func,
    /* FromStyle */
    classes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value || "",
      suggestions: this.getSuggestions("")
    };

    bind(this);
  }

  onSuggestionsFetchRequested({ value }) {
    this.setState({ suggestions: this.getSuggestions(getSuggestionValue(value)) });
  }

  onSuggestionsClearRequested() {
    this.setState({ suggestions: this.getSuggestions("") });
  }

  getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());
    const regex = new RegExp("^" + escapedValue, "i");
    return this.props.options.filter(x => regex.test(x));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value)
      this.setState({ value: this.props.value });
  }

  render() {
    const { classes, onChange } = this.props;
    const { suggestions } = this.state;
    const { onSuggestionsFetchRequested, onSuggestionsClearRequested } = this;
    const inputProps = {
      suggestions,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
      shouldRenderSuggestions,
      getSuggestionValue,
      renderSuggestion,
      renderInputComponent,
      renderSuggestionsContainer,
      inputProps: {
        ...this.props,
        value: this.state.value,
        onChange: (e, { newValue }) => { onChange(newValue); this.setState({ value: newValue }); },
        classes
      },
      theme: classes,
    };
    return <Autosuggest {...inputProps} />;
  }
}

export default withStyles(styles)(AutoSuggestWrapper);
