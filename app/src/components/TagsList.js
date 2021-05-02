import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const TagsList = ({ tags, handleDelete }) => {
  const classes = useStyles();

  return (
    <div component="ul" className={classes.root}>
      {tags.map((data, index) => (
        <li key={index}>
          <Chip
            label={data}
            onDelete={handleDelete(data)}
            className={classes.chip}
          />
        </li>
      ))}
    </div>
  );
};

export default TagsList;
