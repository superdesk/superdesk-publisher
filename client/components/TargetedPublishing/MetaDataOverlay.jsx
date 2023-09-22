import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import { IconButton } from "superdesk-ui-framework/react";
import ImageUpload from "../UI/ImageUpload";

class MetaDataOverlay extends Component {
  handleInputChange = (e, a) => {
    let { name, value } = e.target;
    let newData = { ...this.props.metaData };

    newData[name] = value;
    this.props.setMetaData(newData);
  };

  render() {
    let imageFieldName = "og_media_file";
    let titleFieldName = "og_title";
    let descriptionFieldName = "og_description";
    let imageHref =
      this.props.metaData._links && this.props.metaData._links.og_media_url
        ? this.props.metaData._links.og_media_url.href
        : "";

    if (this.props.type === "Twitter") {
      imageFieldName = "twitter_media_file";
      titleFieldName = "twitter_title";
      descriptionFieldName = "twitter_description";
      imageHref =
        this.props.metaData._links &&
          this.props.metaData._links.twitter_media_url
          ? this.props.metaData._links.twitter_media_url.href
          : "";
    }

    if (this.props.type === "SEO") {
      imageFieldName = "meta_media_file";
      titleFieldName = "meta_title";
      descriptionFieldName = "meta_description";
      imageHref =
        this.props.metaData._links && this.props.metaData._links.meta_media_url
          ? this.props.metaData._links.meta_media_url.href
          : "";
    }

    return (
      <div
        className={classNames("side-panel__content-block-overlay", {
          "side-panel__content-block-overlay--open": this.props.isOpen,
        })}
      >
        <div className="side-panel">
          <div className="side-panel__header">
            <div className="side-panel__header-wrapper sd-flex--items-center">
              <span className="sd-margin-l--1">
                <IconButton
                  icon="arrow-left"
                  tooltip={{ text: "Back", flow: "right" }}
                  onClick={this.props.toggle}
                />
              </span>

              <h3 className="side-panel__heading side-panel__heading--big sd-margin-l--1">
                {this.props.type}
              </h3>
            </div>
          </div>
          <div className="side-panel__content">
            <div className="side-panel__content-block">
              <div className="form__row">
                <ImageUpload
                  href={imageHref}
                  upload={(e) => this.props.uploadImage(e)}
                  fieldName={imageFieldName}
                  isUploadingInProgress={this.props.isUploadingInProgress}
                />
              </div>
              <div className="form__row">
                <div className="sd-line-input sd-line-input--dark-ui sd-line-input--boxed">
                  <label className="sd-line-input__label">Title</label>
                  <input
                    className="sd-line-input__input"
                    type="text"
                    name={titleFieldName}
                    value={
                      this.props.metaData[titleFieldName]
                        ? this.props.metaData[titleFieldName]
                        : ""
                    }
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
              <div className="form__row">
                <div className="sd-line-input sd-line-input--dark-ui sd-line-input--boxed">
                  <label className="sd-line-input__label">Description</label>
                  <textarea
                    className="sd-line-input__input"
                    name={descriptionFieldName}
                    value={
                      this.props.metaData[descriptionFieldName]
                        ? this.props.metaData[descriptionFieldName]
                        : ""
                    }
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MetaDataOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  metaData: PropTypes.object.isRequired,
  setMetaData: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  isUploadingInProgress: PropTypes.bool,
};

export default MetaDataOverlay;
