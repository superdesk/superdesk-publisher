import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import moment from "moment";
import { Button, IconButton } from "superdesk-ui-framework/react";
import MultiSelect from "../UI/MultiSelect";
import AsyncMultiSelect from "../UI/AsyncMultiSelect";
import { DatePicker } from "superdesk-ui-framework/react";
import {gettext} from '../../superdeskApi';

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

  loadAuthors = (inputValue = null) => {
    if (inputValue && inputValue.length < 3) return this.state.authors;

    return this.props.publisher
      .queryAuthors({ term: inputValue, limit: 30 })
      .then((response) => {
        let authorsOptions = [];

        response._embedded._items.forEach((item) => {
          authorsOptions.push({
            value: item.id,
            label: item.name,
          });
        });

        this.setState({ authors: authorsOptions });
        return authorsOptions;
      })
      .catch((err) => {
        return this.state.authors;
      });
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
        value: route.id,
        label: route.name,
      });
    });

    return (
      <div className="sd-filters-panel sd-filters-panel--border-right">
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
              {gettext("Filter")}
            </h3>
          </div>
          <div className="side-panel__content">
            <div className="side-panel__content-block">
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin">
                  <label className="sd-line-input__label">{gettext("Category")}</label>
                  <MultiSelect
                    onSelect={(values) => this.handleRouteChange(values)}
                    options={routesOptions}
                    selectedOptions={
                      this.state.filters.routes ? this.state.filters.routes : []
                    }
                  />
                </div>
              </div>
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin">
                  <label className="sd-line-input__label">{gettext("Authors")}</label>
                  <AsyncMultiSelect
                    onSelect={(values) => this.handleAuthorChange(values)}
                    loadOptions={(inputValue) => this.loadAuthors(inputValue)}
                    selectedOptions={
                      this.state.filters.author ? this.state.filters.author : []
                    }
                  />
                </div>
              </div>
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin sd-line-input--is-select">
                  <label className="sd-line-input__label">{gettext("Date filter")}</label>
                  <select
                    className="sd-line-input__select"
                    onChange={this.handleDateFilterTypeChange}
                    name="route"
                    value={this.state.dateFilterType}
                  >
                    <option value="range">{gettext("Custom")}</option>
                    <option value="lastWeek">{gettext("Last week")}</option>
                    <option value="lastMonth">{gettext("Last month")}</option>
                    <option value="thisWeek">{gettext("This week")}</option>
                    <option value="thisMonth">{gettext("This month")}</option>
                  </select>
                </div>
              </div>

              {this.state.dateFilterType === "range" && (
                <div className="form__row form__row--flex">
                  <div className="form__row-item">
                    <div className="sd-line-input sd-line-input--no-margin">
                      <label className="sd-line-input__label">{gettext("From")}</label>
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
                      <label className="sd-line-input__label">{gettext("To")}</label>
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
            <div className="flex-grid flex-grid--boxed-small flex-grid--small-2">
              <Button text={gettext("Clear")} style="hollow" onClick={this.clear} />
              <Button text={gettext("Run Report")} type="primary" onClick={this.save} />
            </div>
            <div
              className="flex-grid flex-grid--boxed-small flex-grid--small-1"
              data-sd-tooltip={
                this.shouldAllowReportGeneration()
                  ? null
                  : gettext("Select date range please")
              }
              style={{ overflow: "visible" }}
            >
              <Button
                text={gettext("Generate Report")}
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
