import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import _ from "lodash";
import { Button, IconButton, DatePicker, MultiSelect, TreeSelect } from "superdesk-ui-framework/react";

import Store from "./Store";

class FilterPane extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      routes: [],
      authors: [],
      ingestSources: { items: [], loading: false },
      filters: {
        route: [],
        author: [],
        source: [],
        published_before: null,
        published_after: null,
      },
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (!this.state.ingestSources.items.length) {
      this.loadIngestSources();
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

  loadIngestSources = (page = 1) => {
    if (this.state.ingestSources.loading) return;
    this.setState({
      ingestSources: { ...this.state.ingestSources, loading: true },
    });

    this.context.api.ingestProviders
      .query({ max_results: 200, page: page })
      .then((response) => {
        let ingestSources = response._items;

        if (this._isMounted && ingestSources.length)
          this.setState(
            {
              ingestSources: {
                items: [...this.state.ingestSources.items, ...ingestSources],
                loading: false,
              },
            },
            () => {
              if (response._links.next) this.loadIngestSources(page + 1);
            }
          );
      });
  };

  loadAuthors = (inputValue = null, callback = null) => {
    if (inputValue && inputValue.length < 2) callback(this.state.authors);

    this.props.publisher
      .queryAuthors({ term: inputValue, limit: 30 })
      .then((response) => {
        let authorsOptions = [];

        response._embedded._items.forEach((item) => {
          authorsOptions.push({
            value: {
              value: item.id,
              label: item.name,
            }
          });
        });

        this.setState({ authors: authorsOptions });
        callback(authorsOptions);
      })
      .catch((err) => {
        callback(this.state.authors);
      });

    return () => { };
  };

  handleAuthorChange = (arr) => {
    let filters = { ...this.state.filters };

    filters.author = arr ? arr : [];
    this.setState({ filters });
  };

  handleSourceChange = (arr) => {
    let filters = { ...this.state.filters };

    filters.source = arr ? arr : [];
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
    this.setState(
      {
        filters: {
          route: [],
          author: [],
          source: [],
          published_before: null,
          published_after: null,
        },
      },
      this.save
    );
  };

  save = () => {
    this.context.actions.setFilters(this.state.filters);
  };

  render() {
    let routesOptions = [];

    this.state.routes.map((route) => {
      routesOptions.push({
        value: {
          value: parseInt(route.id),
          label: route.name,
        },
        label: route.name
      });
    });

    let ingestSourceOptions = [];

    this.state.ingestSources.items.map((source) => {
      ingestSourceOptions.push({
        value: {
          value: source.name,
          label: source.name,
        },
        label: source.name
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
            <div className="side-panel side-panel--shadow-right">
              <div className="side-panel__header side-panel__header--border-b side-panel__header--has-close">
                <div className="side-panel__header-wrapper">
                  <div className="side-panel__header-inner">
                    <h3 className="side-panel__heading side-panel__heading--big">
                      Advanced Filter
                    </h3>
                  </div>
                  <div className="button-group button-group--end button-group--no-space side-panel__btn-group">
                    <IconButton
                      icon="close-small"
                      tooltip={{ text: "Close", flow: "left" }}
                      onClick={this.props.toggle}
                    />
                  </div>
                </div>
              </div>
              <div className="side-panel__content">
                <div className="side-panel__content-block">
                  <div className="form__row form__row--flex">
                    <div className="sd-line-input sd-line-input--no-margin sd-line-input--with-button sd-padding-t--0">
                      <MultiSelect
                        label="Routes"
                        onChange={(values) => this.handleRoutesChange(values)}
                        options={routesOptions}
                        optionLabel={(option) => option.label}
                        value={this.state.filters.route}
                        emptyFilterMessage="No routes found"
                      />
                    </div>
                  </div>
                  <div className="form__row form__row--flex">
                    <div className="sd-line-input sd-line-input--no-margin sd-line-input--with-button sd-padding-t--0">
                      <TreeSelect
                        label="Authors"
                        kind="asynchronous"
                        value={this.state.filters.author}
                        getLabel={(item) => item.label}
                        getId={(item) => item}
                        allowMultiple={true}
                        searchOptions={this.loadAuthors}
                        onChange={(values) => this.handleAuthorChange(values)}
                      />
                    </div>
                  </div>
                  <div className="form__row form__row--flex">
                    <div className="sd-line-input sd-line-input--no-margin form__row-item">
                      <label className="sd-line-input__label">
                        Published after
                      </label>
                      <DatePicker
                        value={
                          this.state.filters.published_after
                            ? moment(
                              this.state.filters.published_after,
                              "YYYY-MM-DD"
                            ).toDate()
                            : null
                        }
                        dateFormat="YYYY-MM-DD"
                        onChange={(date) => {
                          let stringDate = moment(date).format("YYYY-MM-DD");

                          this.handleInputChange({
                            target: {
                              name: "published_after",
                              value: stringDate,
                            },
                          });
                        }}
                      />
                    </div>

                    <div className="form__row-item sd-line-input sd-line-input--no-margin">
                      <label className="sd-line-input__label">
                        Published before
                      </label>
                      <DatePicker
                        value={
                          this.state.filters.published_before
                            ? moment(
                              this.state.filters.published_before,
                              "YYYY-MM-DD"
                            ).toDate()
                            : null
                        }
                        dateFormat="YYYY-MM-DD"
                        onChange={(date) => {
                          let stringDate = moment(date).format("YYYY-MM-DD");

                          this.handleInputChange({
                            target: {
                              name: "published_before",
                              value: stringDate,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="form__row">
                    <div className="sd-line-input">
                      <label className="sd-line-input__label">
                        Ingest source
                      </label>
                      <MultiSelect
                        onChange={(values) => this.handleSourceChange(values)}
                        options={ingestSourceOptions}
                        optionLabel={(option) => option.label}
                        value={this.state.filters.source}
                        filterPlaceholder="No options found"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="side-panel__footer side-panel__footer--button-box">
                <Button text="Clear" style="hollow" onClick={this.clear} />
                <Button text="Filter" type="primary" onClick={this.save} />
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
  publisher: PropTypes.object.isRequired,
};

export default FilterPane;
