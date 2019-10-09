import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Publish from "./Publish";
import Unpublish from "./Unpublish";
import Store from "../Store";

class PublishPane extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      tab: "publish",
      isMetadataOpen: false,
      destinations: [],
      package: {}
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    if (
      this.props.isOpen &&
      this.context.selectedItem &&
      this.context.selectedItem.id !== this.state.package.id
    ) {
      // build destinations
      let destinations = [];

      this.context.selectedItem.articles.forEach(item => {
        if (item.route) {
          let tenantUrl = item.tenant.subdomain
            ? item.tenant.subdomain + "." + item.tenant.domain_name
            : item.tenant.domain_name;

          destinations.push({
            tenant: item.tenant,
            route: item.route,
            is_published_fbia: item.is_published_fbia,
            status: item.status,
            updated_at: item.updated_at,
            paywall_secured: item.paywall_secured,
            content_lists: item.content_lists,
            seo_metadata: item.seo_metadata,
            slug: item.slug,
            live_url:
              item.status === "published"
                ? "http://" + tenantUrl + item._links.online.href
                : null
          });
        }
      });

      this.setState({
        destinations,
        package: this.context.selectedItem
      });
    }
  }

  setDestinations = destinations => this.setState({ destinations });

  switchTab = type => this.setState({ tab: type, isMetadataOpen: false });

  render() {
    return (
      <div className="sd-publish-panel">
        <div className="side-panel side-panel--shadow-right side-panel--dark-ui">
          <div className="side-panel__header">
            <div className="side-panel__tools">
              <a
                className="icn-btn"
                onClick={() => this.context.actions.togglePublish(null)}
              >
                <i className="icon-close-small"></i>
              </a>
            </div>
            <ul className="nav-tabs nav-tabs--ui-dark">
              <li
                className={classNames("nav-tabs__tab", {
                  "nav-tabs__tab--active": this.state.tab === "publish"
                })}
              >
                <button
                  onClick={() => this.switchTab("publish")}
                  className="nav-tabs__link"
                >
                  <span>Publish</span>
                </button>
              </li>
              {this.context.selectedItem &&
              this.context.selectedItem.status !== "new" ? (
                <li
                  className={classNames("nav-tabs__tab", {
                    "nav-tabs__tab--active": this.state.tab === "unpublish"
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
            <Publish destinations={this.state.destinations} />
          ) : (
            <Unpublish
              destinations={this.state.destinations}
              setDestinations={destinations =>
                this.setDestinations(destinations)
              }
            />
          )}
        </div>

        <div
          ng-include="'article-preview.html'"
          ng-if="webPublisherOutput.openArticlePreviewModal"
        ></div>
      </div>
    );
  }
}

PublishPane.propTypes = {
  isOpen: PropTypes.bool.isRequired
};

export default PublishPane;
