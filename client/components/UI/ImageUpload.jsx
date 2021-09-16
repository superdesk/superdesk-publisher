import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { gettext } from "../../superdeskApi";
import Loading from "./Loading/Loading";

const ImageUpload = ({ upload, href, fieldName, isUploadingInProgress }) => {
  return (
    <div className="sd-line-input">
      <label className="sd-line-input__label">Post image</label>
      <div
        className={classNames("sd-overlay-block", {
          "sd-overlay-block--no-image": !href
        })}
      >
        <div className="sd-overlay-block__overlay">
          <div className="sd-overlay-block__overlay-action-group">
            <label
              htmlFor={fieldName}
              className="sd-overlay-block__overlay-action"
              sd-tooltip={gettext("Upload image")}
            >
              <i className="icon-upload" />
            </label>
            {!href && (
              <span className="sd-overlay-block__overlay-message">
                {gettext("No image has been set so far.")}
              </span>
            )}
          </div>
        </div>
        {isUploadingInProgress ? (
          <div
            style={{
              position: "absolute",
              display: "flex",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0, 0.5)"
            }}
          >
            <Loading />
          </div>
        ) : null}
        {href && <img src={href} />}
      </div>
      <input
        type="file"
        accept="image/*"
        id={fieldName}
        name={fieldName}
        onChange={upload}
        style={{
          opacity: 0,
          position: "absolute",
          width: "1px",
          height: "1px"
        }}
      />
    </div>
  );
};

ImageUpload.propTypes = {
  upload: PropTypes.func.isRequired,
  href: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
  isUploadingInProgress: PropTypes.bool
};

export default ImageUpload;
