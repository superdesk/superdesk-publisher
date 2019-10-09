import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Store from "../Store";

class Publish extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {};
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (!this.context.selectedItem) return null;
    return (
      <React.Fragment>
        <div className="side-panel__content">
          <div className="side-panel__content-block side-panel__content-block--pad-small">
            <div className="side-panel__content-block-heading side-panel__content-block-heading--small-margin">
              {this.context.selectedItem.headline}
            </div>
          </div>
          <div className="side-panel__content-block side-panel__content-block--flex side-panel__content-block--space-between">
            <div className="dropdown" dropdown="">
              <button
                className="btn btn--primary btn--icon-only-circle btn--large dropdown__toggle"
                sd-tooltip="Add destination"
                flow="right"
                dropdown__toggle=""
              >
                <i className="icon-plus-large"></i>
              </button>
              <ul className="dropdown__menu">
                <li ng-repeat="site in webPublisherOutput.publishingAvailableSites">
                  <button ng-click="webPublisherOutput.publishingAddDestination(site)">
                    site.name
                  </button>
                </li>
              </ul>
            </div>
            <div ng-init="webPublisherOutput.publishFilter = 'all'">
              <sd-check
                ng-model="webPublisherOutput.publishFilter"
                type="radio"
                ng-value="all"
                label-position="inside"
              >
                All
              </sd-check>
              <sd-check
                ng-model="webPublisherOutput.publishFilter"
                type="radio"
                ng-value="published"
                label-position="inside"
              >
                Published
              </sd-check>
              <sd-check
                ng-model="webPublisherOutput.publishFilter"
                type="radio"
                ng-value="unpublished"
                label-position="inside"
              >
                Unpublished
              </sd-check>
            </div>
          </div>
          <div className="side-panel__content-block side-panel__content-block--pad-small">
            <div
              ng-repeat="destination in webPublisherOutput.newDestinations"
              ng-include="'publish-pane-listitem.html'"
            ></div>
          </div>

          <div className="side-panel__content-block">
            <div
              data-title="Related articles"
              data-open="true"
              data-style="circle"
              ng-hide="!webPublisherOutput.relatedArticles.length && !webPublisherOutput.relatedArticlesLoading"
            >
              {/* <div
                    className="sd-loader"
                    ng-if="webPublisherOutput.relatedArticlesLoading"
                  ></div> */}
              <ul className="simple-list simple-list--dotted simple-list--no-padding">
                <li
                  className="simple-list__item"
                  ng-repeat="article in webPublisherOutput.relatedArticles"
                >
                  <p>article.title</p>
                  <span
                    ng-repeat="destination in webPublisherOutput.newDestinations"
                    className="label-icon"
                    ng-class="{'label-icon--success': webPublisherOutput._isTenantWithinTenants(destination.tenant.code, article.tenants)}"
                  >
                    <i className="icon-globe"></i> destination.tenant.name
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="side-panel__content-block-overlay-grid"
          ng-class="{'side-panel__content-block-overlay-grid--open' : webPublisherOutput.metaDataOverlayOpen}"
          ng-if="webPublisherOutput.activePublishPane === 'publish'"
          ng-include="'output/metaDataOverlay.html'"
        ></div>
        <div
          className="side-panel__footer side-panel__footer--button-box-large"
          ng-if="!webPublisherOutput.activePublishPane || webPublisherOutput.activePublishPane === 'publish'"
        >
          <button
            className="btn btn--large btn--success btn--expanded"
            ng-disabled="webPublisherOutput._isEmpty(webPublisherOutput.newDestinations)"
            ng-click="webPublisherOutput.publishArticle()"
          >
            Publish
          </button>
        </div>
      </React.Fragment>
    );
  }
}

Publish.propTypes = {};

export default Publish;
