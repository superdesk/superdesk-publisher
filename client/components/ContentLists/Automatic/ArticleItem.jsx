import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";

import helpers from "../../../services/helpers.js";
import { gettext } from "../../../superdeskApi";

const ArticleItem = ({
  item,
  style,
  openPreview,
  previewItem,
  pinUnpin,
  remove,
}) => {
  let thumbnail = null;

  if (item.content.feature_media && item.content.feature_media.renditions) {
    thumbnail = helpers.getRenditionUrl(item.content.feature_media.renditions);
  }

  return (
    <div
      className={classNames("sd-list-item", {
        "sd-list-item--activated": previewItem && previewItem.id === item.id,
      })}
      onClick={() => openPreview(item)}
      style={style}
    >
      {item.sticky && (
        <div className="sd-list-item__border sd-list-item__border--locked"></div>
      )}
      {item.loading && <div className="sd-loader" />}
      {thumbnail && (
        <div
          className="sd-list-item__column sd-list-item__column--no-border sd-list-item__column--no-right-padding"
          style={{ width: "60px" }}
        >
          <img
            src={thumbnail}
            className="sd-list-item__thumbnail"
            style={{ maxWidth: "60px" }}
          />
        </div>
      )}

      <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
        <div className="sd-list-item__row">
          <span className="sd-overflow-ellipsis sd-list-item__text-strong">
            {item.content.title}
          </span>
        </div>
        <div className="sd-list-item__row">
          <span className="sd-overflow-ellipsis sd-list-item--element-grow">
            <time
              title={moment(item.content.published_at).format()}
              sd-tooltip={moment(item.content.published_at).format("HH:mm")}
              flow="right"
            >
              {moment(item.content.published_at).format("YYYY-MM-DD")}
            </time>
            {item.content.updated_at &&
            item.content.updated_at !== item.content.published_at ? (
              <time
                title={moment(item.content.updated_at).format()}
                sd-tooltip={moment(item.content.updated_at).format("HH:mm")}
                flow="right"
              >
                ({gettext("updated at")}:{" "}
                {moment(item.content.updated_at).format("YYYY-MM-DD")})
              </time>
            ) : null}
          </span>
          <span
            className={classNames("label", {
              "label--success label--hollow":
                item.content.status === "published",
              "label--alert": item.content.status === "unpublished",
              "label--yellow2": item.content.status === "new",
            })}
          >
            {item.content.route && item.content.route.name}
          </span>
          {item.sticky && (
            <span className="pull-right label label--alert label--hollow">
              {gettext("pinned")}
            </span>
          )}
        </div>
      </div>
      <div className="sd-list-item__action-menu sd-list-item__action-menu--direction-row">
        <button
          className="pull-right"
          onClick={(e) => {
            e.stopPropagation();
            pinUnpin(item);
          }}
          title={item.sticky ? gettext("Unpin") : gettext("Pin")}
          sd-tooltip={item.sticky ? gettext("Unpin") : gettext("Pin")}
          flow="left"
        >
          <i className="icon-pin" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            remove(item.content.id);
          }}
          sd-tooltip={gettext("remove")}
          flow="left"
          title={gettext("Remove")}
        >
          <i className="icon-trash" />
        </button>
      </div>
    </div>
  );
};

ArticleItem.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  openPreview: PropTypes.func.isRequired,
  previewItem: PropTypes.object,
  pinUnpin: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

export default ArticleItem;
