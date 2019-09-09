import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Store from "./Store";

import SearchBar from "../UI/SearchBar";
import Subnav from "./Subnav";
import FilterPane from "./FilterPane";
import ArticlePreview from "../generic/ArticlePreview";

class Output extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      tenants: [],
      loading: false, // should be true
      articles: { incoming: [], published: [] },
      articlesCount: { incoming: 0, published: 0 },
      previewItem: null,
      filters: {},
      selectedList: window.localStorage.getItem("swpOutputListType")
        ? window.localStorage.getItem("swpOutputListType")
        : "incoming",
      listViewType: "normal", //swimlane, normal
      isPublishPaneOpen: false,
      isPreviewPaneOpen: false,
      isFilterPaneOpen: window.localStorage.getItem("swpOutputFilterOpen")
        ? JSON.parse(window.localStorage.getItem("swpOutputFilterOpen"))
        : false
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  toggleFilterPane = () => {
    this.setState({ isFilterPaneOpen: !this.state.isFilterPaneOpen }, () => {
      window.localStorage.setItem(
        "swpOutputFilterOpen",
        this.state.isFilterPaneOpen
      );
    });
  };

  togglePreview = item =>
    this.setState({
      isPreviewPaneOpen: !this.state.isPreviewPaneOpen,
      previewItem: item ? item : null
    });

  toggleListViewType = () => {
    this.setState({
      listViewType: this.state.listViewType === "normal" ? "swimlane" : "normal"
    });
  };

  setSelectedList = listType => this.setState({ selectedList: listType });

  render() {
    return (
      <Store.Provider
        value={{
          publisher: this.props.publisher,
          notify: this.props.notify,
          isSuperdeskEditorOpen: this.props.isSuperdeskEditorOpen,
          config: this.props.config,
          selectedList: this.state.selectedList,
          listViewType: this.state.listViewType,
          actions: {
            togglePreview: item => this.togglePreview(item),
            toggleListViewType: this.toggleListViewType,
            setSelectedList: listType => this.setSelectedList(listType)
          }
        }}
      >
        <div
          className={classNames(
            "sd-page-content__content-block sd-page-content__content-block--double-sidebar",
            {
              "open-filters": this.state.isFilterPaneOpen,
              "open-preview": this.state.isPreviewPaneOpen,
              "open-publish": this.state.isPublishPaneOpen
            }
          )}
        >
          <div className="subnav">
            <button
              className={classNames("navbtn navbtn--left navbtn--darker", {
                "navbtn--active": this.state.isFilterPaneOpen
              })}
              onClick={this.toggleFilterPane}
              sd-tooltip="Filter"
              flow="right"
            >
              <i className="icon-filter-large" />
            </button>
            <h3 className="subnav__page-title sd-flex-no-grow">
              Output Control
            </h3>
            <SearchBar leftBorder={true} onChange={() => null} />
          </div>
          <Subnav articlesCount={this.state.articlesCount} />
          {this.state.loading && <div className="sd-loader" />}
          <div className="sd-column-box--3">
            <FilterPane
              toggle={this.toggleFilterPane}
              isOpen={this.state.isFilterPaneOpen}
            />

            {/* <div
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
            /> */}

            <ArticlePreview
              article={
                this.state.previewItem && this.state.previewItem.content
                  ? this.state.previewItem.content
                  : this.state.previewItem
              }
              close={this.togglePreview}
            />
            <div
              className="sd-publish-panel"
              ng-include="'publishing-pane.html'"
            />
          </div>
        </div>
      </Store.Provider>
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
