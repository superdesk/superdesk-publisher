import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Modal = ({ isOpen, type = "modal--double", children }) => {
  return (
    <React.Fragment>
      <div
        className={classNames("modal", type, { in: isOpen })}
        data-backdrop="static"
        style={isOpen ? { zIndex: "1050", display: "block" } : null}
      >
        <div className="modal__dialog">
          <div className="modal__content">{children}</div>
        </div>
      </div>
      {isOpen && (
        <div
          className={classNames("modal__backdrop fade in", type)}
          style={{ zIndex: "1049" }}
        />
      )}
    </React.Fragment>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  type: PropTypes.string
};

export default Modal;
