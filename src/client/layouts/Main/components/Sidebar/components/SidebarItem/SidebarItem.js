import React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

export default function SideBarItem({ href, onClick, icon, title }) {
  var inputProps = { key: title };
  if (href)
    inputProps.component = React.useMemo(
      () =>
        React.forwardRef((itemProps, ref) => (
          <RouterLink to={href} {...itemProps} ref={ref} />
        )),
      [href],
    );

  if (onClick)
    inputProps.onClick = onClick;

  return (
    <ListItem button {...inputProps} >
      {icon ?
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        : null}
      <ListItemText primary={title} />
    </ListItem>
  );
}

SideBarItem.propTypes = {
  href: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  title: PropTypes.string.isRequired
};
