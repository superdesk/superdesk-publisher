import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import moment from "moment";
import { Button, IconButton, MultiSelect, TreeSelect } from "superdesk-ui-framework/react";
import { DatePicker } from "superdesk-ui-framework/react";

class FiltersPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: props.filters ? props.filters : { route: [], author: [] },
      authors: [],
      dateFilterType: "range",
    };
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.filters, prevProps.filters)) {
      let filters = { ...this.props.filters };
      let newRoutes = [];

      if (filters.routes && filters.routes.length) {
        filters.routes.forEach((item) => {
          let route = this.props.routes.find((a) => a.id === item);

          if (route) {
            newRoutes.push({
              value: route.id,
              label: route.name,
            });
          }
        });

        filters.routes = newRoutes;
      }

      this.setState({ filters: filters });
    }
  }

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

  handleInputChange = (e) => {
    let { name, value } = e.target;
    let filters = { ...this.state.filters };

    filters[name] = value;
    this.setState({ filters });
  };

  handleRouteChange = (arr) => {
    let filters = { ...this.state.filters };

    filters.routes = arr ? arr : [];
    this.setState({ filters });
  };

  clear = () => {
    this.setState({ dateFilterType: "range", filters: {} });
    this.props.setFilters({});
  };

  save = () => {
    let filters = { ...this.state.filters };
    let newRoutes = [];

    if (filters.routes && filters.routes.length) {
      filters.routes.map((item) => {
        newRoutes.push(item.value);
      });

      filters.routes = newRoutes;
    }

    this.props.setFilters(filters);
  };

  shouldAllowReportGeneration = () => {
    let filters = { ...this.state.filters };

    if (filters.published_after && filters.published_before) {
      return true;
    }
    return false;
  };

  handleDateFilterTypeChange = (e) => {
    let type = e.target.value;
    let published_after = "";
    let published_before = "";

    // 2020-02-04

    if (type === "thisWeek") {
      published_after = moment().startOf("isoWeek").format("YYYY-MM-DD");
      published_before = moment().format("YYYY-MM-DD");
    } else if (type === "thisMonth") {
      published_after = moment().startOf("month").format("YYYY-MM-DD");
      published_before = moment().format("YYYY-MM-DD");
    } else if (type === "lastWeek") {
      published_after = moment()
        .subtract(1, "weeks")
        .startOf("isoWeek")
        .format("YYYY-MM-DD");
      published_before = moment()
        .subtract(1, "weeks")
        .endOf("isoWeek")
        .format("YYYY-MM-DD");
    } else if (type === "lastMonth") {
      published_after = moment()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD");
      published_before = moment()
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD");
    }

    let filters = { ...this.state.filters };
    filters.published_after = published_after;
    filters.published_before = published_before;

    this.setState({ filters, dateFilterType: type });
  };

  render() {
    let routesOptions = [];

    this.props.routes.map((route) => {
      routesOptions.push({
        value: {
          value: route.id,
          label: route.name,
        },
        label: route.name
      });
    });

    return (
      <div className="sd-filters-panel sd-filters-panel--border-right">
        <div className="side-panel side-panel--transparent side-panel--shadow-right">
          <div className="side-panel__header side-panel__header--border-b side-panel__header--has-close">
            <div className="side-panel__header-wrapper">
              <div className="side-panel__header-inner">
                <h3 className="side-panel__heading side-panel__heading--big">
                  Filter
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
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin sd-padding-t--0">
                  <MultiSelect
                    label="Category"
                    onChange={(values) => this.handleRouteChange(values)}
                    options={routesOptions}
                    optionLabel={(option) => option.label}
                    value={this.state.filters.routes}
                    emptyFilterMessage="No routes found"
                  />
                </div>
              </div>
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin sd-padding-t--0">
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
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin sd-line-input--is-select">
                  <label className="sd-line-input__label">Date filter</label>
                  <select
                    className="sd-line-input__select"
                    onChange={this.handleDateFilterTypeChange}
                    name="route"
                    value={this.state.dateFilterType}
                  >
                    <option value="range">Custom</option>
                    <option value="lastWeek">Last week</option>
                    <option value="lastMonth">Last month</option>
                    <option value="thisWeek">This week</option>
                    <option value="thisMonth">This month</option>
                  </select>
                </div>
              </div>

              {this.state.dateFilterType === "range" && (
                <div className="form__row form__row--flex">
                  <div className="form__row-item">
                    <div className="sd-line-input sd-line-input--no-margin">
                      <label className="sd-line-input__label">From</label>
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
                  </div>
                  <div className="form__row-item">
                    <div className="sd-line-input sd-line-input--no-margin">
                      <label className="sd-line-input__label">To</label>
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
                </div>
              )}
            </div>
          </div>
          <div className="side-panel__footer side-panel__footer--button-box">
            <div className="button-group button-group--start button-group--compact">
              <Button text="Clear" style="hollow" onClick={this.clear} />
              <Button text="Run Report" type="primary" onClick={this.save} />
            </div>
            <div
              className="button-group button-group--end button-group--compact"
              data-sd-tooltip={
                this.shouldAllowReportGeneration()
                  ? null
                  : "Select date range please"
              }
              style={{ overflow: "visible" }}
            >
              <Button
                text="Generate Report"
                type="primary"
                expanded={true}
                onClick={() =>
                  this.shouldAllowReportGeneration()
                    ? this.props.generateReport(this.state.filters)
                    : null
                }
                disabled={!this.shouldAllowReportGeneration()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FiltersPanel.propTypes = {
  toggle: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
  routes: PropTypes.array,
  publisher: PropTypes.object.isRequired,
  generateReport: PropTypes.func.isRequired,
};

export default FiltersPanel;
