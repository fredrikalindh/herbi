import React from "react";
import { useHistory } from 'react-router-dom';
// import "./RecipeLink.scss";

import { makeStyles } from "@material-ui/core/styles";
// import Button from "./Button";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  card: {
    textAlign: "left",
    width: "100%"
  },
  media: {
    height: 300,
  },
  content: {
    minHeight: 170,
    position: "relative",
  },
  recipeInfo: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    display: "grid",
    textAlign: "center",
    gridTemplateColumns: "1fr 2px 2fr 2px 1fr",
  },
}));

const RecipeLink = (props) => {
  const recipe = props.hit;
  const history = useHistory();
  const classes = useStyles();
  const path = `/${recipe.id}`;

  const handleClick = () => {
    history.push(path);
    // document.location.href = path;
  };
  return (
    <Card className={classes.card}>
      <CardActionArea onClick={handleClick}>
        <CardMedia
          className={classes.media}
          image={recipe.image}
          title={recipe.title}
        ></CardMedia>
        <CardContent className={classes.content}>
          <Typography variant="h5" color="secondary" className={classes.title}>{recipe.title}</Typography>
          <div className={classes.recipeInfo}>
            <Typography>{parseFloat(recipe.averageRating.toFixed(1))}/5</Typography>
            <Typography>|</Typography>
            <Typography>{recipe.servings} portioner</Typography>
            <Typography>|</Typography>
            <Typography>{recipe.time}'</Typography>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeLink;
// export default withStyles(styles)(Recipe);
