import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Button, IconButton } from "superdesk-ui-framework/react";
import MultiSelect from "../UI/MultiSelect";

class FiltersPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: props.filters ? props.filters : {},
      authors: [],
      dateFilterType: "range",
    };
  }

  componentDidMount() {
    this.loadAuthors();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.filters, prevProps.filters)) {
      let filters = { ...this.props.filters };
      let newAuthors = [];

      if (filters.author && filters.author.length) {
        filters.author.forEach((item) => {
          let author = this.state.authors.find((a) => a.display_name === item);

          if (author) {
            newAuthors.push({
              value: author.display_name,
              label: author.display_name,
            });
          }
        });

        filters.author = newAuthors;
      }
      this.setState({ filters: filters });
    }
  }

  loadAuthors = (page = 1) => {
    this.props.api.users
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

        if (authors.length)
          this.setState({ authors: [...this.state.authors, ...authors] });

        if (response._links.next) this.loadAuthors(page + 1);
      });
  };

  handleInputChange = (e) => {
    let { name, value } = e.target;
    let filters = { ...this.state.filters };

    filters[name] = value;
    this.setState({ filters });
  };

  handleAuthorChange = (arr) => {
    let filters = { ...this.state.filters };

    filters.author = arr ? arr : [];
    this.setState({ filters });
  };

  clear = () => {
    this.setState({ dateFilterType: "range", filters: {} });
    this.props.setFilters({});
  };

  save = () => {
    let filters = { ...this.state.filters };
    let newAuthor = [];

    if (filters.author && filters.author.length) {
      filters.author.map((item) => {
        newAuthor.push(item.value);
      });

      filters.author = newAuthor;
    }

    this.props.setFilters(filters);
  };

  isFiltersEmpty = () => {
    let filters = { ...this.state.filters };

    if (
      (filters.author && filters.author.length) ||
      filters.route ||
      filters.published_after ||
      filters.published_before
    ) {
      return false;
    }
    return true;
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
    let authorsOptions = [];

    this.state.authors.map((author) => {
      authorsOptions.push({
        value: author.display_name,
        label: author.display_name,
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
              Filter
            </h3>
          </div>
          <div className="side-panel__content">
            <div className="side-panel__content-block">
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin sd-line-input--is-select">
                  <label className="sd-line-input__label">Category</label>
                  <select
                    className="sd-line-input__select"
                    onChange={this.handleInputChange}
                    name="route"
                    value={
                      this.state.filters.route ? this.state.filters.route : ""
                    }
                  >
                    <option value="" />
                    {this.props.routes.map((route) => (
                      <option key={"route" + route.id} value={route.id}>
                        {route.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin">
                  <label className="sd-line-input__label">Author</label>
                  <MultiSelect
                    onSelect={(values) => this.handleAuthorChange(values)}
                    options={authorsOptions}
                    selectedOptions={
                      this.state.filters.author ? this.state.filters.author : []
                    }
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
                  <div className="form__row-item">
                    <div className="sd-line-input sd-line-input--no-margin">
                      <label className="sd-line-input__label">To</label>
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
                </div>
              )}
            </div>
          </div>
          <div className="side-panel__footer side-panel__footer--button-box">
            <div className="flex-grid flex-grid--boxed-small flex-grid--small-2">
              <Button text="Clear" style="hollow" onClick={this.clear} />
              <Button text="Run Report" type="primary" onClick={this.save} />
            </div>
            <div className="flex-grid flex-grid--boxed-small flex-grid--small-1">
              <Button
                text="Generate Report"
                type="primary"
                expanded={true}
                onClick={() =>
                  this.isFiltersEmpty()
                    ? null
                    : this.props.generateReport(this.state.filters)
                }
                disabled={this.isFiltersEmpty()}
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
  api: PropTypes.func.isRequired,
  generateReport: PropTypes.func.isRequired,
};

export default FiltersPanel;
