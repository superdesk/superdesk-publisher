
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import VirtualizedList from "../generic/VirtualizedList";
import ArticleItem from "./ArticleItem";
import Store from "./Store";

class Listing extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      articles: {
        items: [],
        page: 0,
        totalPages: 1,
        loading: true,
        itemSize: 50
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

  buildQueryParams = () => {
    let queryParams = {
      page: this.state.articles.page + 1,
      limit: 20,
      "status[]": []
    };

    // let route = scope.buildRouteParams();
    // let tenant = scope.buildTenantParams();
    // let universal = scope.buildUniversalParams();

    // queryParams = Object.assign(queryParams, universal);


    if (this.props.type === "incoming") {
      queryParams["status[]"] = ["new"];
      queryParams["sorting[created_at]"] = "desc";
    } else {
      queryParams["status[]"] = ["published", "unpublished"];
      // queryParams["tenant[]"] = tenant.length ? tenant : undefined;
      // queryParams["route[]"] = route.length ? route : undefined;
      // queryParams.published_before = scope.filters.publishedBefore;
      // queryParams.published_after = scope.filters.publishedAfter;
      queryParams["sorting[updated_at]"] = "desc";
    }
    return queryParams;
  };

  _queryArticles = () => {
    let queryParams = this.buildQueryParams();
    let articles = { ...this.state.articles };
    articles.loading = true;
    this.setState({ articles });

    this.context.publisher
      .queryMonitoringArticles(queryParams)
      .then(response => {
        // let newArticles = response._embedded._items;
        // if (scope.rootType === "published") {
        //   angular.forEach(newArticles, item => {
        //     item.comments_count = publisherHelpers.countComments(
        //       item.articles
        //     );
        //     item.pageviewsCount = publisherHelpers.countPageViews(
        //       item.articles
        //     );
        //     angular.forEach(item.articles, item => {
        //       if (item.route && item.status == "published") {
        //         let tenantUrl = item.tenant.subdomain
        //           ? item.tenant.subdomain + "." + item.tenant.domain_name
        //           : item.tenant.domain_name;
        //         item.live_url =
        //           "http://" + tenantUrl + item._links.online.href;
        //       }
        //     });
        //   });
        // }

        let articlesCounts = { ...this.context.articlesCounts };
        articlesCounts[this.props.type] = response.total;
        this.context.actions.setArticlesCounts(articlesCounts);

        articles.items = [...articles.items, ...response._embedded._items];
        articles.loading = false;

        this.setState({ articles });
      })
      .catch(err => {
        articles.loading = false;
        this.setState({ articles });
        this.context.notify.error(
          "Cannot load articles"
        );
      });
  };

  render() {
    if (!this.props.show) return null;
    return (
      <div className="sd-column-box__main-column sd-list-item-group sd-shadow--z2">
        {this.state.articles.items.length && (
          <VirtualizedList
            hasNextPage={
              this.state.articles.totalPages >
                this.state.articles.page
                ? true
                : false
            }
            isNextPageLoading={this.state.articles.loading}
            loadNextPage={this._queryArticles}
            items={this.state.articles.items}
            itemSize={this.state.articles.itemSize}
            ItemRenderer={ArticleItem}
          />
        )}

        {!this.state.articles.items.length && (
          <div className="panel-info">
            <div className="panel-info__icon">
              <i className="big-icon--text"></i>
            </div>
            <h3 className="panel-info__heading">No {this.props.type} articles.</h3>
          </div>
        )}
      </div>
    );
  }
}

Listing.propTypes = {
  type: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired
};

export default Listing;
