import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Store from "./Store";

import SearchBar from "../UI/SearchBar";
import Subnav from "./Subnav";
import FilterPane from "./FilterPane";
import PublishPane from "./PublishPane/PublishPane";
import Listing from "./Listing";
import ArticlePreview from "../generic/ArticlePreview";
import Swimlane from "./Swimlane/Swimlane";

import Websocket from "../../services/websocket";

class Output extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      tenants: [],
      loading: true,
      articlesCounts: { incoming: 0, published: 0 },
      selectedItem: null,
      isSuperdeskEditorOpen: false,
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

    document.addEventListener(
      "isSuperdeskEditorOpen",
      this.handleEditorOpenChange,
      false
    );

    this.websocket = new Websocket(
      this.props.config,
      this.props.publisher,
      (newPackage, state) => this.newPackageEventHandler(newPackage, state)
    );
    this.websocket.open();
  }

  componentWillUnmount() {
    this._isMounted = false;
    document.removeEventListener(
      "isSuperdeskEditorOpen",
      this.handleEditorOpenChange,
      false
    );
    this.websocket.close();
  }

  newPackageEventHandler = (newPackage, state) => {
    let event = new CustomEvent("newPackage", {
      detail: { newPackage: newPackage, state: state }
    });
    document.dispatchEvent(event);
  };

  handleEditorOpenChange = e => {
    if (this.state.isSuperdeskEditorOpen !== e.detail && e.detail) {
      this.togglePreview(null);
      this.togglePublish(null);
    }
    this.setState({ isSuperdeskEditorOpen: e.detail });
  };

  setFilters = filters => {
    this.setState({ filters: { ...this.state.filters, ...filters } });
  };

  setArticlesCounts = articlesCounts => {
    this.setState({ articlesCounts });
  };

  toggleFilterPane = () => {
    this.setState({ isFilterPaneOpen: !this.state.isFilterPaneOpen }, () => {
      window.localStorage.setItem(
        "swpOutputFilterOpen",
        this.state.isFilterPaneOpen
      );
    });
  };

  togglePreview = (item = null) => {
    this.setState(
      {
        isPreviewPaneOpen: item ? true : false
      },
      () => this.setSelectedItem(item)
    );
  };

  togglePublish = (item = null) => {
    this.setState(
      {
        isPublishPaneOpen: item ? true : false
      },
      () => this.setSelectedItem(item)
    );
  };

  setSelectedItem = item => {
    if (item) {
      this.setState({ selectedItem: item });
    } else if (!this.state.isPreviewPaneOpen && !this.state.isPublishPaneOpen) {
      this.setState({ selectedItem: null });
    }
  };

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
    window.localStorage.setItem("swpOutputListType", listType);
    this.setState({ selectedList: listType });
  };

  correctPackage = item => {
    let newItem = {};

    newItem._id = item.guid;
    this.props.authoringWorkspace.edit(newItem, "correct");
  };

  render() {
    let selectedItemSlideshows = [];

    if (this.state.selectedItem && this.state.selectedItem.extra_items) {
      this.state.selectedItem.extra_items.forEach((element, index) => {
        if (element.type === "media") {
          selectedItemSlideshows.push({
            id: element.id + index,
            items: element.items
          });
        }
      });
    }

    return (
      <Store.Provider
        value={{
          publisher: this.props.publisher,
          notify: this.props.notify,
          api: this.props.api,
          isSuperdeskEditorOpen: this.state.isSuperdeskEditorOpen,
          config: this.props.config,
          selectedList: this.state.selectedList,
          selectedItem: this.state.selectedItem,
          listViewType: this.state.listViewType,
          tenants: this.state.tenants,
          filters: this.state.filters,
          articlesCounts: this.state.articlesCounts,
          actions: {
            togglePreview: item => this.togglePreview(item),
            togglePublish: item => this.togglePublish(item),
            toggleListViewType: () => this.toggleListViewType(),
            setSelectedList: listType => this.setSelectedList(listType),
            setFilters: filters => this.setFilters(filters),
            setArticlesCounts: counts => this.setArticlesCounts(counts),
            correctPackage: item => this.correctPackage(item)
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
            <SearchBar
              leftBorder={true}
              onChange={term => this.setFilters({ term: term })}
            />
          </div>
          <Subnav />
          {this.state.loading && <div className="sd-loader" />}
          <div className="sd-column-box--3">
            <FilterPane
              toggle={this.toggleFilterPane}
              isOpen={this.state.isFilterPaneOpen}
            />
            <Listing
              type="incoming"
              hide={this.state.selectedList === "incoming" ? false : true}
            />
            <Listing
              type="published"
              hide={
                this.state.selectedList === "published" &&
                this.state.listViewType !== "swimlane"
                  ? false
                  : true
              }
            />
            {this.state.selectedList === "published" &&
              this.state.listViewType === "swimlane" && <Swimlane />}
            <ArticlePreview
              article={
                this.state.selectedItem
                  ? {
                      feature_media:
                        this.state.selectedItem.articles[0] &&
                        this.state.selectedItem.articles[0].feature_media
                          ? this.state.selectedItem.articles[0].feature_media
                          : null,
                      media:
                        this.state.selectedItem.articles[0] &&
                        this.state.selectedItem.articles[0].media
                          ? this.state.selectedItem.articles[0].media
                          : null,
                      tenant: this.state.selectedItem.articles[0]
                        ? this.state.selectedItem.articles[0].tenant
                        : null,
                      updated_at: this.state.selectedItem.updated_at,
                      article_statistics: {
                        page_views_number: this.state.selectedItem
                          .page_views_count
                      },
                      comments_count: this.state.selectedItem.comments_count,
                      title: this.state.selectedItem.headline,
                      body: this.state.selectedItem.body_html,
                      slideshows: selectedItemSlideshows,
                      source: "package",
                      status: this.state.selectedItem.status,
                      paywall_secured: this.state.selectedItem.articles[0]
                        ? this.state.selectedItem.articles[0].paywall_secured
                        : false,
                      articles: this.state.selectedItem.articles
                    }
                  : null
              }
              close={() => this.togglePreview(null)}
            />

            <PublishPane isOpen={this.state.isPublishPaneOpen} />
          </div>
        </div>
      </Store.Provider>
    );
  }
}

Output.propTypes = {
  publisher: PropTypes.object.isRequired,
  notify: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  authoringWorkspace: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired
};

export default Output;
