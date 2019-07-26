import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import _ from "lodash";

import helpers from "../../../services/helpers.js";

import MultiSelect from "../../UI/MultiSelect/MultiSelect";

class FilterPanel extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      filters: { metadata: [], route: [], author: [] },
      routes: [],
      authors: []
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.props.publisher.queryRoutes({ type: "collection" }).then(routes => {
      if (this._isMounted) {
        this.setState({ routes }, this.prepareFilters);
      }
    });

    this.loadUsers();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.filters, prevProps.filters)) {
      this.prepareFilters();
    }
  }

  loadUsers = (page = 1) => {
    this.props.api.users
      .query({
        max_results: 200,
        page: page,
        sort: '[("first_name", 1), ("last_name", 1)]',
        where: {
          is_support: { $ne: true },
          is_active: true,
          is_enabled: true,
          needs_activation: false
        }
      })
      .then(response => {
        let authors = response._items.filter(item => item.is_author);

        if (this._isMounted && authors.length)
          this.setState({ authors: [...this.state.authors, ...authors] });

        if (response._links.next) this.loadUsers(page + 1);
      });
  };

  prepareFilters = () => {
    let filters = { ...this.props.filters };

    let newRoute = [];
    filters.route.map(id => {
      let routeObj = this.state.routes.find(route => route.id === id);
      if (routeObj) newRoute.push({ value: routeObj.id, label: routeObj.name });
    });
    filters.route = newRoute;

    let newMetadata = [];
    Object.entries(filters.metadata).forEach(([key, value]) => {
      newMetadata.push({ key: key, value: value });
    });
    filters.metadata = newMetadata;

    if (!filters.author) filters.author = [];

    this.setState({ filters });
  };

  save = () => {
    let updatedFilters = _.pickBy(this.state.filters, _.identity);

    updatedFilters.metadata = {};
    this.metadataList.forEach(item => {
      if (item.metaName) {
        updatedFilters.metadata[item.metaName] = item.metaValue;
      }
    });

    delete updatedFilters.route;
    if (this.selectedRoutes.length > 0) {
      updatedFilters.route = [];
      this.selectedRoutes.forEach(item => {
        updatedFilters.route.push(item.id);
      });
    }
    $scope.loading = true;

    publisher
      .manageList({ filters: updatedFilters }, this.selectedList.id)
      .then(response => {
        let index = $scope.lists.findIndex(el => el.id === response.id);
        if (index > -1) {
          $scope.lists[index] = response;
        }
        $scope.loading = false;
        $scope.$broadcast("refreshListArticles", $scope.newList);
      })
      .catch(err => {
        if (err.status === 409) {
          notify.error("Cannot save. List has been modified by another user");
          this.reloadSelectedList();
          this.listChangeFlag = false;
        } else {
          notify.error("Something went wrong. Try again.");
          $scope.loading = false;
        }
      });
  };

  clear = () => {
    this.setState({ filters: { metadata: [], route: [], author: [] } });
  };

  handleInputChange = (e, a) => {
    let { name, value } = e.target;
    let filters = { ...this.state.filters };

    filters[name] = value;
    this.setState({ filters });
  };

  authorAdd = () => {
    let author = [...this.state.filters.author];

    author.push("");
    this.setState({ filters: { ...this.state.filters, author: author } });
  };

  handleAuthorChange = index => evt => {
    const newAuthor = this.state.filters.author.map((author, idx) => {
      if (index !== idx) return author;
      return evt.target.value;
    });

    let filters = { ...this.state.filters };

    filters.author = newAuthor;
    this.setState({ filters });
  };

  authorDelete = index => {
    let author = [...this.state.filters.author];

    delete author[index];
    this.setState({ filters: { ...this.state.filters, author: author } });
  };

  render() {
    return (
      <div className="sd-filters-panel sd-filters-panel--border-right">
        <div className="side-panel side-panel--transparent side-panel--shadow-right">
          <div className="side-panel__header side-panel__header--border-b">
            <a
              className="icn-btn side-panel__close"
              sd-tooltip="Close filters"
              flow="left"
              onClick={this.props.toggle}
            >
              <i className="icon-close-small" />
            </a>
            <h3 className="side-panel__heading side-panel__heading--big">
              Automatic List Criteria
            </h3>
          </div>
          <div className="side-panel__content">
            {/* <div className="sd-loader" ng-if="loading" /> */}
            <div className="side-panel__content-block">
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin sd-line-input--is-select">
                  <label className="sd-line-input__label">Categories</label>
                  {/* <MultiSelect
                    onSelect={() => null}
                    options={[]}
                    selectedOptions={[]}
                  /> */}
                </div>
              </div>
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin">
                  <label className="sd-line-input__label">Author</label>
                  {this.state.filters.author.map((value, index) => (
                    <div
                      className="grid"
                      key={"author" + index}
                      style={{ padding: "0" }}
                    >
                      <div
                        className="grid__item grid__item--col-10"
                        style={{ paddingLeft: "0" }}
                      >
                        <input
                          className="sd-line-input__input"
                          type="text"
                          onChange={this.handleAuthorChange(index)}
                          name={"author" + index}
                          value={value}
                        />
                      </div>
                      <div className="grid__item grid__item--col-2">
                        <button
                          type="button"
                          className="btn btn--alert btn--small btn--icon-only btn--hollow"
                          onClick={() => this.authorDelete(index)}
                        >
                          <i className="icon-close-small" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn btn--primary btn--icon-only margin--top"
                    onClick={this.authorAdd}
                    sd-tooltip="Add author"
                    flow="right"
                  >
                    <i className="icon-plus-large" />
                  </button>
                </div>
              </div>
              <div className="form__row form__row--flex">
                <div className="sd-line-input sd-line-input--no-margin">
                  <label className="sd-line-input__label">Published date</label>
                  <input
                    className="sd-line-input__input"
                    type="date"
                    onChange={this.handleInputChange}
                    name="published_at"
                    value={
                      this.state.filters.published_at
                        ? this.state.filters.published_at
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="form__row form__row--flex">
                <div className="sd-line-input sd-line-input--no-margin">
                  <label className="sd-line-input__label">
                    Published after
                  </label>
                  <input
                    className="sd-line-input__input"
                    type="date"
                    onChange={this.handleInputChange}
                    name="published_after"
                    value={
                      this.state.filters.published_after
                        ? this.state.filters.published_after
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="form__row form__row--flex">
                <div className="sd-line-input sd-line-input--no-margin">
                  <label className="sd-line-input__label">
                    Published before
                  </label>
                  <input
                    className="sd-line-input__input"
                    type="date"
                    onChange={this.handleInputChange}
                    name="published_before"
                    value={
                      this.state.filters.published_before
                        ? this.state.filters.published_before
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="form__row form__row--flex">
                <div className="sd-line-input">
                  <label className="sd-line-input__label">Metadata</label>
                  <div
                    ng-repeat="item in webPublisherContentLists.metadataList"
                    className="grid"
                  >
                    <div className="grid__item grid__item--col-5">
                      <input
                        className="sd-line-input__input"
                        type="text"
                        ng-model="item.metaName"
                        placeholder="Name"
                      />
                    </div>
                    <div className="grid__item grid__item--col-5">
                      <input
                        className="sd-line-input__input"
                        type="text"
                        ng-model="item.metaValue"
                        placeholder="Value"
                      />
                    </div>
                    <div className="grid__item grid__item--col-2">
                      <button
                        type="button"
                        className="btn btn--alert btn--small btn--icon-only btn--hollow"
                        ng-click="webPublisherContentLists.removeMetadata($index)"
                        tooltip="{{:: 'Remove'|translate}}"
                        tooltip-placement="bottom"
                        tooltip-popup-delay="500"
                      >
                        <i className="icon-close-small" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn--primary btn--icon-only margin--top"
                    ng-click="webPublisherContentLists.addMetadata()"
                    sd-tooltip="{{:: 'Add metadata'|translate}}"
                    flow="right"
                  >
                    <i className="icon-plus-large" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="side-panel__footer side-panel__footer--button-box">
            <div className="flex-grid flex-grid--boxed-small flex-grid--small-2">
              <a className="btn btn--hollow" onClick={this.clear}>
                Clear
              </a>
              <a className="btn btn--primary" onClick={this.save}>
                Update Criteria
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FilterPanel.propTypes = {
  toggle: PropTypes.func.isRequired,
  publisher: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  onFiltersSave: PropTypes.func,
  api: PropTypes.func.isRequired
};

export default FilterPanel;
