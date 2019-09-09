import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Store from "./Store";

class FilterPane extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      loading: false,
      routes: [],
      authors: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.isOpen && !prevProps.isOpen && !this.state.routes.length) {
      // load routes and authors
    }
  }

  render() {
    return (
      <Store.Consumer>
        {({ selectedList, listViewType }) => (
          <div
            className={classNames(
              "sd-filters-panel sd-filters-panel--border-right",
              {
                "sd-flex-no-shrink":
                  selectedList === "published" && listViewType === "swimlane"
              }
            )}
          >
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
                  Advanced Filter
                </h3>
              </div>
              <div className="side-panel__content">
                {this.state.loading && <div className="sd-loader" />}
                <div className="side-panel__content-block">
                  <div className="form__row">
                    <div className="sd-line-input sd-line-input--no-margin" />
                  </div>
                  <div className="form__row">
                    <div className="sd-line-input sd-line-input--no-margin" />
                  </div>
                  <div className="form__row form__row--flex">
                    <div className="sd-line-input sd-line-input--no-margin">
                      <label className="sd-line-input__label">
                        Published after
                      </label>
                      <div
                        data-format="YYYY-MM-DD"
                        name="publishedAfter"
                        id="publishedAfter"
                        ng-model="webPublisherOutput.advancedFilters.publishedAfter"
                      />
                    </div>
                  </div>
                  <div className="form__row form__row--flex">
                    <div className="sd-line-input sd-line-input--no-margin">
                      <label className="sd-line-input__label">
                        Published before
                      </label>
                      <div
                        data-format="YYYY-MM-DD"
                        name="publishedBefore"
                        id="publishedBefore"
                        ng-model="webPublisherOutput.advancedFilters.publishedBefore"
                      />
                    </div>
                  </div>
                  <div className="form__row">
                    <div className="sd-line-input sd-line-input--no-margin" />
                  </div>
                </div>
              </div>
              <div className="side-panel__footer side-panel__footer--button-box">
                <div className="flex-grid flex-grid--boxed-small">
                  <a
                    className="btn btn--hollow btn--expanded"
                    ng-click="webPublisherOutput.advancedFilters = {}"
                  >
                    Clear filters
                  </a>
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
  isOpen: PropTypes.bool.isRequired
};

export default FilterPane;
