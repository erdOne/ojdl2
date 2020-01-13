import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

import { MenuItem, TextField, Paper } from "@material-ui/core";

export function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion, query);
  const parts = parse(suggestion, matches);
  return (
    <MenuItem selected={isHighlighted} component="div" key={suggestion} >
      <div>
        {parts.map((part, i) => (
          <span key={part.text + i} style={{ color: part.highlight ? "" : "black" }}>
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

export function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        }
      }}
      {...other}
    />
  );
}

export function renderSuggestionsContainer(options){
  return (
    <Paper square {...options.containerProps}>
      {options.children}
    </Paper>
  );
}
