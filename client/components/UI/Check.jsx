import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const CheckButton = ({ onClick, label, isChecked }) => {
  return (
    <span className="sd-check__wrapper ng-empty ng-valid" onClick={onClick}>
      <span
        className={classNames(
          "sd-checkbox sd-checkbox--button-style sd-checkbox--radio",
          { checked: isChecked }
        )}
      >
        <label>{label}</label>
      </span>
    </span>
  );
};

CheckButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  isChecked: PropTypes.bool
};

export default CheckButton;
