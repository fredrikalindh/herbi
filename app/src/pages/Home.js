import React from "react";

import * as ROUTES from "../constants/routes";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

// import 

const useStyles = makeStyles((theme) => ({
  section: {
    paddingTop: 50,
    paddingBottom: 50,
    width: "80vw",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "left",
    "& .text": {
      width: "40vw",
    },
    "& img": {
      width: 600,
      "-webkitFilter": "drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))",
      filter: 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7))',
      "&:hover": {
        transform: "rotate3d(0, 1, 0, 10deg)"
        // transform: "scale(1) translate(5px, -5px)"
      }
    },
    [theme.breakpoints.down('sm')]: {
      // padding: 50,
      width: "100vw",
      flexDirection: "column",
      "& .text": {
        width: "70vw",
      },
      "& img": {
        maxWidth: "90vw",
        padding: "30px 0px"
      },
    }
  },
  button: {
    float: "right",
    marginTop: 30
  },
  reverse: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: "column-reverse"
    }
  }
}));

const Home = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.section} id="discover">
        <div className="text">
          <Typography variant="h1" color="secondary">Säg hej till Herbi!</Typography>

          <Typography>
            Så som Ylva och Ramin kämpade med att laga, smaka, fota, ändra och testa för att fixa världens bästa veganska recept var det ju inte möjligt att de skulle få stanna i en google drive mapp. Nu är recepten äntligen här!
          </Typography>

          <Button className={classes.button} variant="contained" href={ROUTES.RECIPES} color="primary" >
            Till recepten!
          </Button>
        </div>
        <img src="yochr.png" alt="Discover new recipes" />
      </div>
      <div className={classes.section} id="organize">
        <img src="organize.svg" alt="Organize your recipes" />
        <div className="text">
          <Typography variant="h4" color="secondary">Hitta recepten</Typography>
          <Typography>
            Recepten är sökbara, så den där underbara Biryanin går att hitta igen och spara.
          </Typography>
        </div>
      </div>
      <div className={`${classes.section} ${classes.reverse}`}>
        <div className="text">
          <Typography variant="h4" color="secondary">Sharing is caring</Typography>
          <Typography>
            Jag vet att även andra i familjen sitter på en guldgruva av goa recept så finns möjligheten att lägga upp dem här 🌽
          </Typography>
        </div>
        <img src="share.svg" alt="Share your recipes" />
      </div>
    </>
  );
};

export default Home;
