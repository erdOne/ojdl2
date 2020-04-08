import { Paper } from "@material-ui/core";

export default function SuggestionsContainer(options) {
  return (
    <Paper square {...options.containerProps}>
      {options.children}
    </Paper>
  );
}
