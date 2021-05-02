import React, { useState, useEffect } from "react";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import CheckIcon from "@material-ui/icons/Check";

import Button from '@material-ui/core/Button';
import ChangePasswordModal from "../components/ChangePasswordModal";

import { useFirebase } from "react-redux-firebase";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 450,
    maxWidth: "90%",
    marginBottom: "auto",
    // display: "flex",
    // justifyContent: "space-between",
    // [theme.breakpoints.down('xs')]: {
    //   flexDirection: "column",
    //   justifyContent: "center",
    //   alignItems: "center"
    // }
  },
  imageInput: {
    margin: 20,
    "& .avatar": {
      width: theme.spacing(15),
      height: theme.spacing(15),
    },
    "&:hover": {
      cursor: "pointer",
      "& svg": {
        filter: "opacity(100%)",
      },
      "& .avatar": {
        filter: "brightness(0.4)",
      }
    }
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    margin: 20,
    width: 200,
  }
}));

export default function Settings() {
  const classes = useStyles();

  const firebase = useFirebase();

  const { uid, avatarUrl, displayName } = useSelector(({ firebase: { auth, profile } }) => ({ avatarUrl: profile.avatarUrl, displayName: profile.displayName, uid: auth.uid }));

  const [userHasPassword] = useState(firebase.auth().currentUser.providerData.some(provider => provider.providerId === "password"));

  const [username, setUsername] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUsername(displayName);
  }, [displayName]);

  const handleChange = ({ target }) => {
    // console.log(target.name);
    if (target.name === "username") {
      setUsername(target.value);
    } else {
    }
  };

  const handleImageChange = async ({ target }) => {
    if (!target.files[0]) return null;
    const storageRef = firebase.storage().ref(`avatars/${uid}`);
    try {
      const snapshot = await storageRef.put(target.files[0]);

      const imageUrl = await snapshot.ref.getDownloadURL();

      await firebase.updateProfile({ avatarUrl: imageUrl });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() !== "" && username !== displayName) {
      try {
        await firebase.updateProfile({ displayName: username.trim() });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4" color="primary" gutterBottom>Uppdatera Kontot</Typography>

      <div className={classes.form}>
        <div className={classes.imageInput} onClick={() => document.getElementById("imageInput").click()}>
          <Avatar src={avatarUrl} alt={displayName} className="avatar" />
          {/* <Avatar src={avatarUrl} alt={displayName} /> */}
          <input
            type="file"
            id="imageInput"
            onChange={handleImageChange}
            accept="image/*"
            hidden="hidden"
          />
        </div>
        <div>
          <TextField name="username" label="username" value={username} onChange={handleChange} />
          <Tooltip title="Save username">
            <IconButton onClick={handleSubmit} color="primary">
              <CheckIcon />
            </IconButton>
          </Tooltip>
        </div>
        {userHasPassword && <>
          <Button onClick={() => setOpen(true)} variant="contained" className={classes.button}>
            Update Password
        </Button>
          <ChangePasswordModal open={open} setOpen={setOpen} />
        </>}
      </div>
    </div>
  );
}
