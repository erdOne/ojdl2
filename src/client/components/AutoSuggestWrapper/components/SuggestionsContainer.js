import { Paper } from "@material-ui/core";

export function renderSuggestionsContainer(options) {
  return (
    <Paper square {...options.containerProps}>
      {options.children}
    </Paper>
  );
}
