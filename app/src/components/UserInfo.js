import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Avatar from "@material-ui/core/Avatar";

const styles = (theme) => ({
  userInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    "& span": {
      paddingLeft: 20,
    },
  },
});

const UserInfo = ({ name, image, classes }) => {
  return (
    <div className={classes.userInfo}>
      <Avatar src={image} />
      <span>{name}</span>
    </div>
  );
};

export default withStyles(styles)(UserInfo);
