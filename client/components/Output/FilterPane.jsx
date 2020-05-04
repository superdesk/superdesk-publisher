import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { Button, IconButton } from "superdesk-ui-framework/react";

import MultiSelect from "../UI/MultiSelect";
import Store from "./Store";

class FilterPane extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      routes: [],
      authors: [],
      filters: { route: [], author: [] },
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (!this.state.authors.length) {
      this.loadAuthors();
    }

    if (this.context.tenants.length && !this.state.routes.length) {
      this.prepareRoutes();
    }
  }

  prepareRoutes = () => {
    let routes = [];

    this.context.tenants.map((tenant) => {
      let newRoutes = [...tenant.routes].map((route) => {
        route.name = tenant.name + " / " + route.name;
        return route;
      });
      routes = [...routes, ...newRoutes];
    });
    this.setState({ routes });
  };

  loadAuthors = (page = 1) => {
    this.context.api.users
      .query({
        max_results: 200,
        page: page,
        sort: '[("first_name", 1), ("last_name", 1)]',
        where: {
          is_support: { $ne: true },
        },
      })
      .then((response) => {
        let authors = response._items.filter((item) => item.is_author);

        if (this._isMounted && authors.length)
          this.setState({ authors: [...this.state.authors, ...authors] });

        if (response._links.next) this.loadAuthors(page + 1);
      });
  };

  handleAuthorChange = (arr) => {
    let filters = { ...this.state.filters };

    filters.author = arr ? arr : [];
    this.setState({ filters });
  };

  handleRoutesChange = (arr) => {
    let filters = { ...this.state.filters };

    filters.route = arr ? arr : [];
    this.setState({ filters });
  };

  handleInputChange = (e, a) => {
    let { name, value } = e.target;
    let filters = { ...this.state.filters };

    filters[name] = value;
    this.setState({ filters });
  };

  clear = () => {
    this.setState({ filters: { route: [], author: [] } }, this.save);
  };

  save = () => {
    let filters = _.pickBy({ ...this.state.filters }, _.identity);
    this.context.actions.setFilters(filters);
  };

  render() {
    let routesOptions = [];

    this.state.routes.map((route) => {
      routesOptions.push({
        value: parseInt(route.id),
        label: route.name,
      });
    });

    let authorsOptions = [];

    this.state.authors.map((author) => {
      authorsOptions.push({
        value: author.display_name,
        label: author.display_name,
      });
    });

    return (
      <Store.Consumer>
        {({ selectedList, listViewType }) => (
          <div
            className={classNames(
              "sd-filters-panel sd-filters-panel--border-right",
              {
                "sd-flex-no-shrink":
                  selectedList === "published" && listViewType === "swimlane",
              }
            )}
          >
            <div className="side-panel side-panel--transparent side-panel--shadow-right">
              <div className="side-panel__header side-panel__header--border-b">
                <span className="side-panel__close">
                  <IconButton
                    icon="close-small"
                    tooltip={{ text: "Close", flow: "left" }}
                    onClick={this.props.toggle}
                  />
                </span>
                <h3 className="side-panel__heading side-panel__heading--big">
                  Advanced Filter
                </h3>
              </div>
              <div className="side-panel__content">
                <div className="side-panel__content-block">
                  <div className="form__row">
                    <div className="sd-line-input sd-line-input--no-margin sd-line-input--with-button">
                      <label className="sd-line-input__label">Routes</label>
                      <MultiSelect
                        onSelect={(values) => this.handleRoutesChange(values)}
                        options={routesOptions}
                        selectedOptions={this.state.filters.route}
                      />
                    </div>
                  </div>
                  <div className="form__row">
                    <div className="sd-line-input sd-line-input--no-margin sd-line-input--with-button">
                      <label className="sd-line-input__label">Authors</label>
                      <MultiSelect
                        onSelect={(values) => this.handleAuthorChange(values)}
                        options={authorsOptions}
                        selectedOptions={this.state.filters.author}
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
                  <div className="form__row">
                    <div className="sd-line-input sd-line-input--no-margin">
                      <label className="sd-line-input__label">
                        Ingest source
                      </label>
                      <input
                        className="sd-line-input__input"
                        type="text"
                        onChange={this.handleInputChange}
                        name="source"
                        value={
                          this.state.filters.source
                            ? this.state.filters.source
                            : ""
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="side-panel__footer side-panel__footer--button-box">
                <div className="flex-grid flex-grid--boxed-small flex-grid--small-2">
                  <Button text="Clear" style="hollow" onClick={this.clear} />
                  <Button text="Filter" type="primary" onClick={this.save} />
                </div>
              </div>
            </div>
          </div>
        )}
      </Store.Consumer>
    );
  }
}

FilterPane.propTypes = {
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default FilterPane;
