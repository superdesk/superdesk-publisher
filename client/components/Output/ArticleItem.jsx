import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import _ from "lodash";

import Store from "./Store";
import ArticleStatusLabel from "../UI/ArticleStatusLabel";

const ArticleItem = ({ item, style }) => {
  const store = React.useContext(Store);

  return (
    <div
      className={classNames("sd-list-item", {
        "sd-list-item--activated":
          store.selectedItem && store.selectedItem.id === item.id,
        fadeElement: item.animate
      })}
      style={{
        ...style,
        width: "calc(100% - 4.8rem)",
        marginLeft: "2.4rem",
        top: `${parseFloat(style.top) + 24}px`
      }}
      onClick={() => store.actions.togglePreview(item)}
    >
      <div className="sd-list-item__border"></div>
      <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
        <div className="sd-list-item__row">
          <span className="sd-overflow-ellipsis sd-list-item__headline">
            {item.headline}
          </span>
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
        <div className="sd-list-item__row sd-list-item__row--wrap">
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
          {item.service.map(service =>
            store.selectedList === "incoming" ? (
              <span
                key={"articleService" + item.id + "-" + service.name}
                className="label label--hollow"
              >
                {service.name}
              </span>
            ) : null
          )}

          {item.version > 1 && store.selectedList === "incoming" && (
            <span className="label label--darkBlue2 label--hollow">
              update {item.version}
            </span>
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

          <span className="sd-d-inline-flex">
            {_.orderBy(item.articles, ["status"], ["desc"])
              .slice(0, 3)
              .map((article, index) => (
                <ArticleStatusLabel
                  key={`articlestatuslabel_${index}_${article.id}`}
                  article={article}
                  url={
                    article.tenant.subdomain
                      ? "http://" +
                        article.tenant.subdomain +
                        "." +
                        article.tenant.domain_name +
                        article._links.online.href
                      : "http://" +
                        article.tenant.domain_name +
                        article._links.online.href
                  }
                />
              ))}
          </span>
          {item.articles.length - 3 > 0 && (
            <span>+{item.articles.length - 3} more</span>
          )}

          <span className="sd-overflow-ellipsis">
            {store.selectedList === "incoming" && (
              <span className="sd-overflow-ellipsis sd-list-item--element-grow">
                {item.byline}
              </span>
            )}

            {store.selectedList === "published" && item.page_views_count ? (
              <React.Fragment>
                <span className="sd-list-item__text-label">pageviews:</span>
                <span>{item.page_views_count}</span>
              </React.Fragment>
            ) : null}

            {store.selectedList === "published" && item.comments_count ? (
              <React.Fragment>
                <span className="sd-list-item__text-label">comments:</span>
                <span>{item.comments_count}</span>
              </React.Fragment>
            ) : null}
          </span>
        </div>
      </div>
      <div className="sd-list-item__action-menu sd-list-item__action-menu--direction-row">
        {store.selectedList === "incoming" && (
          <button
            sd-tooltip="Remove"
            className="icn-btn"
            onClick={e => {
              e.stopPropagation();
              store.actions.removePackage(item);
            }}
          >
            <i className="icon-trash"></i>
          </button>
        )}
        <button
          sd-tooltip="Correct"
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
