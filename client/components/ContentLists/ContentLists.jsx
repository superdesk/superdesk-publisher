import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import SitesSideNav from "../generic/SitesSideNav";
import Listing from "./Listing";

class ContentLists extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      loading: true,
      sites: [],
      selectedSite: {},
      lists: [],
      tenantsNavOpen: true,
      currentView: "list"
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

    this.setState(
      {
        selectedSite: site
      },
      this._getLists
    );
  };

  _getLists = () => {
    this.setState({ loading: true }, () => {
      return this.props.publisher.queryLists().then(lists => {
        if (this._isMounted) this.setState({ lists, loading: false });
      });
    });
  };

  onListDelete = id => {
    let lists = [...this.state.lists];
    let index = lists.findIndex(list => list.id === id);

    if (index > -1) {
      delete lists[index];

      this.setState({ lists });
    }
  };

  toggleTenantsNav = () => {
    let tenantsNavOpen = !this.state.tenantsNavOpen;
    this.setState({ tenantsNavOpen });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.loading && <div className="sd-loader" />}
        <div
          className={classNames("sd-page-content__content-block", {
            "sd-page-content__content-block--double-sidebar": false, // activeView != content-lists ???
            "open-filters": false, // wiadomo
            "open-preview": false //wiadomo
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
              Content Lists
              {this.state.selectedSite && (
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

            {this.state.currentView === "list" && (
              <Listing
                lists={this.state.lists}
                publisher={this.props.publisher}
                onListDelete={id => this.onListDelete(id)}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ContentLists.propTypes = {
  tenant: PropTypes.string,
  publisher: PropTypes.object.isRequired
};

export default ContentLists;
