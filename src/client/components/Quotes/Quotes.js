import { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const styles = theme => ({
  quoteContainer: {
    [theme.breakpoints.down("md")]: {
      display: "none"
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url(/images/auth5.png)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  },
  quoteInner: {
    textAlign: "center",
    flexBasis: "600px"
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  }
});

const quotes = [
    {
        content: "下去啦下去啦",
        author: "oToToT",
        description: "新世界的神"
    },
    {
        content: "Talk is Cheap. Show me the code.",
        author: "Linus Torvalds",
        description: "Co-founder of linux, git and much more."
    }, {
        content: "Truth can only be found in one place: the code.",
        author: "Robert C. Martin",
        description: "Author of \"Clean Code\""
    }
];

class Quotes extends Component {
    render(){
        var quote = quotes[Math.floor(Math.random() * quotes.length)];
        var { classes } = this.props;
        return (
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography className={classes.quoteText} variant="h1">
                  {quote.content}
              </Typography>
              <div className={classes.person}>
                <Typography className={classes.name} variant="body1">
                  {quote.author}
                </Typography>
                <Typography className={classes.bio} variant="body2">
                  {quote.description}
                </Typography>
              </div>
            </div>
          </div>
      );
    }
}

Quotes.propTypes = {
    /* FromStyle */
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Quotes);
