import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import _ from "lodash";

import SitesSideNav from "../generic/SitesSideNav";
import Listing from "./Listing";
import AutomaticList from "./Automatic/Automatic";
import ManualList from "./Manual/Manual";
import PreviewPane from "./PreviewPane";

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
      selectedList: null,
      filtersOpen: false,
      previewOpen: false,
      previewItem: null
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

  listEdit = list =>
    this.setState({
      selectedList: list,
      filtersOpen: list.type === "automatic" ? true : false
    });

  cancelListEdit = () =>
    this.setState({
      selectedList: null,
      filtersOpen: false,
      previewOpen: false
    });

  _getLists = () => {
    this.setState({ loading: true }, () => {
      return this.props.publisher.queryLists().then(lists => {
        let selectedList = null;

        if (this.props.list) {
          let list = lists.find(l => l.id === parseInt(this.props.list));
          if (list) selectedList = list;
        }

        lists = _.orderBy(lists, "name", "asc");

        if (this._isMounted)
          this.setState({
            lists,
            loading: false,
            selectedList,
            filtersOpen:
              selectedList && selectedList.type === "automatic" ? true : false
          });
      });
    });
  };

  onListDelete = id => {
    let lists = [...this.state.lists];
    let index = lists.findIndex(list => list.id === id);

    if (index < 0) {
      index = lists.findIndex(list => typeof list.id === "undefined");
    }

    if (index > -1) {
      lists.splice(index, 1);
      this.setState({ lists });
    }
  };

  onListUpdate = updatedList => {
    let lists = [...this.state.lists];
    let index = lists.findIndex(list => list.id === updatedList.id);
    let selectedList = { ...this.state.selectedList };

    if (selectedList.id === updatedList.id) {
      selectedList = updatedList;
    }

    if (index > -1) {
      lists[index] = updatedList;
    }

    this.setState({ lists, selectedList });
  };

  onListCreated = newList => {
    let lists = [...this.state.lists];
    let oldIndex = lists.findIndex(list => typeof list.id === "undefined");

    if (oldIndex > -1) {
      lists.splice(oldIndex, 1);
    }

    lists.unshift(newList);

    this.setState({ lists });
  };

  toggleTenantsNav = () =>
    this.setState({ tenantsNavOpen: !this.state.tenantsNavOpen });

  toggleFilters = () => this.setState({ filtersOpen: !this.state.filtersOpen });

  openPreview = item => this.setState({ previewOpen: true, previewItem: item });
  closePreview = () => this.setState({ previewOpen: false, previewItem: null });

  addList = type => {
    let list = {
      name: "",
      type: type,
      cache_life_time: 0
    };

    this.setState({ lists: [list, ...this.state.lists] });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.loading && <div className="sd-loader" />}
        <div
          className={classNames("sd-page-content__content-block", {
            "sd-page-content__content-block--double-sidebar": this.state
              .selectedList,
            "open-filters": this.state.filtersOpen,
            "open-preview": this.state.previewOpen
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

            {!this.state.selectedList && (
              <Listing
                lists={this.state.lists}
                publisher={this.props.publisher}
                onListDelete={id => this.onListDelete(id)}
                onListCreated={list => this.onListCreated(list)}
                addList={type => this.addList(type)}
                listEdit={list => this.listEdit(list)}
              />
            )}

            {this.state.selectedList &&
              this.state.selectedList.type === "automatic" && (
                <AutomaticList
                  list={this.state.selectedList}
                  lists={this.state.lists}
                  publisher={this.props.publisher}
                  listEdit={list => this.listEdit(list)}
                  onEditCancel={this.cancelListEdit}
                  onListUpdate={list => this.onListUpdate(list)}
                  toggleFilters={this.toggleFilters}
                  openPreview={item => this.openPreview(item)}
                  previewItem={this.state.previewItem}
                  filtersOpen={this.state.filtersOpen}
                  api={this.props.api}
                />
              )}

            {this.state.selectedList &&
              this.state.selectedList.type === "manual" && (
                <ManualList
                  list={this.state.selectedList}
                  lists={this.state.lists}
                  publisher={this.props.publisher}
                  listEdit={list => this.listEdit(list)}
                  onEditCancel={this.cancelListEdit}
                  onListUpdate={list => this.onListUpdate(list)}
                  toggleFilters={this.toggleFilters}
                  openPreview={item => this.openPreview(item)}
                  previewItem={this.state.previewItem}
                  filtersOpen={this.state.filtersOpen}
                  api={this.props.api}
                  isLanguagesEnabled={this.props.isLanguagesEnabled}
                  languages={this.props.languages}
                  site={this.state.selectedSite}
                />
              )}

            <PreviewPane
              article={
                this.state.previewItem && this.state.previewItem.content
                  ? this.state.previewItem.content
                  : this.state.previewItem
              }
              close={this.closePreview}
              publisher={this.props.publisher}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ContentLists.propTypes = {
  tenant: PropTypes.string,
  list: PropTypes.string,
  publisher: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
  isLanguagesEnabled: PropTypes.bool.isRequired,
  languages: PropTypes.array.isRequired
};

export default ContentLists;
