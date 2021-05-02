import React, { useState } from "react";
import PropTypes from "prop-types";

import { useFirebase } from "react-redux-firebase";
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ToolTip from '@material-ui/core/ToolTip';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
// import Snackbar from '@material-ui/core/Snackbar';
// import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

  },
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: "none",
    flexDirection: "column",
    maxWidth: "90vw",
    padding: "4rem 4rem 1rem 4rem",
    "& button": {
      margin: "20px 0px"
    }
  },
}));

const SignIn = ({ open, onClose }) => {
  const classes = useStyles();
  const firebase = useFirebase();
  // const firestore = useFirestore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [signUp, setSignUp] = useState(false);

  const [errors, setErrors] = useState(false);

  const [retries, setRetries] = useState(0);

  const signInWithGoogle = () => {
    setErrors(false);
    firebase
      .login({
        provider: "google",
        type: "popup",
      })
      .then(() => {
        onClose();
      }).catch((err) => {
        // setOpen(true)
        setErrors(true);
        console.log(err);

      });
  };
  const signInWithEmail = () => {
    setErrors({});
    firebase.login({
      email,
      password
    })
      .then(() => {
        onClose();
      }).catch((err) => {
        setRetries(prev => prev + 1);
        console.log(err);

        setErrors({ email: err.message });
      });
  };
  const signUpUser = () => {
    if (password !== repeatPassword) {
      setErrors({ repeatPassword: "Not matching" });
      return;
    }
    setErrors({});


    firebase.createUser(
      { email, password },
      { displayName, email }
    ).then(() => {
      onClose();
    }).catch((err) => {
      if (err.code === "auth/email-already-in-use")
        setErrors({ email: err.message });
      else if (err.code.startsWith("auth"))
        setErrors({ password: err.message });
      else
        setErrors({ displayName: err.message });
    });
  };

  const resetPassword = () => {
    if (window.confirm(`Are you sure you want to send a password reset link to ${email}?`))
      firebase.resetPassword(email);
  };


  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={onClose}
      disableAutoFocus
    >
      <Paper className={classes.root}>
        <h1>Welcome</h1>
        <TextField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          error={errors.email}
          helperText={errors.email}
          fullWidth
        />
        <TextField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          error={errors.password}
          helperText={errors.password}
          fullWidth
        />
        {signUp &&
          <>
            <TextField
              id="repeat-password"
              label="Repeat Password"
              type="password"
              value={repeatPassword}
              onChange={({ target }) => setRepeatPassword(target.value)}
              fullWidth
            />
            <TextField id="displayName"
              label="Username"
              // type="text"
              value={displayName}
              onChange={({ target }) => setDisplayName(target.value)}
              error={!!errors.displayName}
              helperText={errors.displayName}
              fullWidth
            />
          </>
        }

        {retries >= 2 && <p>Trouble signing in? <span style={{ color: "blue", cursor: "pointer" }} onClick={resetPassword}>Reset password</span></p>}
        <Button
          variant="contained"
          onClick={(event) => {
            event.preventDefault();
            if (signUp) signUpUser();
            else signInWithEmail();
          }}
        >
          {signUp ? "Sign Up" : "Sign In"}
        </Button>
        <p onClick={() => setSignUp(!signUp)}>{signUp ? "Already have an account? Sign in" : "Don't have an account yet? Sign up"}</p>
        <ToolTip title="Continue with Google">
          <IconButton
            style={{ width: 50 }}
            onClick={(event) => {
              event.preventDefault();
              signInWithGoogle();
            }}
          >

            <img width="22" alt="Google &quot;G&quot; Logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />

          </IconButton>
        </ToolTip>
        {/* <Button
        onClick={(event) => {
          event.preventDefault();
          signInWithGoogle();
        }}
      >
        Continue with Google
      </Button> */}

        {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          Wrong credentials, please try again
        </Alert>
      </Snackbar> */}
      </Paper>
    </Modal>
  );
};


SignIn.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};


export default SignIn;
