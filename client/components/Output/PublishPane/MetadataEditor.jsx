import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import _ from "lodash";

import ImageUpload from "../../UI/ImageUpload";
import Store from "../Store";

class MetadataEditor extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this.state = {
      file: null,
      title: null,
      description: null,
      uploading: false
    };
  }

  componentDidUpdate(prevProps) {
    if (!this.props.destination) return;

    if (
      !_.isEqual(this.props.destination, prevProps.destination) ||
      !_.isEqual(this.props.type, prevProps.type)
    ) {
      if (!this.props.destination.seo_metadata) {
        this.setState({ file: null, title: null, description: null });
        return;
      }

      let {
        fileFieldName,
        titleFieldName,
        descriptionFieldName
      } = this.getFieldNames();

      let file =
        this.props.destination.seo_metadata._links &&
        this.props.destination.seo_metadata._links[fileFieldName]
          ? this.props.destination.seo_metadata._links[fileFieldName].href
          : null;
      let title = this.props.destination.seo_metadata[titleFieldName];
      let description = this.props.destination.seo_metadata[
        descriptionFieldName
      ];

      this.setState({ file, title, description });
    }
  }

  saveMetaData = () => {
    let {
      fileFieldName,
      titleFieldName,
      descriptionFieldName
    } = this.getFieldNames();

    let metadata = {
      [titleFieldName]: this.state.title,
      [descriptionFieldName]: this.state.description
    };

    this.context.publisher.setTenant(this.props.destination.tenant);
    this.context.publisher.saveArticleMetaData(
      metadata,
      this.props.destination.slug
    );
  };

  debouncedSaveMetadata = _.debounce(this.saveMetaData, 1000, {
    maxWait: 3000
  });

  uploadImage = e => {
    const files = Array.from(e.target.files);
    const name = e.target.name;

    if (files && files.length) {
      let metaFile = files[0];
      if (!metaFile.$error) {
        this.setState({ uploading: true });

        let data = {};
        data[name] = metaFile;

        this.context.publisher.setTenant(this.props.destination.tenant);
        this.context.publisher
          .uploadMetaImage(data, this.props.destination.slug)
          .then(response => {
            let {
              fileFieldName,
              titleFieldName,
              descriptionFieldName
            } = this.getFieldNames();

            let file =
              response.data._links && response.data._links[fileFieldName]
                ? response.data._links[fileFieldName].href
                : null;
            let title = response.data[titleFieldName];
            let description = response.data[descriptionFieldName];

            this.setState({ file, title, description, uploading: false });
          })
          .catch(err => {
            this.setState({ uploading: false });
          });
      }
    }
  };

  getFieldNames = () => {
    let fileFieldName = "og_media_url";
    let titleFieldName = "og_title";
    let descriptionFieldName = "og_description";

    if (this.props.type === "Twitter") {
      fileFieldName = "twitter_media_url";
      titleFieldName = "twitter_title";
      descriptionFieldName = "twitter_description";
    }

    if (this.props.type === "SEO") {
      fileFieldName = "meta_media_url";
      titleFieldName = "meta_title";
      descriptionFieldName = "meta_description";
    }

    return { fileFieldName, titleFieldName, descriptionFieldName };
  };

  handleInputChange = e => {
    let { name, value } = e.target;

    this.setState({ [name]: value }, this.debouncedSaveMetadata);
  };

  render() {
    let imageFieldName = "meta_media_file";

    if (this.props.type === "Twitter") {
      imageFieldName = "twitter_media_file";
    }

    if (this.props.type === "Facebook") {
      imageFieldName = "og_media_file";
    }

    return (
      <div
        className={classNames("side-panel__content-block-overlay-grid", {
          "side-panel__content-block-overlay-grid--open": this.props.isOpen
        })}
      >
        <div className="side-panel">
          <div className="side-panel__header">
            <a
              className="icn-btn sd-margin-l--1"
              onClick={this.props.close}
              sd-tooltip="Back"
              flow="right"
            >
              <i className="icon-arrow-left"></i>
            </a>
            <h3 className="side-panel__heading side-panel__heading--big">
              {this.props.type} meta data
            </h3>
          </div>
          <div className="side-panel__content">
            <div className="side-panel__content-block">
              <div className="form__row">
                <ImageUpload
                  href={this.state.file}
                  upload={e => this.uploadImage(e)}
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
                    name="title"
                    value={this.state.title ? this.state.title : ""}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="sd-line-input sd-line-input--dark-ui sd-line-input--boxed">
                  <label className="sd-line-input__label">Description</label>
                  <textarea
                    className="sd-line-input__input"
                    name="description"
                    value={this.state.description ? this.state.description : ""}
                    onChange={this.handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MetadataEditor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  destination: PropTypes.object,
  type: PropTypes.string,
  close: PropTypes.func.isRequired
};

export default MetadataEditor;
