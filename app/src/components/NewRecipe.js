import React, { useState } from 'react';
import CreateRecipe from '../pages/CreateRecipe';

import { useSelector } from "react-redux";

import { useParams } from 'react-router-dom';

const initialState = {
	image:
		"https://firebasestorage.googleapis.com/v0/b/vegania-73005.appspot.com/o/Caponatarostadgronsakspasta.jpg?alt=media&token=d129426f-aa17-461f-983b-5c00e5b05841",
	ingredients: {
		salt: [""],
	},
	servings: 4,
	time: 40,
	description: "Detta är en kort beskrivning av mitt recept.",
	instructions: null,
	title: "",
	_tags: ["Middag"],
};

const NewRecipe = () => {
	const { recipeId } = useParams();
	const recipe = useSelector(state => recipeId && state.firestore.data.recipes && state.firestore.data.recipes[recipeId]);
	// if (recipe) recipe.instructions = null;

	// console.log("NEW RECIPE", recipeId, recipe);


	const getSavedData = () => {
		try {
			const content = window.localStorage.getItem('content');

			if (content) {
				const storedObject = JSON.parse(content);
				const newObject = { ...initialState, ...storedObject };
				// console.log("NO", storedObject);
				return newObject;
			}
			return initialState;
		} catch (error) {
			return initialState;
		}
	};

	const [persistedState] = useState(() => recipe || getSavedData());

	return <CreateRecipe initialRecipe={persistedState} />;
};

export default NewRecipe;
