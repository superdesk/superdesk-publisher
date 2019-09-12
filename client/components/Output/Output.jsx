import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Store from "./Store";

import SearchBar from "../UI/SearchBar";
import Subnav from "./Subnav";
import FilterPane from "./FilterPane";
import Listing from "./Listing";
import ArticlePreview from "../generic/ArticlePreview";

class Output extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      tenants: [],
      loading: true,

      articlesCounts: { incoming: 0, published: 0 },
      selectedItem: null,
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
    this.props.publisher
      .setToken()
      .then(() => this.props.publisher.querySites(true, true))
      .then(tenants => {
        if (this._isMounted) this.setState({ tenants, loading: false });
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.isSuperdeskEditorOpen !== prevProps.isSuperdeskEditorOpen
      && this.props.isSuperdeskEditorOpen) {
      this.togglePreview(null);
      this.togglePublish(null);
    }
  }

  setFilters = filters => {
    this.setState({ filters });
  }

  setArticlesCounts = articlesCounts => {
    this.setState({ articlesCounts });
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
      isPreviewPaneOpen: item ? !this.state.isPreviewPaneOpen : false,
      selectedItem: item ? item : null
    });

  togglePublish = item =>
    this.setState({
      isPublishPaneOpen: item ? !this.state.isPublishPaneOpen : false,
      selectedItem: item ? item : null
    });

  toggleListViewType = () => {
    this.togglePreview(null);
    this.togglePublish(null);
    this.setState({
      listViewType: this.state.listViewType === "normal" ? "swimlane" : "normal"
    });
  };

  setSelectedList = listType => {
    this.togglePreview(null);
    this.togglePublish(null);
    this.setState({ selectedList: listType });
  }

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
          tenants: this.state.tenants,
          filters: this.state.filters,
          articlesCounts: this.state.articlesCounts,
          actions: {
            togglePreview: item => this.togglePreview(item),
            toggleListViewType: this.toggleListViewType,
            setSelectedList: listType => this.setSelectedList(listType),
            setFilters: filters => this.setFilters(filters),
            setArticlesCounts: counts => this.setArticlesCounts(counts)
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
          <Subnav />
          {this.state.loading && <div className="sd-loader" />}
          <div className="sd-column-box--3">
            <FilterPane
              toggle={this.toggleFilterPane}
              isOpen={this.state.isFilterPaneOpen}
            />
            <Listing type="incoming" show={this.state.selectedList === "incoming" ? true : false} />
            <Listing type="published" show={this.state.selectedList === "published" ? true : false} />
            <ArticlePreview
              article={
                this.state.selectedItem && this.state.selectedItem.content
                  ? this.state.selectedItem.content
                  : this.state.selectedItem
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
