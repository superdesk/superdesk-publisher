import React from 'react'
import PropTypes from 'prop-types'

const ButtonWide = ({ onClick, label }) => {
    return <button className="btn btn--hollow btn--expanded btn--primary" onClick={onClick}>{label}</button>
}

ButtonWide.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string
}

ButtonWide.defaultProps = {
    label: 'Add',
}

export default ButtonWide