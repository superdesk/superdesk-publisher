import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import SearchBar from "../UI/SearchBar";
import Subnav from "./Subnav";

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
            <SearchBar leftBorder={true} />
          </div>
          <Subnav />
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
  isSuperdeskEditorOpen: PropTypes.bool.isRequired,
  config: PropTypes.object.isRequired
};

export default Output;
