import React, { PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import style from './style';

const LivePreview = ( { ...props, name, created_date, directions, ingredients, imageURL }) => {

    const outputDirections = directions.map((direction, index) => {
        return (
            <li key={index}> {direction}</li>
        );
    });
    const outputIngredients = ingredients.map((ingredient, index) => {
        return (
            <li key={index}>
                <p>{ingredient.get('amount')} - {ingredient.get('item')}</p>
            </li>
        );
    });
    return (
        <div className={style.livePreview}>
            <p className={style.name}>Name: {name}</p>
            <p className={style.createDate}> Created On: {created_date} </p>
            {!!imageURL && <p className={style.url}> ImageURL: {imageURL}</p>}
            Ingredients
            <ul className={style.ingredientsList}>
                {outputIngredients}
            </ul>
            Directions:
            <ul className={style.directionsList}>
                {outputDirections}
            </ul>
        </div>
    );
};

LivePreview.propTypes = {
    name: PropTypes.string,
    directions: ImmutablePropTypes.list,
    ingredients: ImmutablePropTypes.list
};

export default LivePreview;