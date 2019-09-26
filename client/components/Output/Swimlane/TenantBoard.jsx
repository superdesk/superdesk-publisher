import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import helpers from "../../../services/helpers.js";
import VirtualizedList from "../../generic/VirtualizedList";

import Store from "../Store";

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
        itemSize: 56
      }
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
            itemSize: 56
          }
        },
        this._queryArticles
      );
    }
  }

  buildQueryParams = () => {
    let queryParams = {
      page: this.state.articles.page + 1,
      limit: this.queryLimit,
      "status[]": []
    };

    // tenant
    let tenant = [];
    if (this.state.filters.tenant) {
      tenant.push(this.state.filters.tenant.code);
    }

    // route
    let route = [];
    if (this.state.filters.route) {
      this.state.filters.route.forEach(routeObj => {
        route.push(routeObj.value);
      });
    }

    // authors
    let author = [];
    if (this.state.filters.author) {
      this.state.filters.author.forEach(ath => {
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

    if (this.props.type === "incoming") {
      queryParams["status[]"] = ["new"];
    } else {
      queryParams["status[]"] = ["published", "unpublished"];
      queryParams["tenant[]"] = tenant.length ? tenant : null;
      queryParams["route[]"] = route.length ? route : null;
      queryParams.published_before = this.state.filters.publishedBefore
        ? this.state.filters.publishedBefore
        : null;
      queryParams.published_after = this.state.filters.publishedAfter
        ? this.state.filters.publishedAfter
        : null;
    }
    queryParams["sorting[updatedAt]"] = "desc";

    return _.pickBy(queryParams, _.identity);
  };

  _queryArticles = () => {
    let queryParams = this.buildQueryParams();
    let articles = { ...this.state.articles };

    articles.loading = true;
    this.setState({ articles });

    this.context.publisher
      .queryMonitoringArticles(queryParams)
      .then(response => {
        let newArticles = response._embedded._items;

        if (this.context.selectedList === "published") {
          newArticles.forEach(item => {
            item.comments_count = helpers.countComments(item.articles);
            item.page_views_count = helpers.countPageViews(item.articles);
            item.articles.forEach(item => {
              if (item.route && item.status == "published" && item.tenant) {
                let tenantUrl = item.tenant.subdomain
                  ? item.tenant.subdomain + "." + item.tenant.domain_name
                  : item.tenant.domain_name;
                item.live_url = "http://" + tenantUrl + item._links.online.href;
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
      .catch(err => {
        articles.loading = false;
        this.setState({ articles, loading: false });
        this.context.notify.error("Cannot load articles");
      });
  };

  render() {
    return (
      <div className="sd-kanban-list__board sd-kanban-list__board--wide">
        <div className="sd-kanban-list__board-header">
          <div className="sd-list-header">
            <span className="sd-list-header__name">site.name</span>
            <span
              ng-if="totalArticles.total"
              className="sd-list-header__number badge"
            >
              totalArticles.total
            </span>
          </div>
        </div>
        <div className="sd-kanban-list__board-content">
          <div className="sd-list-item-group sd-shadow--z1"></div>
        </div>
      </div>
    );
  }
}

TenantBoard.propTypes = {
  tenant: PropTypes.object.isRequired
};

export default TenantBoard;
