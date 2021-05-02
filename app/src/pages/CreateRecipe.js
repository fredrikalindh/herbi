import React, { useState, useEffect, useRef } from "react";

import PropTypes from "prop-types";
import ContentEditable from "react-contenteditable";


import CircularProgress from '@material-ui/core/CircularProgress';
import Loading from "../components/Loading";
import { IngredientList } from "../components/IngredientList";
import { IngredientInput } from "../components/IngredientInput";
import TagsList from "../components/TagsList";

import AddImageIcon from "@material-ui/icons/Queue";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
// import Tooltip from "@material-ui/core/Tooltip";
// import IconButton from "@material-ui/core/IconButton";
import "./Recipe.scss";

import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

import { useFirebase } from "react-redux-firebase";
import { useHistory, useParams } from 'react-router-dom';

const fallbackImage = 'https://firebasestorage.googleapis.com/v0/b/vegania-73005.appspot.com/o/Caponatarostadgronsakspasta.jpg?alt=media&token=d129426f-aa17-461f-983b-5c00e5b05841';

function getCurrentBlock(editorState) {
  const currentSelection = editorState.getSelection();
  const blockKey = currentSelection.getStartKey();
  return (editorState.getCurrentContent().getBlockForKey(blockKey));
}

const Recipe = ({ initialRecipe }) => {
  let { recipeId } = useParams();
  const history = useHistory();
  const firebase = useFirebase();

  const [title, setTitle] = useState(initialRecipe.title);
  const [description, setDescription] = useState(initialRecipe.description);
  const [image, setImage] = useState(initialRecipe.image);
  const [servings, setServings] = useState(initialRecipe.servings);
  const [time, setTime] = useState(initialRecipe.time);
  const [ingredients, setIngredients] = useState(initialRecipe.ingredients);
  const [_tags, setTags] = useState(initialRecipe._tags || []);
  const [tag, setTag] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(null);

  const [errors, setErrors] = useState({});

  const titleRef = useRef();
  const descRef = useRef();

  useEffect(() => {
    const imageHTML = document.getElementById('recipe-image');
    imageHTML.onerror = () => {
      setImage(fallbackImage);
    };

    const timeout = setTimeout(() => {
      if (recipeId) return;

      const instructions = convertToRaw(editorState.getCurrentContent());
      const recipe = {
        title,
        ingredients,
        instructions,
        servings,
        time,
        description,
        image,
        _tags,
      };
      console.log("PERSISTING", recipe);

      window.localStorage.setItem('content', JSON.stringify(recipe));
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  });

  const addIngredient = (ingredient, quantity) => {
    setIngredients((prev) => ({ ...prev, [ingredient]: quantity }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    const errors = {};
    if (description === 'Detta är en kort beskrivning av mitt recept.') setDescription('');
    if (!title) errors["title"] = "Cannot be empty";
    // if (image === fallbackImage && !recipeId) errors["image"] = "Cannot be empty";
    if (!servings) errors["servings"] = "Cannot be empty";
    if (!time) errors["time"] = "Cannot be empty";
    if (Object.keys(ingredients).length === 0)
      errors["ingredients"] = "Cannot be empty";

    // Getting the instructions from the draft
    const instructions = convertToRaw(editorState.getCurrentContent());

    // todo: display errors
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      const recipe = {
        title,
        ingredients,
        instructions,
        servings,
        time,
        description,
        image: image.startsWith("blob") ? fallbackImage : image,
        _tags,
        _ingredients: Object.keys(ingredients).map(key => key)
      };
      console.log(JSON.stringify(recipe));
      // console.log("FILE ", imageFile);
      try {
        const functionName = recipeId ? 'updateRecipe' : 'addRecipe';

        const recipeSave = firebase.functions().httpsCallable(functionName);

        if (recipeId) recipe['id'] = recipeId;

        const recipeDoc = await recipeSave(recipe);

        if (!recipeId) {
          recipeId = recipeDoc.data._path.segments[1];
          console.log("clear");
          window.localStorage.clear();
          window.localStorage.removeItem('content');
        }
        history.push(`/recipes/${recipeId}`);
        setLoading(false);
      } catch (error) {
        console.log("Something went wrong.", error);
        setLoading(false);
      }

    } else {
      // todo: alert with error
      console.log("ERROR", errors);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.currentTarget.id === "title" && e.key !== "Enter") {
      setTitle(e.target.value.split('\n')[0]);
    } else if (e.currentTarget.id === "servings") {
      setServings(e.target.value);
    } else if (e.currentTarget.id === "time") {
      setTime(e.target.value);
    } else if (e.currentTarget.id === "tags") {
      setTag(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    setLoadingImage(0);
    setImage(URL.createObjectURL(file));

    console.log(image);


    const storageRef = firebase.storage().ref(`images/${file.name}`);
    // Attach the put method to the storageRef
    storageRef.put(file).on(
      "state_changed",
      (snapshot) => {
        let percentage = Number(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("PERC", percentage);

        setLoadingImage(percentage);
      },
      (error) => {
        console.log("error", error.code);
        setLoadingImage(null);
      },
      () => {
        // Once upload is complete make a second request to get the download URL
        storageRef
          .put(file)
          .snapshot.ref.getDownloadURL()
          .then((url) => {
            // We now have the uploaded url
            console.log(url);
            // Every time we upload a image we also need to add a reference to the database
            setImage(url);
            // reset the progress bar to zero percent after one second
            setTimeout(() => {
              setLoadingImage(null);
            }, 1000);
          });
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (e.target.id === "title") {
        if (description === initialRecipe.description) setDescription("");
        descRef.current.focus();
      }
    }
  };

  const handleEditPicture = () => {
    document.getElementById("imageInput").click();
  };

  const handleTagSubmit = (e) => {
    if (e.key === "Enter" && tag.trim() !== '') {
      setTags((tags) => [...tags, tag.trim()]);
      setTag('');
    }
  };

  const isReadyToPublish = () => title && loadingImage === null;// && image !== fallbackImage;

  const handleDeleteTag = (tagToDelete) => () => {
    setTags((tags) => tags.filter((tag) => tag !== tagToDelete));
  };

  const handleDeleteIngredient = (ingredientToDelete) => () => {
    setIngredients((prevIngredients) => {
      const ingredients = { ...prevIngredients };
      delete ingredients[ingredientToDelete];
      return ingredients;
    });
  };

  const [editorState, setEditorState] = useState(
    () => {
      if (initialRecipe.instructions) {
        return EditorState.createWithContent(convertFromRaw(initialRecipe.instructions));
      } else {
        return EditorState.createEmpty();
      }

    },
  );

  useEffect(() => {
    if (getCurrentBlock(editorState).toObject().type !== "ordered-list-item")
      setEditorState(RichUtils.toggleBlockType(editorState, "ordered-list-item"));
  }, [editorState]);

  return (
    <div className="recipe">
      {loading && <Loading />}
      <div className="image" onClick={handleEditPicture}>
        {loadingImage === null ? <AddImageIcon /> : <div className="loading-image"><CircularProgress variant="determinate" value={loadingImage} /></div>}

        <img id='recipe-image' src={image} alt={title} />
        <input
          type="file"
          id="imageInput"
          onChange={handleImageChange}
          accept="image/*"
          hidden="hidden"
        />
      </div>
      <div className="info">
        <ContentEditable
          id="title"
          innerRef={titleRef}
          html={title} // innerHTML of the editable div
          disabled={false} // use true to disable editing
          onChange={handleChange} // handle innerHTML change
          onKeyDown={handleKeyDown}
          tagName="h1" // Use a custom HTML tag (uses a div by default)
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text/plain");
            document.execCommand("insertText", false, text);
          }}
        />
        <ContentEditable
          id="short-description"
          innerRef={descRef}
          html={description}
          disabled={false}
          onChange={handleChange}
          tagName="p"
          onPaste={(e) => {
            e.preventDefault();
            const text = e.clipboardData.getData("text");
            document.execCommand("insertText", false, text);
          }}
        />

        {_tags && <TagsList tags={_tags} handleDelete={handleDeleteTag} />}

        <div id="recipe-info">
          <TextField
            type="number"
            label="Portioner"
            id="servings"
            onChange={handleChange}
            value={servings}
            error={!!errors.servings}
            helperText={errors.servings}
          />
          <hr className="vertical-line" />
          <TextField
            type="number"
            label="Tillagningstid"
            id="time"
            onChange={handleChange}
            value={time}
            error={!!errors.time}
            helperText={errors.time}
          />
          <hr className="vertical-line" />
          <TextField
            label="Lägg till tags"
            id="tags"
            value={tag}
            onChange={handleChange}
            placeholder="ex: 'Italian'"
            onKeyDown={handleTagSubmit}
          />
        </div>

        <div id="ingredients">
          {ingredients && (<IngredientList
            ingredients={ingredients}
            handleDelete={handleDeleteIngredient}
          />)}
          <IngredientInput addIngredient={addIngredient} />
        </div>
        <div id="instructions">
          <Editor
            id="instructions"
            editorState={editorState}
            onChange={setEditorState}
            placeholder="	Börja med att hacka..."
          />
        </div>
        <div className="buttons">
          {recipeId &&
            <Button onClick={() => history.goBack()} variant="contained">
              Tillbaka
        </Button>}
          <Button onClick={handleSubmit} disabled={!isReadyToPublish()} color="primary" variant="contained">
            Publicera
        </Button>
        </div>
      </div>
    </div>
  );
};

Recipe.propTypes = {
  initialRecipe: PropTypes.object.isRequired,
};


export default Recipe;
