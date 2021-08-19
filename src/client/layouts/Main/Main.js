import React from "react";
import PropTypes from "prop-types";
import { Container, CssBaseline } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { Sidebar, Topbar, Footer } from "./components";
import { styles } from "./styles.js";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Topbar title="OJ的啦" isOpen={this.state.isOpen}
          onSidebarOpen={()=>this.setState({ isOpen: true })} />
        <Sidebar isOpen={this.state.isOpen}
          onSidebarClose={()=>this.setState({ isOpen: false })}/>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            {this.props.children}
          </Container>
          <Footer />
        </main>
      </div>
    );
  }
}

Main.propTypes = {
  children: PropTypes.node,
  /* FromStyle */
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Main);
