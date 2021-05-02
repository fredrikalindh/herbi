import React from 'react';
import PropTypes from 'prop-types';

import { useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";

import { makeStyles } from '@material-ui/core/styles';

import Rating from '@material-ui/lab/Rating';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: "15px 30px",
	},
}));

const Review = ({ review, id, recipeId }) => {
	const classes = useStyles();

	const firestore = useFirestore();

	const { uid } = useSelector(state => state.firebase.auth);

	const deleteReview = async () => {
		try {
			await firestore.doc(`recipes/${recipeId}/reviews/${id}`).delete();
		} catch (error) {
			console.log(error);
		}
	};

	const editReview = () => {
		const button = document.getElementById("leave-review-button");
		if (button) button.click();
	};

	return (
		<Card className={classes.root} variant="outlined">
			<CardHeader
				avatar={<Avatar src={review.userImage} alt={review.displayName} />}
				title={review.displayName}
				titleTypographyProps={{ align: "left", variant: "h6" }}
				action={<Rating style={{ marginTop: 15 }} value={review.rating} readOnly />}
			/>
			<CardContent style={{ textAlign: 'left' }}>
				<Typography variant="body1" color="primary">
					{review.text}
				</Typography>
			</CardContent>
			{uid === review.uid &&
				<CardActions>
					<Tooltip title="Ta bort kommentar">
						<IconButton onClick={deleteReview}>
							<DeleteIcon color="primary" />
						</IconButton>
					</Tooltip>
					<Tooltip title="Ändra kommentar">
						<IconButton onClick={editReview}>
							<EditIcon color="primary" />
						</IconButton>
					</Tooltip>
				</CardActions>
			}
		</Card>
	);
};

Review.propTypes = {
	review: PropTypes.object.isRequired
};

export default Review;


