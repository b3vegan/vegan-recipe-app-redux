import { fromJS, Map } from 'immutable';

import * as actionCreators from '../actions/creators';
import {
    addRecipe,
    deleteRecipe,
    updateRecipeName,
    updateRecipeDirections,
    updateRecipeIngredients
} from '../js/core';

import { snakeCase } from '../js/core_helpers';
// sample file for now
var initialState = require("../../sample");



const recipeList = (state = fromJS(initialState.recipeList), action) => {
    switch (action.type) {
        case 'ADD_RECIPE':
            return addRecipe(state, action.recipe);
        case 'DELETE_RECIPE':
            return deleteRecipe(state, action.recipeName);
        case 'UPDATE_RECIPE_NAME':
            return updateRecipeName(state, action.oldName, action.newName);
        case 'UPDATE_RECIPE_DIRECTIONS':
            return state.update(snakeCase(action.recipeName), (recipe) => {
                return updateRecipeDirections(recipe, action.directions);
            });
        case 'UPDATE_RECIPE_INGREDIENTS':
            return state.update(snakeCase(action.recipeName), (recipe) => {
                return updateRecipeIngredients(recipe, action.ingredients);
            });
        default:
            return state;
    }
};

export default recipeList;