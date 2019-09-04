import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import SearchBar from "../UI/SearchBar";

class Output extends React.Component {
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
    return (
      <React.Fragment>
        <div
          className="sd-page-content__content-block sd-page-content__content-block--double-sidebar"
          ng-className="{'open-filters': webPublisherOutput.filterOpen, 'open-preview': webPublisherOutput.previewOpen, 'open-publish': webPublisherOutput.publishOpen}"
        >
          <div className="subnav">
            <button
              className="navbtn navbtn--left navbtn--darker"
              ng-click="webPublisherOutput.toggleFilterPane()"
              ng-className="{'navbtn--active': webPublisherOutput.filterOpen}"
              sd-tooltip="Filter"
              flow="right"
            >
              <i className="icon-filter-large" />
            </button>
            <h3 className="subnav__page-title sd-flex-no-grow">
              Output Control
            </h3>
            <SearchBar />
          </div>
          <div className="subnav subnav--lower-z-index">
            <div
              className="subnav__content-bar"
              ng-hide="superdesk.flags.authoring"
            >
              <sd-check
                ng-model="webPublisherOutput.listType"
                type="radio"
                ng-value="incoming"
                label-position="inside"
                ng-disabled="webPublisherOutput.loadingArticles"
              >
                Incoming content
              </sd-check>
              <sd-check
                ng-model="webPublisherOutput.listType"
                type="radio"
                ng-value="published"
                label-position="inside"
                ng-disabled="webPublisherOutput.loadingArticles"
              >
                Published
              </sd-check>
            </div>
            <div
              className="subnav__content-bar"
              ng-show="superdesk.flags.authoring"
            >
              <sd-check
                ng-model="webPublisherOutput.listType"
                type="radio"
                ng-value="incoming"
                label-position="inside"
                ng-disabled="webPublisherOutput.loadingArticles"
                sd-tooltip="Incoming content"
                flow="right"
              >
                <i className="icon-ingest" />
              </sd-check>
              <sd-check
                ng-model="webPublisherOutput.listType"
                type="radio"
                ng-value="published"
                label-position="inside"
                ng-disabled="webPublisherOutput.loadingArticles"
                sd-tooltip="Published"
                flow="right"
              >
                <i className="icon-expand-thin" />
              </sd-check>
            </div>
            <div className="subnav__spacer subnav__spacer--no-margin" />
            <div
              className="subnav__content-bar sd-flex-wrap ml-auto sd-padding-l--1"
              ng-className="{'sd-margin-r--1': superdesk.flags.authoring}"
            >
              <div className="sd-margin-r--1">
                <span>Incoming:</span>
                <span className="badge sd-margin-l--0-5">
                  webPublisherOutput.articlesCount.incoming
                </span>
              </div>
              <div>
                <span>Published:</span>
                <span className="badge sd-margin-l--0-5">
                  webPublisherOutput.articlesCount.published
                </span>
              </div>
            </div>
            <div
              className="subnav__spacer subnav__spacer--no-margin"
              ng-show="webPublisherOutput.listType == 'published'  !webPublisherOutput.swimlaneView"
            />
            <div
              className="subnav__content-bar sd-flex-no-shrink"
              ng-className="{'sd-margin-l--1 sd-margin-r--1': superdesk.flags.authoring}"
              ng-show="webPublisherOutput.listType == 'published'  !webPublisherOutput.swimlaneView"
            >
              <div
                className="dropdown dropdown--align-right"
                dropdown=""
                ng-show="webPublisherOutput.listType == 'published' !webPublisherOutput.swimlaneView"
              >
                <button
                  className="dropdown__toggle dropdown-toggle"
                  dropdown-toggle=""
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  webPublisherOutput.filterByTenant.name || 'All Tenants'
                  <span className="dropdown__caret" />
                </button>
                <ul className="dropdown__menu dropdown__menu--scrollable">
                  <li>
                    <button ng-click="webPublisherOutput.filterByTenant=null">
                      All Tenants
                    </button>
                  </li>
                  <li className="dropdown__menu-divider" />
                  <li ng-repeat="tenant in webPublisherOutput.sites">
                    <button ng-click="webPublisherOutput.filterByTenant=tenant">
                      tenant.name
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <button
              className="navbtn"
              ng-click="webPublisherOutput.swimlaneView = !webPublisherOutput.swimlaneView; webPublisherOutput.leftFilterOpen = false"
              ng-show="webPublisherOutput.listType == 'published'"
            >
              <i
                className="icon-kanban-view ng-hide"
                ng-show="webPublisherOutput.swimlaneView"
              />
              <i
                className="icon-list-view"
                ng-hide="webPublisherOutput.swimlaneView"
              />
            </button>
          </div>
          {this.state.loading && <div className="sd-loader" />}
          <div className="sd-column-box--3">
            <div
              className="sd-filters-panel sd-filters-panel--border-right"
              ng-className="{'sd-flex-no-shrink': webPublisherOutput.listType == 'published' && webPublisherOutput.swimlaneView}"
            >
              <div
                className="side-panel side-panel--transparent side-panel--shadow-right"
                ng-include="'filter-pane.html'"
              />
            </div>

            <div
              className="sd-column-box__main-column relative"
              ng-if="!webPublisherOutput.loading"
              ng-show="webPublisherOutput.listType == 'incoming'"
              sd-group-article
              data-root-type="incoming"
              data-web-publisher-output="webPublisherOutput"
              data-filters="webPublisherOutput.advancedFilters"
            />

            <div
              className="sd-column-box__main-column relative"
              ng-if="!webPublisherOutput.loading"
              ng-show="webPublisherOutput.listType == 'published'   !webPublisherOutput.swimlaneView"
              sd-group-article
              data-root-type="published"
              data-site="webPublisherOutput.filterByTenant"
              data-web-publisher-output="webPublisherOutput"
              data-filters="webPublisherOutput.advancedFilters"
            />

            <div
              className="sd-column-box__main-column"
              ng-if="webPublisherOutput.listType == 'published' webPublisherOutput.swimlaneView"
              ng-include="'output/swimlane.html'"
            />

            <div className="sd-preview-panel" ng-include="'preview-pane.html'">
              <div
                className="sd-publish-panel"
                ng-include="'publishing-pane.html'"
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Output.propTypes = {
  publisher: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  editorOpen: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired
};

export default Output;
