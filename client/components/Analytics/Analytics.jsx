import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import _ from "lodash";

import SitesSideNav from "../generic/SitesSideNav";
import FiltersPanel from "./FiltersPanel";
import Listing from "./Listing";
import SortingOptions from "./SortingOptions";
import Reports from "./Reports/Reports";

class Analytics extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      loading: true,
      tenantsNavOpen: false,
      filters: {
        sort: "published_at",
        order: "desc"
      },
      filtersOpen: false,
      activeView: "listing",
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
      filters: {
        sort: "published_at",
        order: "desc"
      }
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
      params[
        "sorting[" + this.state.filters.sort + "]"
      ] = this.state.filters.order;
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

  changeActiveView = type => this.setState({ activeView: type });

  generateReport = filters => {
    let reportFilters = {};

    if (filters.published_after) {
      reportFilters.start = filters.published_after;
    }

    if (filters.published_before) {
      reportFilters.end = filters.published_before;
    }

    if (filters.author && filters.author.length) {
      reportFilters.authors = [];
      filters.author.map(a => reportFilters.authors.push(a.value));
    }

    if (filters.route) {
      reportFilters.routes = [
        {
          id: filters.route
        }
      ];
    }

    this.props.publisher
      .generateAnalyticsReport(reportFilters)
      .then(response => {
        this.props.api.notify.success(
          "You fired report generation. Please note: the process takes some time. The link for generated report will be sent via email. Once generatet the report will be available in Reports History list."
        );
        // this is ugly...
        this.setState({ activeView: null }, () =>
          this.setState({ activeView: "reports" })
        );
      })
      .catch(err => {
        this.props.api.notify.error("Cannot generate report");
      });
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
              href="#/publisher"
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
                  <span className="sd-check__wrapper">
                    <span
                      className={classNames(
                        "sd-checkbox sd-checkbox--button-style sd-checkbox--radio",
                        { checked: this.state.activeView === "listing" }
                      )}
                      onClick={() => this.changeActiveView("listing")}
                    >
                      <label>Analytics</label>
                    </span>
                  </span>
                  <span className="sd-check__wrapper">
                    <span
                      className={classNames(
                        "sd-checkbox sd-checkbox--button-style sd-checkbox--radio",
                        { checked: this.state.activeView === "reports" }
                      )}
                      onClick={() => this.changeActiveView("reports")}
                    >
                      <label>Reports History</label>
                    </span>
                  </span>
                  {this.state.activeView === "listing" && (
                    <div className="subnav__content-bar sd-flex-wrap ml-auto sd-padding-l--1">
                      <SortingOptions
                        filters={this.state.filters}
                        setFilters={this.setFilters}
                      />
                    </div>
                  )}
                </div>

                <div className="sd-column-box--3">
                  <FiltersPanel
                    toggle={this.toggleFilters}
                    filters={this.state.filters}
                    setFilters={filters => this.setFilters(filters)}
                    routes={this.state.routes}
                    api={this.props.api}
                    generateReport={this.generateReport}
                  />

                  {this.state.activeView === "reports" ? (
                    <Reports publisher={this.props.publisher} />
                  ) : (
                    <Listing
                      articles={this.state.articles}
                      loading={this.state.loading}
                      queryArticles={this._queryArticles}
                    />
                  )}
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
  publisher: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired
};

export default Analytics;
