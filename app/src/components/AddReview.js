import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Button from "@material-ui/core/Button";

import TextField from '@material-ui/core/TextField';
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';

import { useFirestore } from "react-redux-firebase";
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
	root: {
		textAlign: "left",
		margin: "30px 15px",
		display: 'flex',
		flexDirection: 'column',
		'& > * + *': {
			marginTop: theme.spacing(1),
		},
		// "& .MuiTextField-root": {
		// 	margin: "20px 0px"
		// }
	},
	// iconFilled: {
	// 	color: '#ff6d75',
	// },
	// iconHover: {
	// 	color: '#ff3d47',
	// },
}));

const AddReview = ({ recipeId }) => {
	const classes = useStyles();
	const firestore = useFirestore();
	const history = useHistory();

	const [clicked, setClicked] = useState(false);
	const id = useRef(null);
	const [rating, setRating] = useState(null);
	const [text, setText] = useState("");

	const { displayName, avatarUrl, uid } = useSelector(state => ({ ...state.firebase.profile, uid: state.firebase.auth.uid }));

	useEffect(() => {
		firestore.collection(`recipes/${recipeId}/reviews`)
			.where("uid", '==', uid).limit(1).get()
			.then((reviews) => {
				if (!reviews.empty) {
					const review = reviews.docs[0].data();
					// setId(reviews.docs[0].id);
					id.current = reviews.docs[0].id;
					setRating(review.rating);
					setText(review.text);
				}
			}).catch(err => console.log(err));
	}, [clicked, firestore, recipeId, uid]);



	// const [error, setError] = useState(false);

	const handleClick = () => {
		// setError(false);
		if (!uid) return history.push('/signin');
		if (rating) {
			if (id.current) {
				console.log("ID", id);
				console.log("UID", uid);

				firestore.doc(`recipes/${recipeId}/reviews/${id.current}`)
					.update({ rating, text })
					.then(_ => {
						setClicked(false);
						setRating(null);
						setText("");
						// setId(null);
						id.current = null;
					});
			} else {
				const newReview = { rating, text, displayName, userImage: avatarUrl, uid };
				console.log("NEW REVIEW", newReview);

				firestore.collection(`recipes/${recipeId}/reviews`)
					.add(newReview)
					.then(_ => {
						setClicked(false);
						setRating(null);
						setText("");
						// setId(null);
					});
			}
		} else {
			// setError(true);
		}
	};
	if (!clicked) {
		return <Button id="leave-review-button" onClick={_ => setClicked(true)}>Leave a review</Button>;
	}

	return (
		<div className={classes.root}>
			<h3>Leave a review</h3>
			<Rating
				name="simple-controlled"
				value={rating}
				onChange={(_, newValue) => {
					setRating(newValue);
				}}
			/>
			{/* {error && <span>Rating cannot be empty</span>} */}
			<TextField
				multiline
				rowsMax={8}
				name="text"
				value={text}
				onChange={({ target }) => setText(target.value)}
				label="Vad tyckte du om receptet?"
			/>
			<Button variant="contained" onClick={handleClick}>Submit</Button>
		</div>
	);
};

AddReview.propTypes = {
	recipeId: PropTypes.string.isRequired
};

export default AddReview;


