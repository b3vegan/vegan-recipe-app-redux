import React, { PropTypes } from 'react';
import { fromJS, Map, List } from 'immutable';
import { reduxForm } from 'redux-form';


import axios from 'axios';
import moment from 'moment';
import uuid from 'node-uuid';

import format, {
    formatDate,
    handlePreview,
    dropExtension
} from '../../js/format';
import { snakedNameOf } from '../../js/core_helpers';

/*** Components ***/
import LivePreview from '../livePreview/';
import InputForm from '../inputForm';

/*** styling ***/
import style from './style';

const AddRecipe = (props) => {

    const onSubmit = (values, dispatch) => {
        const { name, created_date, img, ingredients, directions } = values;
        if (!name) return; // short circuit
        /*====================================
        =            Image upload            =
        ====================================*/
        let fileName = '';
        if (img) {
            // Send the image file to the server if added by user.
            const cloudinaryUrl = 'http://res.cloudinary.com/dxmist0g2/image/upload/c_scale,h_400,r_10,w_500/';
            const file = img[0];
            const reader = new FileReader;
            fileName = `${cloudinaryUrl}${dropExtension(file.name)}`;
            reader.onload = () => {
                axios.post('/img', {
                    imageUrl: reader.result,
                    name: dropExtension(file.name)
                });
            };
            reader.readAsDataURL(file);

        }

        /*=====  End of Image upload  ======*/

        /*** Create date ***/
        const defaultDate = moment();
        const finalDate = formatDate(!created_date ?
                                        defaultDate :
                                        created_date
                                    );

        const newRecipe = fromJS({
            name: format('name')(!name ? '' : name),
            id: uuid.v4(),
            created_date: finalDate,
            imageURL: fileName, // empty if no img uploaded
            ingredients: format('ingredients')(!ingredients ? '' : ingredients),
            directions: format('directions')(!directions ? '' : directions)
        });
        props.actions.addRecipe(newRecipe);

        /*
        Setting a delay to the redirect to give time to cloudinary to upload
        image. This is not fool proof and should look at async rendering React.
         */
        setTimeout(() => {
            props.actions.push(`/recipes/${snakedNameOf(newRecipe)}`);

        }, 1000);
    };

    const { fields, handleSubmit } = props;
    return (
        <div className={style.wrapper}>
            <InputForm
                submitText="Add New Recipe!"
                { ...props }
                handleSubmit={handleSubmit.bind(null, onSubmit)} />
            <LivePreview
                className={style.livePreview}
                { ...handlePreview(fields) } />
        </div>
    );
};

export default reduxForm({
    form: 'addRecipe',
    fields: [
        'name',
        'created_date',
        'imageURL',
        'directions',
        'ingredients',
        'img'
    ]
})(AddRecipe);