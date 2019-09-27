import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import _ from "lodash";

import Store from "../Store";
import ArticleStatusLabel from "../../UI/ArticleStatusLabel";

const ArticleItem = ({ item, style }) => {
  const store = React.useContext(Store);

  let galleries = null;
  let galleriesFlag = false;
  item.extra_items.forEach(i => {
    if (i.type === "media") galleriesFlag = true;
  });

  if (galleriesFlag) {
    galleries = (
      <div className="sd-list-item__column" ng-if="hasGalleries(i.extra_items)">
        <div className="sd-list-item__row">
          {item.extra_items.map(
            (i, index) =>
              i.type === "media" && (
                <span
                  key={"articleGallery" + item.id + "-" + index}
                  className="sd-text-icon sd-margin-r--1"
                >
                  <i className="icon-slideshow sd-opacity--40"></i>
                  {i.items.length}
                </span>
              )
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={classNames("sd-list-item", {
        "sd-list-item--activated":
          store.selectedItem && store.selectedItem.id === item.id
      })}
      style={style}
      onClick={() => store.actions.togglePreview(item)}
    >
      <div
        className={classNames("sd-list-item__border", {
          "sd-list-item__border--success": item.status === "published",
          "sd-list-item__border--locked": item.status === "unpublished"
        })}
      ></div>

      {galleries}
      <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
        <div className="sd-list-item__row">
          <span className="sd-overflow-ellipsis sd-list-item__headline sd-list-item--element-grow">
            {item.headline}
          </span>
          {item.service &&
            item.service.map(service =>
              store.selectedList === "incoming" ? (
                <span
                  key={"articleService" + item.id + "-" + service.name}
                  className="label label--hollow"
                >
                  {service.name}
                </span>
              ) : null
            )}
          {item.articles[0] && item.articles[0].paywall_secured && (
            <span
              className="sd-list-item__inline-text no-line-height"
              sd-tooltip="Paywall secured"
              flow="left"
            >
              <i className="icon-paywall icon--orange icon--full-opacity"></i>
            </span>
          )}
          {item.updated_at ? (
            <time title={moment(item.updated_at).format()}>
              {moment(item.updated_at).fromNow()}
            </time>
          ) : (
            <time title={moment(item.created_at).format()}>
              {moment(item.created_at).fromNow()}
            </time>
          )}
        </div>
      </div>
      <div className="sd-list-item__action-menu sd-list-item__action-menu--direction-row">
        <button
          sd-tooltip="Correct"
          flow="left"
          className="icn-btn"
          onClick={e => {
            e.stopPropagation();
            store.actions.correctPackage(item);
          }}
        >
          <i className="icon-pencil"></i>
        </button>
        <button
          sd-tooltip="Publish"
          flow="left"
          className="icn-btn"
          onClick={e => {
            e.stopPropagation();
            store.actions.togglePublish(item);
          }}
        >
          <i className="icon-expand-thin"></i>
        </button>
      </div>
    </div>
  );
};

ArticleItem.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

export default ArticleItem;
