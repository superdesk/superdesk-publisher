import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import SitesSideNav from "../generic/SitesSideNav";
import FiltersPanel from "./FiltersPanel";
import VirtualizedList from "../generic/VirtualizedList";
import ArticleItem from "./ArticleItem";

class Analytics extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      loading: true,
      tenantsNavOpen: false,
      filters: {},
      filtersOpen: false,
      sites: [],
      routes: [],
      selectedSite: null,
      articles: {}
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.props.publisher
      .setToken()
      .then(this.props.publisher.querySites)
      .then(sites => {
        let tenantsNavOpen = sites.length > 1 ? true : false;
        this.setState({ sites, tenantsNavOpen });

        if (this.props.tenant) {
          let site = sites.find(site => site.code === this.props.tenant);
          if (site) this.setTenant(site);
        } else if (sites[0]) {
          this.setTenant(sites[0]);
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setTenant = site => {
    this.props.publisher.setTenant(site);
    let articles = {
      items: [],
      page: 0,
      totalPages: 1,
      loading: false,
      itemSize: 50
    };
    this.setState({
      selectedSite: site,
      articles,
      loading: false,
      filters: {}
    });
    this._queryRoutes();
  };

  _queryRoutes = () => {
    this.props.publisher.queryRoutes({ type: "collection" }).then(routes => {
      if (this._isMounted) this.setState({ routes });
    });
  };

  _queryArticles = () => {
    let articles = this.state.articles;
    articles.loading = true;
    this.setState({ articles }, () => {
      let params = {};
      params.limit = 20;
      params["sorting[published_at]"] = "desc";
      params.status = "published";
      params.page = this.state.articles.page + 1;

      if (this.state.filters.author && this.state.filters.author.length) {
        params["author[]"] = this.state.filters.author;
      }

      if (this.state.filters.route && this.state.filters.route.length) {
        params["route[]"] = this.state.filters.route;
      }

      if (
        this.state.filters.published_before &&
        this.state.filters.published_before.length
      ) {
        params.published_before = this.state.filters.published_before;
      }

      if (
        this.state.filters.published_after &&
        this.state.filters.published_after.length
      ) {
        params.published_after = this.state.filters.published_after;
      }

      this.props.publisher.queryTenantArticles(params).then(response => {
        let articles = {
          page: response.page,
          totalPages: response.pages,
          items: [...this.state.articles.items, ...response._embedded._items],
          loading: false,
          itemSize: this.state.articles.itemSize
        };
        if (this._isMounted) this.setState({ articles });
      });
    });
  };

  toggleTenantsNav = () => {
    let tenantsNavOpen = !this.state.tenantsNavOpen;
    this.setState({ tenantsNavOpen });
  };

  toggleFilters = () => {
    let filtersOpen = !this.state.filtersOpen;
    let articles = { ...this.state.articles };
    articles.itemSize = filtersOpen ? 100 : 50;
    this.setState({ filtersOpen, articles });
  };

  setFilters = filters => {
    let articles = {
      items: [],
      page: 0,
      totalPages: 1,
      loading: false,
      itemSize: 100
    };

    this.setState({ loading: true }, () =>
      this.setState({ filters, articles, loading: false })
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.state.loading && <div className="sd-loader" />}

        <div
          className={classNames("sd-page-content__content-block", {
            "open-filters": this.state.filtersOpen
          })}
        >
          <div className="subnav">
            <a
              href="#/publisher/dashboard"
              className="navbtn navbtn--left"
              sd-tooltip="Dashboard"
              flow="right"
            >
              <i className="icon-arrow-left" />
            </a>
            <h3 className="subnav__page-title">
              Content Analytics
              {this.state.selectedSite && this.state.selectedSite.name && (
                <span> / {this.state.selectedSite.name}</span>
              )}
            </h3>
          </div>
          <div
            className={classNames("sd-column-box--3", {
              "content-nav-closed": !this.state.tenantsNavOpen
            })}
          >
            <SitesSideNav
              sites={this.state.sites}
              selectedSite={this.state.selectedSite}
              setTenant={site => this.setTenant(site)}
              toggle={this.toggleTenantsNav}
              open={this.state.tenantsNavOpen}
            />
            <div className="flex-grid flex-grid--grow flex-grid--small-1">
              <div className="flex-grid__item flex-grid__item--d-flex flex-grid__item--column">
                <div className="subnav subnav--lower-z-index">
                  <button
                    className={classNames(
                      "navbtn navbtn--left navbtn--darker",
                      { "navbtn--active": this.state.filtersOpen }
                    )}
                    onClick={this.toggleFilters}
                  >
                    <i className="icon-filter-large" />
                  </button>
                </div>

                <div className="sd-column-box--3">
                  <FiltersPanel
                    toggle={this.toggleFilters}
                    filters={this.state.filters}
                    setFilters={filters => this.setFilters(filters)}
                    routes={this.state.routes}
                  />
                  <div className="sd-column-box__main-column-inner sd-d-flex">
                    <div
                      className="sd-flex-table sd-table--shadowed sd-table--action-hover"
                      style={{ flexGrow: "1", position: "relative" }}
                    >
                      <div className="sd-flex-table__row sd-flex-table--head">
                        <div className="sd-flex-table__cell sd-flex-grow">
                          <div>Title</div>
                        </div>
                        <div className="sd-flex-table__cell">&nbsp;</div>
                        <div className="sd-flex-table__cell">
                          <div>Page Views</div>
                        </div>
                        <div className="sd-flex-table__cell">
                          <div>Click Rate</div>
                        </div>
                        <div className="sd-flex-table__cell">
                          <div>Impressions</div>
                        </div>
                      </div>
                      {!this.state.loading && (
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
                          heightSubtract={46}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Analytics.propTypes = {
  tenant: PropTypes.string,
  publisher: PropTypes.object.isRequired
};

export default Analytics;
