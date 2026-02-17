import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Publish from "./Publish";
import Unpublish from "./Unpublish";
import Preview from "./Preview";
import Store from "../Store";

import { IconButton } from "superdesk-ui-framework/react";

class PublishPane extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      tab: "publish",
      isMetadataOpen: false,
      isPreviewOpen: false,
      previewItem: null,
      loading: true,
      destinations: [],
      package: {},
      selectedItem: {},
    };
  }

  componentDidMount() {
    this._isMounted = true;
    document.addEventListener("refreshOutputLists", this.reset, false);
  }

  componentWillUnmount() {
    this._isMounted = false;
    document.removeEventListener("refreshOutputLists", this.reset, false);
  }

  componentDidUpdate() {
    if (
      this.props.isOpen &&
      this.context.selectedItem &&
      this.context.selectedItem.id !== this.state.selectedItem.id
    ) {
      this.setState(
        {
          destinations: [],
          selectedItem: this.context.selectedItem,
          loading: true,
        },
        this.loadPackage
      );
    }
  }

  reset = () => {
    this.setState({
      destinations: [],
      selectedItem: {},
      loading: true,
    });
  };

  loadPackage = () => {
    // build destinations
    let destinations = [];

    this.context.publisher
      .getPackage(this.context.selectedItem.id)
      .then((response) => {
        response.articles.forEach((item) => {
          let tenant = this.context.tenants.find((t) => {
            return t.code === item.tenant.code;
          });

          if (tenant && item.route) {
            let tenantUrl =
              tenant.pwa_config && tenant.pwa_config.url
                ? tenant.pwa_config.url
                : tenant.subdomain
                ? "https://" + tenant.subdomain + "." + tenant.domain_name
                : "https://" + tenant.domain_name;

            destinations.push({
              tenant: tenant,
              route: item.route,
              status: item.status,
              updated_at: item.updated_at,
              paywall_secured: item.paywall_secured,
              content_lists: item.content_lists,
              seo_metadata: item.seo_metadata,
              slug: item.slug,
              live_url:
                item.status === "published"
                  ? tenantUrl + item._links.online.href
                  : null,
            });
          }
        });

        this.setState({
          destinations,
          package: response,
          loading: false,
        });
      });
  };

  togglePreview = (item) => {
    this.setState({
      isPreviewOpen: item ? true : false,
      previewItem: item ? item : null,
    });
  };

  switchTab = (type) => this.setState({ tab: type, isMetadataOpen: false });

  render() {
    if (!this.props.isOpen) return null;

    return (
      <div className="sd-publish-panel">
        <div className="side-panel side-panel--shadow-right side-panel--dark-ui">
          <div className="side-panel__header">
            <div className="side-panel__tools">
              <IconButton
                icon="close-small"
                tooltip={{ text: "Close", flow: "left" }}
                onClick={() => this.context.actions.togglePublish(null)}
              />
            </div>
            <ul className="nav-tabs nav-tabs--ui-dark">
              <li
                className={classNames("nav-tabs__tab", {
                  "nav-tabs__tab--active": this.state.tab === "publish",
                })}
              >
                <button
                  onClick={() => this.switchTab("publish")}
                  className="nav-tabs__link"
                >
                  <span>Publish</span>
                </button>
              </li>
              {this.state.package && this.state.package.status !== "new" ? (
                <li
                  className={classNames("nav-tabs__tab", {
                    "nav-tabs__tab--active": this.state.tab === "unpublish",
                  })}
                >
                  <button
                    onClick={() => this.switchTab("unpublish")}
                    className="nav-tabs__link"
                  >
                    <span>Unpublish</span>
                  </button>
                </li>
              ) : null}
            </ul>
          </div>

          {this.state.tab === "publish" ? (
            <Publish
              destinations={this.state.destinations}
              openPreview={(item) => this.togglePreview(item)}
              loading={this.state.loading}
            />
          ) : (
            <Unpublish
              destinations={this.state.destinations}
              loading={this.state.loading}
            />
          )}
        </div>

        <Preview
          isOpen={this.state.isPreviewOpen}
          close={this.togglePreview}
          item={this.state.previewItem}
        ></Preview>
      </div>
    );
  }
}

PublishPane.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default PublishPane;
