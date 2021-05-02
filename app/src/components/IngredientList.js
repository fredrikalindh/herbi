import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Chip from "@material-ui/core/Chip";
// import { IngredientInput } from "./IngredientInput";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
    width: "100%",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

export const IngredientList = ({ ingredients, handleDelete }) => {
  const classes = useStyles();
  const deletable = handleDelete ? true : false;

  let ingredientList = [];
  for (const [key, value] of Object.entries(ingredients)) {
    ingredientList.push([key, ...value]);
  }

  const stringify = ([ingredient, quantity, measure]) => {
    const qm = measure ? `${quantity} ${measure}` : quantity;
    return `${qm} ${ingredient}`;
  };

  return (
    <ul className={classes.root}>
      {ingredientList.map((el, i) => (
        <li key={i}>
          {deletable ? (
            <Chip
              label={stringify(el)}
              onDelete={handleDelete(el[0])}
              className={classes.chip}
            />
          ) : (
              <Chip
                label={stringify(el)}
                className={classes.chip}
              />
            )}
        </li>
      ))}
    </ul>
  );
};

// export default IngredientList;

// export const IngredientList = (props) => {
//   const [ingredients, setIngredients] = useState([]);

//   const addIngredient = (newIngredient) => {
//     setIngredients((prev) => [...prev, newIngredient]);
//   };

//   return (
//     <div className="ingredients">
//       <h2>Ingredients</h2>
//       <ul>
//         {ingredients.map((el, i) => (
//           <li key={i}>{el}</li>
//         ))}
//       </ul>
//       <IngredientInput addIngredient={addIngredient} />
//     </div>
//   );
// };
