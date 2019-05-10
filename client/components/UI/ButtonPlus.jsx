import React from 'react'
import PropTypes from 'prop-types'

const ButtonPlus = ({ onClick }) => {
    return (
        <button className="btn btn--primary btn--icon-only-circle" onClick={onClick}>
            <i className="icon-plus-large"></i>
        </button>
    )
}

ButtonPlus.propTypes = {
    onClick: PropTypes.func
}

export default ButtonPlus