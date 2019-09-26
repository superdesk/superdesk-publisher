import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import _ from "lodash";

import Store from "./Store";
import ArticleStatusLabel from "../UI/ArticleStatusLabel";

const ArticleItem = ({ item, style, onRemove }) => {
  const store = React.useContext(Store);

  return (
    <div
      className="sd-list-item"
      ng-className="{'sd-list-item--activated':webPublisherOutput.selectedArticle.id === i.id, 'fadeElement' : i.animate}"
      ng-click="webPublisherOutput.openPreview(i); $event.stopPropagation();"
      ng-dblclick="webPublisherOutput.openPublish(i, 'publish'); $event.stopPropagation();"
      ng-repeat="i in articlesList"
    >
      <div
        className="sd-list-item__border"
        ng-className="{'sd-list-item__border--success' : i.status === 'published', 'sd-list-item__border--locked': i.status === 'unpublished' }"
      ></div>
      <div className="sd-list-item__column" ng-if="hasGalleries(i.extra_items)">
        <div className="sd-list-item__row">
          <span
            className="sd-text-icon sd-margin-r--1"
            ng-repeat="item in i.extra_items"
            ng-if="item.type==='media'"
          >
            <i className="icon-slideshow sd-opacity--40"></i>item.items.length
          </span>
        </div>
      </div>
      <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
        <div className="sd-list-item__row">
          <span
            className="sd-overflow-ellipsis sd-list-item__headline sd-list-item--element-grow"
            title="{{i.headline}}"
          >
            i.headline
          </span>
          <span
            className="label label--hollow"
            ng-repeat="service in i.service"
          >
            service.name
          </span>
          <span
            ng-if="i.articles[0] && i.articles[0].paywall_secured"
            className="sd-list-item__inline-text no-line-height"
            sd-tooltip="Paywall secured"
            flow="left"
          >
            <i className="icon-paywall icon--orange icon--full-opacity"></i>
          </span>
          <time
            ng-if="i.updated_at"
            title="{{i.updated_at}}"
            className="no-padding"
          >
            i.updated_at
          </time>
          <time
            ng-if="!i.updated_at"
            title="{{i.created_at}}"
            className="no-padding"
          >
            i.created_at{" "}
          </time>
        </div>
      </div>
      <div className="sd-list-item__action-menu">
        <div
          className="dropdown dropdown--align-right"
          dropdown=""
          dropdown-append-to-body=""
        >
          <button
            className="icn-btn dropdown__toggle"
            dropdown__toggle=""
            ng-click="$event.stopPropagation();"
          >
            <i className="icon-dots-vertical"></i>
          </button>
          <ul className="dropdown__menu">
            <li>
              <button ng-click="webPublisherOutput.correctArticle(i)">
                <i className="icon-pencil"></i>Correct
              </button>
            </li>
            <li>
              <button ng-click="webPublisherOutput.openPublish(i, 'publish')">
                <i className="icon-expand-thin"></i>Publish
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

ArticleItem.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default ArticleItem;
