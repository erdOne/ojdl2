import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

import { MenuItem } from "@material-ui/core";

export function Suggestion(suggestion, { query, isHighlighted }) {
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
