import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import _ from "lodash";
import Store from "../Store";
import Modal from "../../UI/Modal";
import { Button } from "superdesk-ui-framework/react";

class Preview extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this.state = {
      mode: "desktop",
      urls: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      !_.isEqual(prevProps.item, this.props.item) &&
      this.props.item &&
      this.props.item.tenant &&
      this.props.item.route
    ) {
      let token = this.context.publisher.getToken();
      let destination = this.props.item;

      let tenantUrl =
        destination.tenant.pwa_config && destination.tenant.pwa_config.url
          ? destination.tenant.pwa_config.url
          : destination.tenant.subdomain
          ? "//" +
            destination.tenant.subdomain +
            "." +
            destination.tenant.domain_name
          : "//" + destination.tenant.domain_name;

      let urls = {
        regular:
          tenantUrl +
          "/preview/package/" +
          destination.route.id +
          "/" +
          this.context.selectedItem.id +
          "?auth_token=" +
          token,
        amp:
          tenantUrl +
          "/preview/package/" +
          destination.route.id +
          "/" +
          this.context.selectedItem.id +
          "?auth_token=" +
          token +
          "&amp",
      };

      this.setState({ urls });
    }
  }

  changeMode = (mode) => this.setState({ mode });

  render() {
    let { mode, urls } = this.state;
    if (!this.props.isOpen || !urls) return null;

    let url = urls.regular;

    let modeName = "Desktop";
    if (mode === "tablet") {
      modeName = "Tablet";
    } else if (mode === "tablet-landscape") {
      modeName = "Tablet Landscape";
    } else if (mode === "mobile") {
      modeName = "Mobile";
    } else if (mode === "mobile-landscape") {
      modeName = "Mobile Landscape";
    } else if (mode === "amp") {
      modeName = "AMP";
      url = urls.amp;
    } else if (mode === "amp-landscape") {
      modeName = "AMP Landscape";
      url = urls.amp;
    }

    return (
      <Modal isOpen={true} type="modal--kindafullscreen">
        <div className="subnav subnav--lower-z-index">
          <h6 className="sd-margin-l--1" style={{ width: "300px" }}>
            Live preview: <b className="text--dark">{modeName}</b>
          </h6>

          <div className="text--center">
            <a
              className={classNames(
                "cursorPointer previewIcon previewIcon--desktop",
                { "previewIcon--active": mode == "desktop" }
              )}
              onClick={() => this.changeMode("desktop")}
            ></a>
            <a
              className={classNames(
                "cursorPointer previewIcon previewIcon--tablet",
                { "previewIcon--active": mode == "tablet" }
              )}
              onClick={() => this.changeMode("tablet")}
            ></a>
            <a
              className={classNames(
                "cursorPointer previewIcon previewIcon--tabletLandscape",
                { "previewIcon--active": mode == "tablet-landscape" }
              )}
              onClick={() => this.changeMode("tablet-landscape")}
            ></a>
            <a
              className={classNames(
                "cursorPointer previewIcon previewIcon--mobile",
                { "previewIcon--active": mode == "mobile" }
              )}
              onClick={() => this.changeMode("mobile")}
            ></a>
            <a
              className={classNames(
                "cursorPointer previewIcon previewIcon--mobileLandscape",
                { "previewIcon--active": mode == "mobile-landscape" }
              )}
              onClick={() => this.changeMode("mobile-landscape")}
            ></a>
            <a
              className={classNames(
                "cursorPointer previewIcon previewIcon--amp",
                { "previewIcon--active": mode == "amp" }
              )}
              onClick={() => this.changeMode("amp")}
            ></a>
            <a
              className={classNames(
                "cursorPointer previewIcon previewIcon--ampLandscape",
                { "previewIcon--active": mode == "amp-landscape" }
              )}
              onClick={() => this.changeMode("amp-landscape")}
            ></a>
          </div>
          <div className="subnav__stretch-bar"></div>
          <span className="sd-margin-r--1">
            <Button text="Close" onClick={() => this.props.close()} />
          </span>
        </div>

        <div className="modal__body articlePreview">
          <iframe
            src={url}
            className={classNames("articlePreview__iframe", {
              "articlePreview__iframe--tablet": mode == "tablet",
              "articlePreview__iframe--tabletLandscape":
                mode == "tablet-landscape",
              "articlePreview__iframe--mobile":
                mode == "mobile" || mode == "amp",
              "articlePreview__iframe--mobileLandscape":
                mode == "mobile-landscape" || mode == "amp-landscape",
            })}
          ></iframe>
        </div>
      </Modal>
    );
  }
}

Preview.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  item: PropTypes.object,
};

export default Preview;
