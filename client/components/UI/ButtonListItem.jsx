import React from 'react'
import PropTypes from 'prop-types'

const ButtonListItem = ({ onClick, label }) => {
    return (
        <div className="sd-list-item" onClick={onClick}>
            <div className="sd-list-item__border"></div>
            <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                <div className="sd-list-item__row">
                    <span className="sd-overflow-ellipsis">{label}</span>
                </div>
            </div>
            <div className="sd-list-item__action-menu">
                <i className="icon-chevron-right-thin"></i>
            </div>
        </div>
    );
}

ButtonListItem.propTypes = {
    onClick: PropTypes.func,
    label: PropTypes.string
}

ButtonListItem.defaultProps = {
    label: 'Add',
}

export default ButtonListItem
