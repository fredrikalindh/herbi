import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { useSelector } from "react-redux";

const AuthRoute = ({ children, ...remainingProps }) => {
	const auth = useSelector(state => state.firebase.auth);

	return (
		<Route {...remainingProps} >
			{isLoaded(auth) && !isEmpty(auth) ? children : <Redirect to="/" />}
		</Route>

	);
};
export default AuthRoute;

