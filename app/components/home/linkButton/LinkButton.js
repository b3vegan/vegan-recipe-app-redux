import React, { PropTypes } from 'react';

import style from './style.scss';

const LinkButton = ({ onClick, label, icon, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={style.linkButton}>
            {label}
            {!icon ? null :
                <i className={`material-icons ${style.icon}`}>{icon}</i>
            }
        </button>
    );
};

LinkButton.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    onClick: PropTypes.func
};

LinkButton.defaultProps = {
    label: 'LinkButton-default'
};

export default LinkButton;