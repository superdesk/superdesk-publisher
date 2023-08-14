import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import moment from "moment";
import { Button, IconButton, Dropdown, MultiSelect, TreeSelect } from "superdesk-ui-framework/react";
import { DatePicker } from "superdesk-ui-framework/react";

class FilterPanel extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      filters: {
        metadata: { service: [], subject: [] },
        route: [],
        author: [],
      },
      routes: [],
      authors: [],
      vocabularies: [],
      loading: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.loadRoutes();
    this.prepareMetadata();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.filters, prevProps.filters)) {
      this.prepareFilters();
      this.prepareMetadata();
    }
  }

  loadRoutes = () => {
    this.props.publisher.queryRoutes({ type: "collection" }).then((routes) => {
      if (this._isMounted) {
        let routesOptions = [];
        routes.map((route) => {
          routesOptions.push({
            value: parseInt(route.id),
            label: route.name,
          });
        });
        this.setState({ routes: routesOptions }, this.prepareFilters);
      }
    });
  };

  loadAuthors = (inputValue = null, callback = null) => {
    if (inputValue && inputValue.length < 2) callback(this.state.authors);

    this.props.publisher
      .queryAuthors({ term: inputValue, limit: 30 })
      .then((response) => {
        let authorsOptions = [];

        response._embedded._items.forEach((item) => {
          authorsOptions.push({value: {
            value: item.id,
            label: item.name,
          }});
        });

        this.setState({ authors: authorsOptions });
        callback(authorsOptions);
      })
      .catch((err) => {
        callback(this.state.authors);
      });

      return () => {};
  };

  prepareFilters = () => {
    let filters = { ...this.props.filters };

    let newRoute = [];
    if (filters.route) {
      filters.route.map((id) => {
        let routeObj = this.state.routes.find(
          (route) => parseInt(id) === parseInt(route.value)
        );
        if (routeObj)
          newRoute.push({
            value: parseInt(routeObj.value),
            label: routeObj.label,
          });
      });
    }
    filters.route = newRoute;

    let newAuthor = [];
    if (filters.author) {
      filters.author.map(async (author) => {
        if (typeof author === "object") {
          newAuthor.push({ value: author.id, label: author.name });
        } else {
          // backward compatibility 12-2020
          const response = await this.props.publisher.queryAuthors({
            term: author,
            limit: 1,
          });

          if (response._embedded._items.length) {
            newAuthor.push({
              value: response._embedded._items[0].id,
              label: response._embedded._items[0].name,
            });
          }
        }
      });
    }
    filters.author = newAuthor;

    this.setState({ filters, loading: false });
  };

  prepareMetadata = () => {
    let filters = { ...this.props.filters };
    if (!filters.metadata) return;

    let vocabularies = [];

    // priority
    if (filters.metadata.priority) {
      let service = this.props.vocabularies.find((v) => v._id === "priority");
      let serviceItems =
        service && service.items
          ? service.items.filter((i) => i.is_active)
          : [];
      let serviceOptions = [];

      if (serviceItems.length) {
        serviceItems.map((item) => {
          serviceOptions.push({
            value: item.qcode,
            label: item.name,
          });
        });
      }

      let value = [];

      let originalServiceItem = serviceItems.find(
        (s) => s.qcode === filters.metadata.priority
      );

      if (originalServiceItem) {
        value.push({
          value: filters.metadata.priority,
          label: originalServiceItem.name,
        });
      }

      vocabularies.push({
        name: "Priority",
        id: "priority",
        options: serviceOptions,
        value: value,
      });
    }

    // urgency
    if (filters.metadata.urgency) {
      let service = this.props.vocabularies.find((v) => v._id === "urgency");
      let serviceItems =
        service && service.items
          ? service.items.filter((i) => i.is_active)
          : [];
      let serviceOptions = [];

      if (serviceItems.length) {
        serviceItems.map((item) => {
          serviceOptions.push({
            value: item.qcode,
            label: item.name,
          });
        });
      }

      let value = [];

      let originalServiceItem = serviceItems.find(
        (s) => s.qcode === filters.metadata.urgency
      );

      if (originalServiceItem) {
        value.push({
          value: filters.metadata.urgency,
          label: originalServiceItem.name,
        });
      }

      vocabularies.push({
        name: "Urgency",
        id: "urgency",
        options: serviceOptions,
        value: value,
      });
    }

    // categories
    if (filters.metadata.service && filters.metadata.service.length) {
      let service = this.props.vocabularies.find((v) => v._id === "categories");
      let serviceItems =
        service && service.items
          ? service.items.filter((i) => i.is_active)
          : [];
      let serviceOptions = [];

      if (serviceItems.length) {
        serviceItems.map((item) => {
          serviceOptions.push({
            value: item.qcode,
            label: item.name,
          });
        });
      }

      let value = [];
      for (let serviceItem of filters.metadata.service) {
        let originalServiceItem = serviceItems.find(
          (s) => s.qcode === serviceItem.code
        );

        if (originalServiceItem) {
          value.push({
            value: serviceItem.code,
            label: originalServiceItem.name,
          });
        }
      }

      vocabularies.push({
        name: "Categories",
        id: "categories",
        options: serviceOptions,
        value: value,
      });
    }

    // all other
    if (filters.metadata.subject && filters.metadata.subject.length) {
      let groupedSubject = _.groupBy(
        filters.metadata.subject,
        (subject) => subject.scheme
      );

      for (const [key, subjectValue] of Object.entries(groupedSubject)) {
        let originalVocabulary = this.props.vocabularies.find(
          (v) => v._id === key
        );

        let subjectItems =
          originalVocabulary && originalVocabulary.items
            ? originalVocabulary.items.filter((i) => i.is_active)
            : [];
        let subjectOptions = [];

        if (subjectItems.length) {
          subjectItems.map((item) => {
            subjectOptions.push({
              value: item.qcode,
              label: item.name,
            });
          });
        }

        let value = [];
        for (let subjectItem of subjectValue) {
          let originalSubjectItem = subjectItems.find(
            (s) => s.qcode === subjectItem.code
          );

          value.push({
            value: subjectItem.code,
            label: originalSubjectItem.name,
          });
        }

        vocabularies.push({
          name: originalVocabulary.display_name,
          id: originalVocabulary._id,
          options: subjectOptions,
          value: value,
        });
      }
    }

    this.setState({ vocabularies });
  };

  save = () => {
    this.setState({ loading: true });
    let vocabularies = [...this.state.vocabularies];
    let filters = _.pickBy({ ...this.state.filters }, _.identity);
    let newMetadata = {};

    // priority and urgency
    const priority = vocabularies.find((v) => v.id === "priority");

    if (priority) {
      newMetadata.priority = priority.value[0].value;
      vocabularies = vocabularies.filter((v) => v.id !== "priority");
    }

    const urgency = vocabularies.find((v) => v.id === "urgency");

    if (urgency) {
      newMetadata.urgency = urgency.value[0].value;
    }

    // services
    const services = vocabularies.find((v) => v.id === "categories");

    if (services) {
      newMetadata.service = [];

      for (let serviceValue of services.value) {
        newMetadata.service.push({
          code: serviceValue.value,
        });
      }

      vocabularies = vocabularies.filter((v) => v.id !== "categories");
    }

    // subjects
    if (vocabularies.length) {
      newMetadata.subject = [];

      for (let subject of vocabularies) {
        for (let subjectValue of subject.value) {
          newMetadata.subject.push({
            scheme: subject.id,
            code: subjectValue.value,
          });
        }
      }
    }

    filters.metadata = newMetadata;

    let newRoute = [];

    filters.route.forEach((item) => {
      newRoute.push(item.value);
    });

    filters.route = newRoute;

    let newAuthor = [];

    filters.author.forEach((item) => {
      newAuthor.push({ id: item.value, name: item.label });
    });

    filters.author = newAuthor;

    if (!filters.route.length) delete filters.route;
    if (!filters.author.length) delete filters.author;
    if (filters.metadata.subject && !filters.metadata.subject.length)
      delete filters.metadata.subject;

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
    this.setState({
      filters: { metadata: [], route: [], author: [] },
      vocabularies: [],
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

  handleRoutesChange = (arr) => {
    let filters = { ...this.state.filters };

    filters.route = arr ? arr : [];
    this.setState({ filters });
  };

  handleMetadataChange = (arr, vocabularyId) => {
    let vocabularies = [...this.state.vocabularies];

    let index = vocabularies.findIndex((voc) => voc.id === vocabularyId);
    if (index > -1) {
      vocabularies[index].value = arr ? arr : [];
      this.setState({ vocabularies });
    }
  };

  addVocabulary = (vocabularyId) => {
    let vocabularies = [...this.state.vocabularies];
    let subject = this.props.vocabularies.find((v) => v._id === vocabularyId);
    let subjectItems =
      subject && subject.items ? subject.items.filter((i) => i.is_active) : [];
    let subjectOptions = [];

    if (subjectItems.length) {
      subjectItems.map((item) => {
        subjectOptions.push({
          value: item.qcode,
          label: item.name,
        });
      });
      vocabularies.push({
        name: subject.display_name,
        id: subject._id,
        options: subjectOptions,
        value: [],
      });
    }

    this.setState({ vocabularies });
  };

  removeVocabulary = (vocabularyId) => {
    let vocabularies = [...this.state.vocabularies];
    let index = vocabularies.findIndex((v) => v.id === vocabularyId);

    if (index > -1) {
      vocabularies.splice(index, 1);
      this.setState({ vocabularies });
    }
  };

  render() {
    const vocabulariesToRemove = [
      "replace_words",
      "locators",
      "default_categories",
      "crop_sizes",
      "author_roles",
      "annotation_types",
      "job_titles",
      "package-story-labels",
      "contact_mobile_usage",
      "contact_phone_usage",
      "languages",
      "regions",
      "countries",
      "usageterms",
      "rightsinfo",
    ];

    let filteredVocabularies = this.props.vocabularies.filter(
      (vocabulary) =>
        this.state.vocabularies.findIndex((v) => v.id === vocabulary._id) ===
          -1 &&
        vocabulary.items.length &&
        vocabulariesToRemove.indexOf(vocabulary._id) === -1
    );

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
                <div className="sd-line-input sd-line-input--no-margin sd-padding-t--0">
                  <MultiSelect
                    label="Routes"
                    onChange={(values) => this.handleRoutesChange(values)}
                    options={this.state.routes}
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

              <div className="form__row form__row--flex">
                <div className="sd-line-input sd-line-input--no-margin">
                  <label className="sd-line-input__label">Publish date</label>
                  <DatePicker
                    value={
                      this.state.filters.published_at
                        ? moment(
                            this.state.filters.published_at,
                            "YYYY-MM-DD"
                          ).toDate()
                        : null
                    }
                    dateFormat="YYYY-MM-DD"
                    onChange={(date) => {
                      let stringDate = moment(date).format("YYYY-MM-DD");

                      this.handleInputChange({
                        target: {
                          name: "published_at",
                          value: stringDate,
                        },
                      });
                    }}
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

              {this.state.vocabularies.map((vocabulary) => (
                <div
                  className="sd-shadow--z1 sd-margin-b--1 sd-padding--1"
                  style={{ position: "relative", backgroundColor: "white" }}
                  key={vocabulary.id}
                >
                  <span
                    className="side-panel__close"
                    style={{ right: 0, top: 0 }}
                    onClick={() => this.removeVocabulary(vocabulary.id)}
                  >
                    <a className="icn-btn">
                      <i className="icon-close-small"></i>
                    </a>
                  </span>
                  <div className="form__row">
                    <div className="sd-line-input sd-line-input--no-margin">
                      <label className="sd-line-input__label">
                        {vocabulary.name}
                      </label>
                      {/* <p>{vocabulary.id}</p> */}

                      <MultiSelect
                        onSelect={(values) =>
                          this.handleMetadataChange(values, vocabulary.id)
                        }
                        options={vocabulary.options}
                        selectedOptions={vocabulary.value}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Dropdown
                items={filteredVocabularies.map((vocabulary) => {
                  return {
                    label: vocabulary.display_name,
                    onSelect: () => this.addVocabulary(vocabulary._id),
                  };
                })}
              >
                <button className="btn btn--small btn--primary">
                  <i className="icon-plus-sign"></i>Add Metadata
                </button>
              </Dropdown>
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
  vocabularies: PropTypes.array.isRequired,
};

export default FilterPanel;
