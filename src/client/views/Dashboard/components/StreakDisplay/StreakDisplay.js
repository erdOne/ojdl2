import { PureComponent } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Card, CardContent, Grid, Typography, Avatar } from "@material-ui/core";
import {
  Whatshot as WhatshotIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon } from "@material-ui/icons";

const styles = theme => ({
  root: {
    height: "100%"
  },
  content: {
    alignItems: "center",
    display: "flex"
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center"
  },
  differenceIcon: {
    color: theme.palette.error.dark
  },
  differenceValue: {
    color: theme.palette.error.dark,
    marginRight: theme.spacing(1)
  }
});

class StreakDisplay extends PureComponent {
static propTypes= {
  streak: PropTypes.number,
  className: PropTypes.string,
  classes: PropTypes.object
}

render() {
  const { className, classes, streak, ...rest } = this.props;
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
              variant="body2"
            >
              Streak
            </Typography>
            <Typography variant="h3">{streak}</Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <WhatshotIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <Typography
            className={classes.caption}
            variant="caption"
          >
            Keep it up!
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}
}


export default withStyles(styles)(StreakDisplay);
