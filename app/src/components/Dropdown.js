import React from "react";
import { Link } from "react-router-dom";
// import "./Dropdown.scss";

import * as ROUTES from "../constants/routes";

//Redux
import { useFirebase } from "react-redux-firebase";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  dropdown: {
    padding: 5,
    // padding: props => props.click ? 40 : 5,
    borderRadius: 10,
    width: 200,
    height: "auto",
    // width: props => props.click ? "100vw" : 200,
    // height: props => props.click ? "100vh" : "auto",
    position: "absolute",
    // top: 50,
    right: 30,
    // right: props => props.click ? 0 : 30,
    listStyle: "none",
    textAlign: "start",
    backgroundColor: theme.palette.primary.contrastText,
    [theme.breakpoints.down('xs')]: {
      padding: 40,
      width: "100vw",
      height: "100vh",
      right: 0,
    }
  },
  link: {
    display: "block",
    width: '100%',
    height: '100%',
    textDecoration: "none",
    padding: 10,
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.main,

    "&:hover": {
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    [theme.breakpoints.down('xs')]: {
      padding: "30px 20px",
      fontSize: 30
    }
  },

}));

const menuItems = [
  {
    title: "Nytt recept",
    path: ROUTES.CREATE_RECIPE,
  },
  {
    title: "Mina Recept",
    path: ROUTES.SAVED_RECIPES,
  },
  {
    title: "Mitt konto",
    path: ROUTES.ACCOUNT,
  },
];

const Dropdown = ({ click }) => {
  const classes = useStyles();
  const firebase = useFirebase();

  return (
    <ul
      className={classes.dropdown}
    >
      {menuItems.map((item, index) => {
        return (
          <li key={index}>
            <Link
              className={classes.link}
              to={item.path}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
      <li key="6">
        <span className={classes.link} onClick={() => firebase.logout()}>
          Logga ut
        </span>
      </li>
    </ul>
  );
};


export default Dropdown;
