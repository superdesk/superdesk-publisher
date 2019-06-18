import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const SaveBar = ({ save, cancel, isDisabled }) => {
  return (
    <div className="sd-collapse-box__sliding-toolbar-wrapper">
      <div className="sd-collapse-box__sliding-toolbar">
        <div className="sliding-toolbar__inner" />
        <a className="btn btn--hollow btn--ui-dark" onClick={cancel}>
          Cancel
        </a>
        <button
          className={classNames("btn btn--primary", {
            "btn--disabled": isDisabled
          })}
          onClick={save}
          disabled={isDisabled}
          data-testid="save-button"
        >
          Save
        </button>
      </div>
    </div>
  );
};

SaveBar.propTypes = {
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool
};

SaveBar.defaultProps = {
  isDisabled: false
};

export default SaveBar;
