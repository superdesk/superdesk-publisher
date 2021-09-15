import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { gettext } from "../../superdeskApi";
import helpers from "../../services/helpers.js";
import VirtualizedList from "../generic/VirtualizedList";
import ArticleItem from "./ArticleItem";
import Store from "./Store";

class Listing extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.queryLimit = 20;

    this.state = {
      filters: { sort: "updated_at", order: "desc" },
      loading: true,
      articles: {
        items: [],
        page: 0,
        totalPages: 1,
        loading: true,
        itemSize: 56,
      },
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.context.publisher.setToken().then(this._queryArticles);

    document.addEventListener("newPackage", this.handleNewPackageEvent, false);
    document.addEventListener("refreshOutputLists", this.resetList, false);
  }

  componentWillUnmount() {
    this._isMounted = false;

    document.removeEventListener(
      "newPackage",
      this.handleNewPackageEvent,
      false
    );
    document.removeEventListener("refreshOutputLists", this.resetList, false);
  }

  componentDidUpdate() {
    if (!_.isEqual(this.context.filters, this.state.filters)) {
      this.resetList();
    }
  }

  resetList = () => {
    this.setState(
      {
        filters: this.context.filters,
        loading: true,
        articles: {
          items: [],
          page: 0,
          totalPages: 1,
          loading: true,
          itemSize: 56,
        },
      },
      this._queryArticles
    );
  };

  handleNewPackageEvent = (e) => {
    let item = e.detail.newPackage;
    let state = e.detail.state;

    if (this.props.type === "incoming" && item.status === "published") {
      this.removeArticle(item.id);
    }

    if (this.props.type === "incoming" && item.status === "new") {
      this.addUpdateArticle(item, state);
    }

    if (
      this.props.type === "published" &&
      (item.status === "published" || item.status === "unpublished")
    ) {
      this.addUpdateArticle(item, state);
    }
  };

  updateArticlesCounts = (value) => {
    let articlesCounts = { ...this.context.articlesCounts };
    articlesCounts[this.props.type] = articlesCounts[this.props.type] + value;
    this.context.actions.setArticlesCounts(articlesCounts);
  };

  removeArticle = (itemId) => {
    let articles = [...this.state.articles];

    let index = articles.items.findIndex((el) => el.id === itemId);

    if (index > -1) {
      articles.items.splice(index, 1);
      this.setState({ articles });
      this.updateArticlesCounts(-1);
    }
  };

  addUpdateArticle = (item, state) => {
    item.animate = true;

    let articles = { ...this.state.articles };

    if (state === "update") {
      //update
      let elIndex = articles.items.findIndex((el) => el.guid === item.guid);
      if (elIndex !== -1) {
        articles.items[elIndex] = item;
      }
    } else {
      //new article
      articles.items = [item, ...articles.items];
      if (articles.items.length % this.queryLimit === 0) {
        articles.items.splice(-1, 1);
      }
      this.updateArticlesCounts(1);
    }

    this.setState({ articles });
  };

  buildQueryParams = () => {
    let queryParams = {
      page: this.state.articles.page + 1,
      limit: this.queryLimit,
      "status[]": [],
    };

    // tenant
    let tenant = [];
    if (this.state.filters.tenant) {
      tenant.push(this.state.filters.tenant.code);
    }

    // route
    let route = [];
    if (this.state.filters.route && this.state.filters.route.length) {
      this.state.filters.route.forEach((routeObj) => {
        route.push(routeObj.value);
      });
    }

    // authors
    let author = [];
    if (this.state.filters.author && this.state.filters.author.length) {
      this.state.filters.author.forEach((ath) => {
        author.push(ath.value);
      });
    }
    queryParams["author[]"] = author.length ? author : null;

    // source
    let source = [];
    if (this.state.filters.source) {
      this.state.filters.source.forEach((ath) => {
        source.push(ath.value);
      });
    }
    queryParams["source[]"] = source.length ? source : null;

    if (this.state.filters.language && this.state.filters.language.length) {
      queryParams.language = this.state.filters.language;
    }

    if (this.state.filters.term && this.state.filters.term.length) {
      queryParams.term = this.state.filters.term;
    }

    if (this.props.type === "incoming") {
      queryParams["status[]"] = ["new"];
    } else {
      queryParams["status[]"] = ["published", "unpublished"];
      queryParams["tenant[]"] = tenant.length ? tenant : null;
      queryParams["route[]"] = route.length ? route : null;
      queryParams.published_before = this.state.filters.published_before
        ? this.state.filters.published_before
        : null;
      queryParams.published_after = this.state.filters.published_after
        ? this.state.filters.published_after
        : null;
    }
    queryParams[
      "sorting[" + this.state.filters.sort + "]"
    ] = this.state.filters.order;

    return _.pickBy(queryParams, _.identity);
  };

  _queryArticles = () => {
    let queryParams = this.buildQueryParams();
    let articles = { ...this.state.articles };

    articles.loading = true;
    this.setState({ articles });

    this.context.publisher
      .queryMonitoringArticles(queryParams)
      .then((response) => {
        let newArticles = response._embedded._items;

        if (this.context.selectedList === "published") {
          newArticles.forEach((item) => {
            item.comments_count = helpers.countComments(item.articles);
            item.page_views_count = helpers.countPageViews(item.articles);
            item.articles.forEach((item) => {
              if (item.route && item.status == "published" && item.tenant) {
                let tenantUrl =
                  item.tenant &&
                  item.tenant.pwa_config &&
                  item.tenant.pwa_config.url
                    ? item.tenant.pwa_config.url
                    : item.tenant.subdomain
                    ? "https://" +
                      item.tenant.subdomain +
                      "." +
                      item.tenant.domain_name
                    : "https://" + item.tenant.domain_name;
                item.live_url = tenantUrl + item._links.online.href;
              }
            });
          });
        }

        let articlesCounts = { ...this.context.articlesCounts };
        articlesCounts[this.props.type] = response.total;
        this.context.actions.setArticlesCounts(articlesCounts);

        articles.items = [...articles.items, ...newArticles];
        articles.loading = false;
        articles.page = response.page;
        articles.totalPages = response.pages;

        this.setState({ articles, loading: false });
      })
      .catch((err) => {
        articles.loading = false;
        this.setState({ articles, loading: false });
        this.context.notify.error(gettext("Cannot load articles"));
      });
  };

  handleRemove = (id) => {
    let articles = { ...this.state.articles };
    articles.items = [...this.state.articles.items];
    let index = articles.items.findIndex((item) => item.id === id);

    if (index > -1) {
      articles.items = [
        ...articles.items.slice(0, index),
        ...articles.items.slice(index + 1, articles.items.length),
      ];

      let articlesCounts = { ...this.context.articlesCounts };
      articlesCounts.incoming = articlesCounts.incoming - 1;
      this.context.actions.setArticlesCounts(articlesCounts);
    }
    this.setState({ articles });
  };

  render() {
    if (this.props.hide) return null;

    return (
      <div
        className="sd-column-box__main-column relative"
        style={this.state.articles.items.length ? { display: "flex" } : {}}
      >
        {this.state.articles.items.length && !this.state.loading ? (
          <div
            className="sd-list-item-group sd-shadow--z2"
            style={{ flexGrow: "1" }}
          >
            <VirtualizedList
              hasNextPage={
                this.state.articles.totalPages > this.state.articles.page
                  ? true
                  : false
              }
              isNextPageLoading={this.state.articles.loading}
              loadNextPage={this._queryArticles}
              items={this.state.articles.items}
              itemSize={this.state.articles.itemSize}
              ItemRenderer={ArticleItem}
              itemRendererProps={{
                onRemove: (id) => this.handleRemove(id),
              }}
            />
          </div>
        ) : null}

        {!this.state.articles.items.length &&
        !this.state.loading &&
        !this.state.articles.loading ? (
          <div className="panel-info">
            <div className="panel-info__icon">
              <i className="big-icon--text"></i>
            </div>
            <h3 className="panel-info__heading">
              {gettext("No {{type}} articles.", {type: this.props.type})}
            </h3>
          </div>
        ) : null}

        {this.state.loading && (
          <div className="sd-loader" style={{ zIndex: "1" }} />
        )}
      </div>
    );
  }
}

Listing.propTypes = {
  type: PropTypes.string.isRequired,
  hide: PropTypes.bool,
};

export default Listing;
