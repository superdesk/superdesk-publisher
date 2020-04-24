import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Button, IconButton } from "superdesk-ui-framework";
import MultiSelect from "../../UI/MultiSelect";

class FilterPanel extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      filters: { metadata: [], route: [], author: [] },
      routes: [],
      authors: [],
      loading: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.props.publisher.queryRoutes({ type: "collection" }).then((routes) => {
      if (this._isMounted) {
        this.setState({ routes }, this.prepareFilters);
      }
    });

    this.loadAuthors();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.filters, prevProps.filters)) {
      this.prepareFilters();
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

        if (this._isMounted && authors.length)
          this.setState({ authors: [...this.state.authors, ...authors] });

        if (response._links.next) this.loadAuthors(page + 1);
      });
  };

  prepareFilters = () => {
    let filters = { ...this.props.filters };

    let newRoute = [];
    if (filters.route) {
      filters.route.map((id) => {
        let routeObj = this.state.routes.find(
          (route) => parseInt(id) === parseInt(route.id)
        );
        if (routeObj)
          newRoute.push({ value: parseInt(routeObj.id), label: routeObj.name });
      });
    }
    filters.route = newRoute;

    let newAuthor = [];
    if (filters.author) {
      filters.author.map((authorName) => {
        newAuthor.push({ value: authorName, label: authorName });
      });
    }
    filters.author = newAuthor;

    let newMetadata = [];
    if (filters && filters.metadata) {
      Object.entries(filters.metadata).forEach(([key, value]) => {
        newMetadata.push({ key: key, value: value });
      });
    }
    filters.metadata = newMetadata;

    this.setState({ filters, loading: false });
  };

  save = () => {
    this.setState({ loading: true });

    let filters = _.pickBy({ ...this.state.filters }, _.identity);

    let newMetadata = {};
    filters.metadata.forEach((item) => {
      if (item.key) {
        newMetadata[item.key] = item.value;
      }
    });

    filters.metadata = newMetadata;

    let newRoute = [];

    filters.route.forEach((item) => {
      newRoute.push(item.value);
    });

    filters.route = newRoute;

    let newAuthor = [];

    filters.author.forEach((item) => {
      newAuthor.push(item.value);
    });

    filters.author = newAuthor;

    this.props.publisher
      .manageList({ filters: JSON.stringify(filters) }, this.props.list.id)
      .then((response) => {
        this.props.onFiltersSave(response);
        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        if (err.status === 409) {
          this.props.api.notify.error(
            "Cannot save. List has been modified by another user"
          );
        } else {
          this.props.api.notify.error("Something went wrong. Try again.");
        }
      });
  };

  clear = () => {
    this.setState({ filters: { metadata: [], route: [], author: [] } });
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

  handleRoutesChange = (arr) => {
    let filters = { ...this.state.filters };

    filters.route = arr ? arr : [];
    this.setState({ filters });
  };

  addMetadata = () => {
    let filters = { ...this.state.filters };

    filters.metadata.push({ key: "", value: "" });
    this.setState({ filters });
  };

  removeMetaData = (index) => {
    let filters = { ...this.state.filters };

    delete filters.metadata[index];
    this.setState({ filters });
  };

  handleMetaDataChange = (e, index) => {
    let { name, value } = e.target;
    let filters = { ...this.state.filters };

    filters.metadata[index][name] = value;
    this.setState({ filters });
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
      <div className="sd-filters-panel sd-filters-panel--border-right relative">
        {this.state.loading && <div className="sd-loader" />}
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
              Automatic List Criteria
            </h3>
          </div>
          <div className="side-panel__content">
            <div className="side-panel__content-block">
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin">
                  <label className="sd-line-input__label">Categories</label>
                  <MultiSelect
                    onSelect={(values) => this.handleRoutesChange(values)}
                    options={routesOptions}
                    selectedOptions={this.state.filters.route}
                  />
                </div>
              </div>
              <div className="form__row">
                <div className="sd-line-input sd-line-input--no-margin">
                  <label className="sd-line-input__label">Author</label>
                  <MultiSelect
                    onSelect={(values) => this.handleAuthorChange(values)}
                    options={authorsOptions}
                    selectedOptions={this.state.filters.author}
                  />
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
                  {this.state.filters.metadata.map((meta, index) => (
                    <div className="grid" key={"metadata" + index}>
                      <div className="grid__item grid__item--col-5">
                        <input
                          className="sd-line-input__input"
                          type="text"
                          onChange={(e) => this.handleMetaDataChange(e, index)}
                          name="key"
                          value={meta.key ? meta.key : ""}
                          placeholder="Name"
                        />
                      </div>
                      <div className="grid__item grid__item--col-5">
                        <input
                          className="sd-line-input__input"
                          type="text"
                          onChange={(e) => this.handleMetaDataChange(e, index)}
                          name="value"
                          value={meta.value ? meta.value : ""}
                          placeholder="Value"
                        />
                      </div>
                      <div className="grid__item grid__item--col-2">
                        <Button
                          type="primary"
                          icon="close-small"
                          size="small"
                          onClick={() => this.removeMetaData(index)}
                          sd-tooltip="Remove"
                        />
                      </div>
                    </div>
                  ))}

                  <div className="margin--top">
                    <Button
                      type="primary"
                      icon="plus-large"
                      onClick={this.addMetadata}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="side-panel__footer side-panel__footer--button-box">
            <div className="flex-grid flex-grid--boxed-small flex-grid--small-2">
              <Button text="Clear" style="hollow" onClick={this.clear} />
              <Button
                text="Update Criteria"
                type="primary"
                onClick={this.save}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FilterPanel.propTypes = {
  toggle: PropTypes.func.isRequired,
  list: PropTypes.object.isRequired,
  publisher: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  onFiltersSave: PropTypes.func,
  api: PropTypes.func.isRequired,
};

export default FilterPanel;
