import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import helpers from "../../../services/helpers.js";
import VirtualizedList from "../../generic/VirtualizedList";
import Store from "../Store";

import ArticleItem from "./ArticleItem";

class TenantBoard extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.queryLimit = 20;

    this.state = {
      filters: {},
      loading: true,
      articles: {
        items: [],
        page: 0,
        totalPages: 1,
        loading: true,
        itemSize: 56,
      },
      totalArticles: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.context.publisher.setToken().then(this._queryArticles);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate() {
    if (!_.isEqual(this.context.filters, this.state.filters)) {
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
    }
  }

  buildQueryParams = () => {
    let queryParams = {
      page: this.state.articles.page + 1,
      limit: this.queryLimit,
      "status[]": [],
    };

    // route
    let route = [];
    if (this.state.filters.route) {
      this.state.filters.route.forEach((routeObj) => {
        let checkIfRouteFromCurrentTenant = this.props.tenant.routes.find(
          (route) => route.id === routeObj.value
        );

        if (checkIfRouteFromCurrentTenant) route.push(routeObj.value);
      });
    }

    // authors
    let author = [];
    if (this.state.filters.author) {
      this.state.filters.author.forEach((ath) => {
        author.push(ath.value);
      });
    }
    queryParams["author[]"] = author.length ? author : null;

    // other
    if (this.state.filters.source && this.state.filters.source.length) {
      queryParams["source[]"] = this.state.filters.source;
    }

    if (this.state.filters.term && this.state.filters.term.length) {
      queryParams.term = this.state.filters.term;
    }

    queryParams["status[]"] = ["published", "unpublished"];
    queryParams["tenant[]"] = [this.props.tenant.code];
    queryParams["route[]"] = route.length ? route : null;
    queryParams.published_before = this.state.filters.published_before
      ? this.state.filters.published_before
      : null;
    queryParams.published_after = this.state.filters.published_after
      ? this.state.filters.published_after
      : null;

    queryParams["sorting[updated_at]"] = "desc";

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

        articles.items = [...articles.items, ...newArticles];
        articles.loading = false;
        articles.page = response.page;
        articles.totalPages = response.pages;

        if (this._isMounted) {
          this.setState({
            articles,
            loading: false,
            totalArticles: response.total,
          });
        }
      })
      .catch((err) => {
        if (this._isMounted) {
          articles.loading = false;
          this.setState({ articles, loading: false });
          this.context.notify.error("Cannot load articles");
        }
      });
  };

  render() {
    return (
      <div className="sd-kanban-list__board sd-kanban-list__board--wide">
        <div className="sd-kanban-list__board-header">
          <div className="sd-list-header">
            <span className="sd-list-header__name">
              {this.props.tenant.name}
            </span>
            <span className="sd-list-header__number badge">
              {this.state.totalArticles}
            </span>
          </div>
        </div>
        <div
          className="sd-kanban-list__board-content relative"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {this.state.loading && <div className="sd-loader" />}
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
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

TenantBoard.propTypes = {
  tenant: PropTypes.object.isRequired,
};

export default TenantBoard;
