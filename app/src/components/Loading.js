import React from 'react';

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
	root: {
		position: "fixed",
		zIndex: 5,
		top: 0,
		left: 0,
		margin: 0,
		width: "100vw",
		height: "100vh",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		// backgroundColor: "rgba(0, 0, 0, 0.5)",
	}
}));

const Loading = props => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<CircularProgress />
		</div>
	);
};


export default Loading;

