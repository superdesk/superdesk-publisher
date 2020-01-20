import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import MultiSelect from "../UI/MultiSelect";

class FiltersPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: props.filters ? props.filters : {},
      authors: []
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
        filters.author.forEach(item => {
          let author = this.state.authors.find(a => a.display_name === item);

          if (author) {
            newAuthors.push({
              value: author.display_name,
              label: author.display_name
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
          is_active: true,
          is_enabled: true,
          needs_activation: false
        }
      })
      .then(response => {
        let authors = response._items.filter(item => item.is_author);

        if (authors.length)
          this.setState({ authors: [...this.state.authors, ...authors] });

        if (response._links.next) this.loadAuthors(page + 1);
      });
  };

  handleInputChange = e => {
    let { name, value } = e.target;
    let filters = { ...this.state.filters };

    filters[name] = value;
    this.setState({ filters });
  };

  handleAuthorChange = arr => {
    let filters = { ...this.state.filters };

    filters.author = arr ? arr : [];
    this.setState({ filters });
  };

  save = () => {
    let filters = { ...this.state.filters };
    let newAuthor = [];

    if (filters.author && filters.author.length) {
      filters.author.map(item => {
        newAuthor.push(item.value);
      });

      filters.author = newAuthor;
    }

    this.props.setFilters(filters);
  };

  render() {
    let authorsOptions = [];

    this.state.authors.map(author => {
      authorsOptions.push({
        value: author.display_name,
        label: author.display_name
      });
    });

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
                  <MultiSelect
                    onSelect={values => this.handleAuthorChange(values)}
                    options={authorsOptions}
                    selectedOptions={
                      this.state.filters.author ? this.state.filters.author : []
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
                data-testid="filterClear"
                onClick={() => this.props.setFilters({})}
              >
                Clear
              </a>
              <a
                className="btn btn--primary"
                data-testid="filterSave"
                onClick={this.save}
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
  routes: PropTypes.array,
  api: PropTypes.func.isRequired
};

export default FiltersPanel;
