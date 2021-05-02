import React, { useState } from "react";
// import PropTypes from "prop-types";
import { useParams, useHistory } from 'react-router-dom';

import Loading from "../components/Loading";
import UserInfo from "../components/UserInfo";
import { IngredientList } from "../components/IngredientList";
import Review from "../components/Review";
import AddReview from "../components/AddReview";


import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import SavedIcon from "@material-ui/icons/Bookmark";
import UnsavedIcon from "@material-ui/icons/BookmarkBorder";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import { Editor, EditorState, convertFromRaw } from 'draft-js';

import { useFirestoreConnect, useFirestore, useFirebase } from 'react-redux-firebase';

import { useSelector } from "react-redux";

import "./Recipe.scss";

function Recipe() {
  const firestore = useFirestore();
  const firebase = useFirebase();
  const saveRecipe = firebase.functions().httpsCallable('saveRecipe');
  const unsaveRecipe = firebase.functions().httpsCallable('unsaveRecipe');

  const { recipeId } = useParams();

  const history = useHistory();

  const [showInstructions, setShowInstructions] = useState(false);
  const [saved, setSaved] = useState(null);

  useFirestoreConnect(() => [
    { collection: 'recipes', doc: recipeId }, // or `todos/${props.todoId}`
    { collection: 'recipes', doc: recipeId, subcollections: [{ collection: "reviews" }], storeAs: "reviews" } // or `todos/${props.todoId}`
  ]);

  const { recipe, reviews, uid } = useSelector(
    (state) => ({
      recipe: state.firestore.data.recipes && state.firestore.data.recipes[recipeId],
      reviews: state.firestore.data.reviews,
      uid: state.firebase.auth.uid
    })
  );

  if (recipe && uid && saved === null)
    setSaved(recipe.savedByUsers && recipe.savedByUsers.includes(uid));

  const toggleSave = async () => {
    try {
      if (!uid) {
        document.getElementById("signin-button").click();
      }
      else if (!saved) { // todo -> httpsCallable
        setSaved(true);
        await saveRecipe(recipeId);
        // return firestore.update(`recipes/${recipeId}`, { savedByUsers: [...recipe.savedByUsers, uid] });
      } else {
        setSaved(false);
        await unsaveRecipe(recipeId);
        // return firestore.update(`recipes/${recipeId}`, { savedByUsers: recipe.savedByUsers.filter(userId => userId !== uid) });
      }
    } catch (error) {
      setSaved(!saved);
      console.log(error);
    }

  };

  const deleteRecipe = () => {
    if (window.confirm("Are you sure you want to delete this recipe?"))
      firestore.doc(`recipes/${recipeId}`).delete()
        .then(() => history.push('/recipes')).catch(err => console.log(err));
  };

  if (!recipe) {
    return <Loading />;
  }

  const editorState = EditorState.createWithContent(convertFromRaw(recipe.instructions));

  return (
    <div className="recipe">
      <img className="recipe-image" src={recipe.image} alt={recipe.title} />
      <div className="info">
        <Typography variant="h3" color="secondary" gutterBottom>{recipe.title}</Typography>
        <div className="author-info">
          <UserInfo name={recipe.userHandle} image={recipe.userImage} />
          {/* <Rating
            id="star-rating"
            name="rating"
            defaultValue={recipe.averageRating}
            precision={0.5}
            onChange={setRating}
          /> */}
          {recipe.createdAt && (
            <Typography>
              {new Date(recipe.createdAt).toISOString().split("T")[0]}
            </Typography>
          )}
          <div>
            {uid && recipe.uid === uid && (
              <>
                <Tooltip title="Ta Bort Receptet">
                  <IconButton onClick={deleteRecipe}>
                    <DeleteIcon color="primary" fontSize="inherit" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ändra Receptet">
                  <IconButton onClick={() => history.push(`${recipeId}/edit`)}>
                    <EditIcon color="primary" fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <Tooltip title={saved ? "Save" : "Unsave"}>
              <IconButton onClick={toggleSave}>
                {saved ?
                  <SavedIcon color="primary" fontSize="inherit" />
                  :
                  <UnsavedIcon color="primary" fontSize="inherit" />
                }
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <Typography id="short-description">{recipe.description}</Typography>
        <div id="recipe-info">
          <Typography>{parseFloat(recipe.averageRating.toFixed(1))}/5 ({recipe.reviewCount} ratings)</Typography>
          <hr className="vertical-line" />
          <Typography>{recipe.servings} portioner</Typography>
          <hr className="vertical-line" />
          <Typography>{recipe.time}'</Typography>
          {/* <span>{`${recipe.reviewCount} ratings`}</span> */}
        </div>

        <div id="ingredients">
          <Typography variant="h5" color="secondary" gutterBottom>Ingredienser</Typography>
          <IngredientList ingredients={recipe.ingredients} deletable={false} />
        </div>
        {showInstructions ?
          (<div id="instructions">
            <Typography variant="h5" color="secondary" gutterBottom>Instruktioner</Typography>
            {/* <ol id="instructions-list">{recipe.instructions.blocks.map(i => (<li key={i.key}>{i.text}</li>))}</ol> */}
            <Editor
              editorState={editorState}
              readOnly="true"
            />
          </div>) : <Button id="show-button" onClick={() => setShowInstructions(true)} color="primary" variant="contained">Visa instruktioner</Button>
        }


      </div>
      <div className="reviews">
        {reviews && Object.keys(reviews).map(key => reviews[key].text ? <Review key={key} review={reviews[key]} recipeId={recipeId} id={key} /> : null)}
      </div>
      {uid && <AddReview recipeId={recipeId} />}
    </div>
  );
}

// Recipe.propTypes = {
// };

export default Recipe;;
