import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.scss";
import themeObject from "./util/theme";
import { ThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

import firebase from "./util/Firebase";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";

// components
import Navbar from "./components/Navbar";
import AuthRoute from "./components/AuthRoute";
import NewRecipe from './components/NewRecipe';

import * as ROUTES from "./constants/routes";
// pages
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Settings from "./pages/Settings";
import Recipe from "./pages/Recipe";
import SavedRecipes from "./pages/SavedRecipes";
// import CreateRecipe from "./pages/CreateRecipe";

firebase.firestore(); // <- needed if using firestore
firebase.functions(); // <- needed if using httpsCallable

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
};
const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, //since we are using Firestore
};

const theme = createMuiTheme(themeObject);

const App = () => {

  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <ThemeProvider theme={theme}>
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <Route path={ROUTES.LANDING} exact component={Home} />
                <AuthRoute
                  path={ROUTES.SAVED_RECIPES}
                  exact
                  component={SavedRecipes}
                />
                <AuthRoute
                  path={ROUTES.ACCOUNT}
                  exact
                  component={Settings}
                />
                <AuthRoute
                  path={ROUTES.EDIT_RECIPE}
                  exact
                  component={NewRecipe}
                />
                <AuthRoute
                  path={ROUTES.CREATE_RECIPE}
                  exact
                  component={NewRecipe}
                />
                <Route path={ROUTES.RECIPES} exact component={Recipes} />
                <Route path={ROUTES.RECIPE} component={Recipe} />
              </Switch>
            </div>
          </Router>
        </ThemeProvider>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
};

export default App;
