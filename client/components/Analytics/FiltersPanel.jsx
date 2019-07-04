import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import _ from "lodash";

class FiltersPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: props.filters ? props.filters : {}
    };
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.filters, prevProps.filters)) {
      this.setState({ filters: this.props.filters });
    }
  }

  handleInputChange = e => {
    let { name, value } = e.target;
    let filters = { ...this.state.filters };

    filters[name] = value;
    this.setState({ filters });
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
                    {this.props.routes.map(route => (
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
                  <input
                    className="sd-line-input__input"
                    type="text"
                    onChange={this.handleInputChange}
                    name="author"
                    value={
                      this.state.filters.author ? this.state.filters.author : ""
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
            </div>
          </div>
          <div className="side-panel__footer side-panel__footer--button-box">
            <div className="flex-grid flex-grid--boxed-small flex-grid--small-2">
              <a
                className="btn btn--hollow"
                onClick={() => this.props.setFilters({})}
              >
                Clear
              </a>
              <a
                className="btn btn--primary"
                onClick={() => this.props.setFilters(this.state.filters)}
              >
                Filter
              </a>
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
  routes: PropTypes.array
};

export default FiltersPanel;
