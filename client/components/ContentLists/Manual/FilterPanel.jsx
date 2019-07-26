import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const FilterPanel = props => {
  return (
    <div className="sd-filters-panel sd-filters-panel--border-left">
      <div className="side-panel side-panel--transparent side-panel--shadow-right">
        <div className="side-panel__header side-panel__header--border-b">
          <a
            className="icn-btn side-panel__close"
            sd-tooltip="Close filters"
            flow="left"
            ng-click="webPublisherContentLists.filterOpen = !webPublisherContentLists.filterOpen"
          >
            <i className="icon-close-small" />
          </a>
          <h3 className="side-panel__heading">Advanced filters</h3>
        </div>
        <div className="side-panel__content">
          <div className="sd-loader" ng-if="loading" />
          <div className="side-panel__content-block">
            <div className="form__row">
              <div className="sd-line-input sd-line-input--no-margin sd-line-input--with-button">
                <sd-tag-input
                  ng-if="routes"
                  ng-model="webPublisherContentLists.selectedRoutes"
                  data-label="Routes"
                  data-items="routes"
                  data-field="name"
                  data-freetext="false"
                >
                  <tags-input
                    ng-model="model"
                    add-from-autocomplete-only="{{items ? !freetext : false}}"
                    show-button="{{!!items}}"
                    display-property="{{field}}"
                    use-strings="{{!field}}"
                  />
                </sd-tag-input>
              </div>
            </div>
            <div className="form__row">
              <div className="sd-line-input sd-line-input--no-margin sd-line-input--with-button">
                <sd-tag-input
                  ng-model="newList.filters.author"
                  data-label="Authors"
                >
                  <tags-input
                    ng-model="model"
                    add-from-autocomplete-only="{{items ? !freetext : false}}"
                    show-button="{{!!items}}"
                    display-property="{{field}}"
                    use-strings="{{!field}}"
                  />
                </sd-tag-input>
              </div>
            </div>
            <div className="form__row form__row--flex">
              <div className="sd-line-input sd-line-input--no-margin">
                <label className="sd-line-input__label">Published date</label>
                <div
                  sd-datepicker
                  data-format="YYYY-MM-DD"
                  name="publishedAt"
                  id="publishedAt"
                  ng-model="newList.filters.publishedAt"
                />
              </div>
            </div>
            <div className="form__row form__row--flex">
              <div className="sd-line-input sd-line-input--no-margin">
                <label className="sd-line-input__label">Published after</label>
                <div
                  sd-datepicker
                  data-format="YYYY-MM-DD"
                  name="publishedAfter"
                  id="publishedAfter"
                  ng-model="newList.filters.publishedAfter"
                />
              </div>
            </div>
            <div className="form__row form__row--flex">
              <div className="sd-line-input sd-line-input--no-margin">
                <label className="sd-line-input__label">Published before</label>
                <div
                  sd-datepicker
                  data-format="YYYY-MM-DD"
                  name="publishedBefore"
                  id="publishedBefore"
                  ng-model="newList.filters.publishedBefore"
                />
              </div>
            </div>
            <div className="form__row form__row--flex">
              <div className="sd-line-input">
                <label className="sd-line-input__label">Metadata</label>
                <div
                  ng-repeat="item in webPublisherContentLists.metadataList"
                  className="grid"
                >
                  <div className="grid__item grid__item--col-5">
                    <input
                      className="sd-line-input__input"
                      type="text"
                      ng-model="item.metaName"
                      placeholder="Name"
                    />
                  </div>
                  <div className="grid__item grid__item--col-5">
                    <input
                      className="sd-line-input__input"
                      type="text"
                      ng-model="item.metaValue"
                      placeholder="Value"
                    />
                  </div>
                  <div className="grid__item grid__item--col-2">
                    <button
                      type="button"
                      className="btn btn--alert btn--small btn--icon-only btn--hollow"
                      ng-click="webPublisherContentLists.removeMetadata($index)"
                      tooltip="{{:: 'Remove'|translate}}"
                      tooltip-placement="bottom"
                      tooltip-popup-delay="500"
                    >
                      <i className="icon-close-small" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn--primary btn--icon-only margin--top"
                  ng-click="webPublisherContentLists.addMetadata()"
                  sd-tooltip="{{:: 'Add metadata'|translate}}"
                  flow="right"
                >
                  <i className="icon-plus-large" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="side-panel__footer side-panel__footer--button-box">
          <div className="flex-grid flex-grid--boxed-small flex-grid--small-2">
            <a
              className="btn btn--hollow"
              ng-click="newList.filters = {}; webPublisherContentLists.selectedRoutes = []"
            >
              Clear
            </a>
            <a
              className="btn btn--primary"
              ng-click="webPublisherContentLists.filterArticles()"
            >
              Filter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

FilterPanel.propTypes = {};

export default FilterPanel;
