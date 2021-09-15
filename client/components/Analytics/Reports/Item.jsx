import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import classNames from "classnames";
import {gettext} from '../../../superdeskApi';

const Item = ({ item }) => {
  let filterAuthors = "",
    filterCategories = "";

  if (item.filters.authors && item.filters.authors.length) {
    item.filters.authors.map((author, index) => {
      filterAuthors += index > 0 ? ", " + author : author;
    });
  }

  if (item.filters.routes && item.filters.routes.length) {
    item.filters.routes.map((route, index) => {
      filterCategories += index > 0 ? ", " + route : route;
    });
  }

  return (
    <div
      className={classNames("sd-list-item sd-shadow--z1", {
        "sd-list-item--no-hover": item.status !== "completed"
      })}
    >
      <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
        <div className="sd-list-item__row">
          <div className="sd-overflow-ellipsis">
            <span className="sd-text__date-time sd-text__italic">
              {gettext("Report Author")}:{" "}
            </span>
            <span className="sd-text__normal sd-margin-r--1">
              {item.user.username}
            </span>
            <span className="sd-text__date-time sd-text__italic">
              {gettext("Report created")}:{" "}
            </span>
            <span className="sd-text__date-time sd-margin-r--1">
              {moment(item.created_at).format("YYYY-MM-DD, HH:mm")}
            </span>
          </div>
        </div>
        <div className="sd-list-item__row">
          <span
            className={classNames("label sd-margin-r--1", {
              "label--success": item.status === "completed",
              "state-in_progress": item.status === "processing",
              "label--alert": item.status === "errored"
            })}
          >
            {gettext(item.status)}
          </span>
          {(item.filters.start || item.filters.end) && (
            <React.Fragment>
              <span className="sd-text__date-time sd-text__italic">{gettext("Range")}:</span>
              <span className="sd-text__normal sd-margin-r--1 leftSpace">
                {item.filters.start &&
                  moment(item.filters.start).format("YYYY-MM-DD")}{" "}
                -{" "}
                {item.filters.end &&
                  moment(item.filters.end).format("YYYY-MM-DD")}
              </span>
            </React.Fragment>
          )}
          {filterCategories && (
            <React.Fragment>
              <span className="sd-text__date-time sd-text__italic">
                {gettext("Category")}:
              </span>
              <span className="sd-text__normal sd-margin-r--1 leftSpace">
                {filterCategories}
              </span>
            </React.Fragment>
          )}
          {filterAuthors && (
            <React.Fragment>
              <span className="sd-text__date-time sd-text__italic">
                {gettext("Authors")}:
              </span>
              <span className="sd-text__normal sd-margin-r--1 leftSpace">
                {filterAuthors}
              </span>
            </React.Fragment>
          )}
        </div>
      </div>
      {item.status === "completed" && (
        <div className="sd-list-item__action-menu">
          <a
            className="pull-right"
            style={{ marginRight: "1em" }}
            title="Download"
            sd-tooltip="Download"
            flow="left"
            href={item._links.download.href}
          >
            <i className="icon-download"></i>
          </a>
        </div>
      )}
    </div>
  );
};

Item.propTypes = {
  item: PropTypes.object.isRequired
};

export default Item;
