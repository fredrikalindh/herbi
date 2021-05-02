import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

// const store = createStore(reducers);
// const store = createStore(
//   reducers,
//   initialState,
//   applyMiddleware(...middleware)
// );

const store = createStore(reducers,
  initialState,
  compose(applyMiddleware(...middleware))
);
// const store = createStore(
//   reducers,
//   initialState,
//   compose(
//     applyMiddleware(...middleware),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   )
// );

export default store;
