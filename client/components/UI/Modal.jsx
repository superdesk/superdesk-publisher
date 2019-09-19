import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const Modal = ({ isOpen, children }) => {
  return (
    <React.Fragment>
      <div
        className={classNames("modal modal--double", { in: isOpen })}
        data-backdrop="static"
        style={isOpen ? { zIndex: "1050", display: "block" } : null}
      >
        <div className="modal__dialog">
          <div className="modal__content">{children}</div>
        </div>
      </div>
      {isOpen && (
        <div
          className="modal__backdrop fade in modal--double"
          style={{ zIndex: "1049" }}
        />
      )}
    </React.Fragment>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default Modal;
