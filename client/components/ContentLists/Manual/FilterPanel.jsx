import React from "react";
import PropTypes from "prop-types";
import { gettext } from "../../../superdeskApi";

import _ from "lodash";
import { Button, IconButton } from "superdesk-ui-framework/react";
import MultiSelect from "../../UI/MultiSelect";
import AsyncMultiSelect from "../../UI/AsyncMultiSelect";

class FilterPanel extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      filters: { route: [], author: [] },
      routes: [],
      authors: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.props.publisher.queryRoutes({ type: "collection" }).then((routes) => {
      if (this._isMounted) {
        this.setState({ routes }, this.prepareFilters);
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
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

    if (this.state.filters.author.length) {
      delete filters.author;
      filters["author[]"] = [];
      this.state.filters.author.map((item) => {
        filters["author[]"].push(item.value);
      });
    }

    if (this.state.filters.route.length) {
      delete filters.route;
      filters["route[]"] = [];
      this.state.filters.route.map((item) => {
        filters["route[]"].push(item.value);
      });
    }

    this.props.filter(filters);
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
      <div className="sd-filters-panel sd-filters-panel--border-left">
        <div className="side-panel side-panel--transparent side-panel--shadow-right">
          <div className="side-panel__header side-panel__header--border-b">
            <span className="side-panel__close">
              <IconButton
                icon="close-small"
                tooltip={{ text: gettext("Close"), flow: "left" }}
                onClick={this.props.toggle}
              />
            </span>
            <h3 className="side-panel__heading">{gettext("Advanced filters")}</h3>
          </div>
          <div className="side-panel__content">
            <div className="side-panel__content-block">
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin sd-line-input--with-button">
                  <label className="sd-line-input__label">{gettext("Routes")}</label>
                  <MultiSelect
                    onSelect={(values) => this.handleRoutesChange(values)}
                    options={routesOptions}
                    selectedOptions={this.state.filters.route}
                  />
                </div>
              </div>
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin sd-line-input--with-button">
                  <label className="sd-line-input__label">{gettext("Author")}</label>
                  <AsyncMultiSelect
                    onSelect={(values) => this.handleAuthorChange(values)}
                    loadOptions={(inputValue) => this.loadAuthors(inputValue)}
                    selectedOptions={
                      this.state.filters.author ? this.state.filters.author : []
                    }
                  />
                </div>
              </div>
              <div className="form__row form__row--flex">
                <div className="sd-line-input sd-line-input--no-margin">
                  <label className="sd-line-input__label">{gettext("Published date")}</label>
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
                    {gettext("Published after")}
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
                    {gettext("Published before")}
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
            </div>
          </div>
          <div className="side-panel__footer side-panel__footer--button-box">
            <div className="flex-grid flex-grid--boxed-small flex-grid--small-2">
              <Button text={gettext("Clear")} style="hollow" onClick={this.clear} />
              <Button text={gettext("Filter")} type="primary" onClick={this.save} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FilterPanel.propTypes = {
  filter: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  publisher: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default FilterPanel;
