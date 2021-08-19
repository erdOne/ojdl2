import "regenerator-runtime/runtime";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import Routes from "./Routes";
import { Provider } from "react-redux";
import { createStore } from "redux";
import getRootReducer from "./reducers";
import { ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { createBrowserHistory } from "history";
import { create } from "jss";
import preset from "jss-preset-default";
import { StylesProvider } from "@material-ui/core/styles";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { MuiPickersUtilsProvider } from "@material-ui/pickers";


import "common/array";

import theme from "./theme";

const jss = create(preset());
const browserHistory = createBrowserHistory();

(async () => {
  const store = createStore(await getRootReducer());
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme = {theme}>
        <StylesProvider jss={jss}>
          <SnackbarProvider maxSnack={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Router history={browserHistory}>
                <Routes />
              </Router>
            </MuiPickersUtilsProvider>
          </SnackbarProvider>
        </StylesProvider>
      </ThemeProvider>
    </Provider>
    , document.getElementById("root"));
})();
