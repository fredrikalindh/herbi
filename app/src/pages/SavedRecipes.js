import React from "react";
import RecipeLink from "../components/RecipeLink";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import { useFirestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import Grid from "@material-ui/core/Grid";

function SavedRecipes() {
  // const classes = useStyles();
  const { uid } = useSelector((state) => state.firebase.auth);

  useFirestoreConnect(() => [
    {
      collection: 'recipes',
      where: ['savedByUsers', "array-contains", uid || ""],
      storeAs: "savedRecipes",
    },
    {
      collection: 'recipes',
      where: ['uid', "==", uid || ""],
      storeAs: "myRecipes",
    },
  ]);

  const { savedRecipes, myRecipes } = useSelector((state) => state.firestore.data);

  if (!isLoaded(savedRecipes) || !isLoaded(myRecipes)) {
    return <Loading />;
  } if (isEmpty(savedRecipes) && isEmpty(myRecipes)) {
    return <h3>Inga recept</h3>;
  }

  const allRecipes = { ...savedRecipes, ...myRecipes };

  return (
    <Grid container spacing={2} className="recipes">
      {
        Object.keys(allRecipes).map((key) => (
          <Grid item xs={12} sm={6} md={4}>
            <RecipeLink
              key={key}
              hit={{ ...allRecipes[key], id: key }}
            />
          </Grid>
        ))
      }
    </Grid>
  );
}

// SavedRecipes.propTypes = {
//   savedRecipes: PropTypes.object.isRequired,
// };




export default SavedRecipes;
