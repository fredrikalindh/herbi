import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { makeStyles } from "@material-ui/core/styles";

import { useFirebase } from "react-redux-firebase";
// import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
		"& .paper": {
			outline: "none",
			textAlign: "left",
			width: 400,
			height: 400,
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			flexDirection: "column",
			"& h2": {
				marginBottom: 20
			},
			"& div": {
				marginBottom: 10,
				width: 250
			},
		}
	}
}));

const ChangePasswordModal = ({ open, setOpen }) => {
	const classes = useStyles();

	const firebase = useFirebase();

	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");

	const [errors, setErrors] = useState({});

	const handleSubmit = async () => {
		setErrors({});
		if (newPassword !== repeatPassword) {
			setErrors({ repeatPassword: "Password not matching" });
		} else if (newPassword === "") {
			setErrors({ newPassword: "Can't be blank" });
		}
		else {
			const user = firebase.auth().currentUser;
			console.log("USER", user, user.email, password);
			const credential = firebase.auth.EmailAuthProvider.credential(
				user.email,
				password
			);
			try {
				await user.reauthenticateWithCredential(credential);

				await user.updatePassword(newPassword);

				handleClose();
			} catch (error) {
				if (error.code === 'auth/wrong-password')
					setErrors({ oldPassword: error.message });
				else
					setErrors({ newPassword: error.message });
			}
		}

	};

	const handleChange = ({ target }) => {
		if (target.name === "old-password") {
			setPassword(target.value);
		} else if (target.name === "new-password") {
			setNewPassword(target.value);
		} else {
			setRepeatPassword(target.value);
		}
	};

	const handleClose = () => {
		setErrors({});
		setPassword("");
		setNewPassword("");
		setRepeatPassword("");

		setOpen(false);
	};

	return (
		<Modal
			className={classes.modal}
			open={open}
			onClose={handleClose}
			disableAutoFocus={true}
		>
			<Paper className="paper">
				<h2>Change Password</h2>
				<TextField
					name="old-password"
					type="password"
					label="Old Password"
					value={password}
					onChange={handleChange}
					error={!!errors.oldPassword}
					helperText={errors.oldPassword}
				/>
				<TextField
					name="new-password"
					type="password"
					label="New Password"
					value={newPassword}
					onChange={handleChange}
					error={!!errors.newPassword}
					helperText={errors.newPassword}
				/>
				<TextField
					name="repeat-password"
					type="password"
					label="Repeat Password"
					value={repeatPassword}
					onChange={handleChange}
					error={!!errors.repeatPassword}
					helperText={errors.repeatPassword}
				/>
				<Button onClick={handleSubmit} variant="contained">Save</Button>
			</Paper>
		</Modal>
	);
};

export default ChangePasswordModal;
