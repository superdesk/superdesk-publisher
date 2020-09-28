import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import _ from "lodash";
import { Button, IconButton, Label } from "superdesk-ui-framework/react";
import Store from "./Store";
import ArticleStatusLabel from "../UI/ArticleStatusLabel";
import Modal from "../UI/Modal";

const ArticleItem = ({ item, style, onRemove }) => {
  const store = React.useContext(Store);
  const [state, setState] = React.useState({ confirm: false });

  const removeConfirm = () => setState({ confirm: true });

  const removeCancel = () => setState({ confirm: false });

  const remove = () => {
    store.publisher
      .removeArticle({ pub_status: "canceled" }, item.id)
      .then(() => {
        setState({ confirm: false });
        onRemove(item.id);
      })
      .catch((e) => store.notify.error("Cannot remove article"));
  };

  let modalContent = null;
  if (state.confirm) {
    modalContent = (
      <React.Fragment>
        <div className="modal__header ">
          <h3>Confirm</h3>
        </div>
        <div className="modal__body ">
          Please confirm you want to remove article from incoming list.
        </div>
        <div className="modal__footer">
          <Button
            text="Cancel"
            onClick={(e) => {
              e.stopPropagation();
              removeCancel();
            }}
          />
          <Button
            text="Remove"
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              remove();
            }}
          />
        </div>
      </React.Fragment>
    );
  }

  let isPublishedFbia = false;
  let isPublishedAppleNews = false;

  item.articles.forEach((article) => {
    if (article.is_published_fbia) isPublishedFbia = true;
    if (article.is_published_to_apple_news) isPublishedAppleNews = true;
  });

  return (
    <div
      className={classNames("sd-list-item", {
        "sd-list-item--activated":
          store.selectedItem && store.selectedItem.id === item.id,
        fadeElement: item.animate,
      })}
      style={style}
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
              {moment(item.updated_at).format("YYYY-MM-DD")}
            </time>
          ) : (
            <time title={moment(item.created_at).format()}>
              {moment(item.created_at).format("YYYY-MM-DD")}
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

          {item.service &&
            item.service.map((service) =>
              store.selectedList === "incoming" ? (
                <Label
                  key={"articleService" + item.id + "-" + service.name}
                  text={service.name}
                  style="hollow"
                />
              ) : null
            )}

          {item.version > 1 && store.selectedList === "incoming" && (
            <Label
              text={"update " + item.version}
              style="hollow"
              color="indigo--700"
            />
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
                    article.tenant
                      ? article.tenant.subdomain
                        ? "http://" +
                          article.tenant.subdomain +
                          "." +
                          article.tenant.domain_name +
                          article._links.online.href
                        : "http://" +
                          article.tenant.domain_name +
                          article._links.online.href
                      : null
                  }
                />
              ))}
          </span>
          {isPublishedFbia ? <Label text="facebook" type="primary" /> : null}
          {isPublishedAppleNews ? (
            <Label text="Apple News" color="pink--400" />
          ) : null}
          {item.articles.length - 3 > 0 && (
            <span className="sd-margin-r--1">
              +{item.articles.length - 3} more
            </span>
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

            {item.place && item.place.length ? (
              <React.Fragment>
                <span className="sd-list-item__text-label">location:</span>
                {item.place.map((place, index) =>
                  index > 0 ? (
                    <span key={"place" + index}>, {place.name}</span>
                  ) : (
                    <span key={"place" + index}>{place.name}</span>
                  )
                )}
              </React.Fragment>
            ) : null}
          </span>
        </div>
      </div>
      {store.isLanguagesEnabled && (
        <div className="sd-list-item__column sd-list-item__column--no-border">
          <Label text={item.language} style="hollow" />
        </div>
      )}

      <div className="sd-list-item__action-menu sd-list-item__action-menu--direction-row">
        {store.selectedList === "incoming" && (
          <IconButton
            icon="trash"
            tooltip={{ text: "Remove", flow: "left" }}
            onClick={(e) => {
              e.stopPropagation();
              removeConfirm();
            }}
          />
        )}

        <IconButton
          icon="pencil"
          tooltip={{ text: "Correct", flow: "left" }}
          onClick={(e) => {
            e.stopPropagation();
            store.actions.correctPackage(item);
          }}
        />
        <IconButton
          icon="expand-thin"
          tooltip={{ text: "Publish", flow: "left" }}
          onClick={(e) => {
            e.stopPropagation();
            store.actions.togglePublish(item);
          }}
        />
      </div>
      <Modal isOpen={state.confirm ? true : false}>{modalContent}</Modal>
    </div>
  );
};

ArticleItem.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default ArticleItem;
