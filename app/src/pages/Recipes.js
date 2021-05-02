import React from "react";
import RecipeLink from "../components/RecipeLink";
// import Search from "../components/Search";
// import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
// import Grid from "@material-ui/core/Grid";

// import { useFirestoreConnect } from "react-redux-firebase";
// import { useSelector } from "react-redux";

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure, SearchBox, InfiniteHits, SortBy, ClearRefinements, RefinementList, RatingMenu, createInfiniteHitsSessionStorageCache } from 'react-instantsearch-dom';

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_APP_KEY
);

const sessionStorageCache = createInfiniteHitsSessionStorageCache();


// const search = instantsearch({
//   appId: "B1G2GM9NG0",
//   apiKey: "aadef574be1f9252bb48d4ea09b5cfe5",
//   indexName: "demo_ecommerce",
//   searchParameters: {
//     hitsPerPage: 5,
//     attributesToSnippet: ["description:24"],
//     snippetEllipsisText: " [...]"
//   }
// });

const useStyles = makeStyles((theme) => ({
  recipes: {
    display: "grid",
    gridTemplateAreas: `"search search"
                        "filters hits"`,
    gridTemplateColumns: "180px 1fr",
    margin: "40px 20px",
    maxWidth: 1200,
    width: "90%",
    [theme.breakpoints.down('sm')]: {
      gridTemplateAreas: `"search"
      "filters"
      "hits"`,
      gridTemplateColumns: "1fr",
    }
  },
  search: {
    width: "100%",
    gridArea: "search",
    display: "grid",
    gridTemplateColumns: "1fr 200px",
    gridGap: 20,
    marginBottom: 10,
    [theme.breakpoints.down('sm')]: {
      display: "initial",
      "& div": {
        marginBottom: 10
      }
    }

  },
  filters: {
    gridArea: "filters",
    marginTop: 10,
    "& ul": {
      marginTop: 20,
      listStyle: "none",
      "& li": {
        "& span": {
          fontFamily: "Lekton",
          fontSize: 16,
          padding: 4
        },
      }
    },
    [theme.breakpoints.down('sm')]: {
      "& ul": {
        display: "flex",
        flexWrap: "wrap",
        "& li": {
          padding: 5,
        }
      },
    }
  },
  hits: {
    gridArea: "hits",
    width: "100%",
    "& ul": {
      width: "100%",
      padding: 0,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "flex-start",
      alignItems: "top",
      "& .ais-InfiniteHits-item": {
        padding: 10,
        flex: "1 1 300px",
        background: 'transparent',
        boxShadow: 'none',
      }
    },
    [theme.breakpoints.down('xs')]: {
      "& ul": {
        flex: "1 1 0",
        "& .ais-InfiniteHits-item": {
          width: "100%",

        }
      }
    }
  },
}));

const Recipes = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.recipes}>
      <InstantSearch
        indexName="recipes"
        searchClient={searchClient}
      >
        <Configure
          // filters="free_shipping:true"
          hitsPerPage={9}
        // distinct
        />
        <div className={classes.search}>
          <SearchBox />
          <SortBy
            defaultRefinement="recipes"
            items={[
              { value: 'recipes', label: 'Featured' },
              { value: 'recipes_average_rating_asc', label: 'Rating asc.' },
              { value: 'recipes_average_rating_desc', label: 'Rating desc.' },
            ]}
          />
        </div>

        <div className={classes.filters}>
          <ClearRefinements />
          <RefinementList
            attribute="_tags"
          />
          {/* <RefinementList
            attribute="_ingredients"
            searchable
          /> */}
          <RatingMenu
            attribute="averageRating"
          // Optional parameters
          // min={1}
          // max={5}
          />
        </div>
        <InfiniteHits
          className={classes.hits}
          hitComponent={RecipeLink}
          // showPrevious={true}
          cache={sessionStorageCache}
        />
      </InstantSearch>
    </div>
  );
};

// Recipes.propTypes = {
//   data: PropTypes.object.isRequired,
//   getRecipes: PropTypes.func.isRequired,

// };

export default Recipes;
