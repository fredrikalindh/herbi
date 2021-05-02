import React, { useState, useRef } from "react";
import TextField from "@material-ui/core/TextField";
// import Select from "@material-ui/core/Select";
// import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Autocomplete from '@material-ui/lab/Autocomplete';

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 15px",
    width: "100%",
    "& .MuiTextField-root": {
      padding: "0px 10px",
    },
    [theme.breakpoints.down('xs')]: {
      display: "initial",
      // flexWrap: "wrap",
      "& .MuiTextField-root": {
        width: "100%"
      },
    }
  },
}));

const quantities = [
  "",
  "krm",
  "tsk",
  "msk",
  "dl",
  "liter ",
  "gram",
  "kg",
  "st",
  "förpackning",
  "burk",
  "knippe",
  "kruka",
  "cm",
];

export const IngredientInput = ({ addIngredient }) => {
  const classes = useStyles();

  const [ingredient, setIngredient] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [quantity, setQuantity] = useState("");
  const [errors, setErrors] = useState("");

  const ref = useRef();

  const handleClick = (e) => {
    if (ingredient === "") {
      setErrors("Can't be empty");
    } else {
      addIngredient(ingredient, [quantity, measurement]);
      setIngredient("");
      setMeasurement("");
      setQuantity("");
      setErrors("");
      ref.current.focus();
    }
  };

  const handleChange = (e) => {
    if (e.target.id === "quantity") {
      setQuantity(e.target.value);
    } else if (e.target.id === "ingredient") {
      setIngredient(e.target.value);
    } else {
      setMeasurement(e.target.innerHTML);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleClick();
    }
  };

  return (
    <form className={classes.root}>
      <TextField
        id="ingredient"
        name="ingredient"
        type="text"
        label="Ingrediens"
        value={ingredient}
        onChange={handleChange}
        error={errors !== ""}
        helperText={errors}
        onKeyDown={handleKeyDown}
        inputRef={ref}
      ></TextField>
      <TextField
        id="quantity"
        name="quantity"
        type="number"
        label="Kvantitet"
        value={quantity}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      ></TextField>
      <Autocomplete
        id="measurement"
        options={quantities}
        value={measurement}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        renderInput={(params) => <TextField {...params} label="Mått" />}
      />
      <Tooltip title="Add Ingredient">
        <IconButton onClick={handleClick}>
          <AddIcon color="primary" />
        </IconButton>
      </Tooltip>
    </form>
  );
};
