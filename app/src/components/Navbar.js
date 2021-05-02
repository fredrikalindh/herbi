import React, { useState } from "react";
// import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";

import { useSelector } from "react-redux";
// import { useFirestore, useFirebase } from "react-redux-firebase";

import Button from '@material-ui/core/Button';
import Dropdown from "./Dropdown";
// import "./Navbar.scss";
import Signin from './Signin';

import { makeStyles } from "@material-ui/core/styles";

import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  navbar: {
    zIndex: 10,
    width: "100vw",
    height: "5rem",
    // padding: 30px 50px 10px 50px,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1.2rem",
    position: "fixed",
    padding: 30,

    // backgroundColor: theme.palette.primary.contrastText,
    "& .navbar-logo": {
      // padding: "30px 50px 20px 50px",
      textDecoration: "none",
      fontSize: "1.5rem",
      color: theme.palette.primary.main,
      fontFamily: "Bodoni Moda"
    },
  }
}));

const Navbar = () => {
  const classes = useStyles();

  const { uid } = useSelector(state => state.firebase.auth);

  const [click, setClick] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = () => { if (window.innerWidth <= 600) setClick(!click); };
  const openLogin = () => setOpen(true);


  const onMouseEnter = () => {
    if (window.innerWidth > 600) setDropdown(true);
    else setClick(true);
  };

  const onMouseLeave = () => {
    setDropdown(false);
    setClick(false);
  };


  if (!uid) {
    return (
      <nav className={classes.navbar}>
        <Link to={ROUTES.LANDING} className="navbar-logo">
          herbi
        </Link>
        <Button id="signin-button" onClick={openLogin} color="primary" variant="contained">Logga In</Button>
        <Signin open={open} onClose={() => setOpen(false)} />
      </nav>
    );
  }

  return (
    <nav className={classes.navbar}>
      <Link to={ROUTES.RECIPES} className="navbar-logo">
        herbi
      </Link>
      <div
        className="menu"
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {!click ? <MenuIcon /> : <CloseIcon />}
        {(dropdown || click) && <Dropdown click={click} />}
      </div>
    </nav>
  );
};

// Navbar.propTypes = {
//   user: PropTypes.object.isRequired,
// };

export default Navbar;
