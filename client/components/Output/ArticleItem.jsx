import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import _ from "lodash";
import { Button, IconButton, Label } from "superdesk-ui-framework/react";
import Store from "./Store";
import ArticleStatusLabel from "../UI/ArticleStatusLabel";
import Modal from "../UI/Modal";
import { gettext } from "../../superdeskApi";

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
      .catch((e) => store.notify.error(gettext("Cannot remove article")));
  };

  let modalContent = null;
  if (state.confirm) {
    modalContent = (
      <React.Fragment>
        <div className="modal__header ">
          <h3>{gettext("Confirm")}</h3>
        </div>
        <div className="modal__body ">
          {gettext("Please confirm you want to remove article from incoming list.")}
        </div>
        <div className="modal__footer">
          <Button
            text={gettext("Cancel")}
            onClick={(e) => {
              e.stopPropagation();
              removeCancel();
            }}
          />
          <Button
            text={gettext("Remove")}
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

          <time
            title={moment(item.created_at).format()}
            sd-tooltip={moment(item.created_at).format("HH:mm")}
            flow="right"
          >
            {moment(item.created_at).format("YYYY-MM-DD")}
          </time>
          {item.updated_at && item.updated_at !== item.created_at ? (
            <time
              title={moment(item.updated_at).format()}
              sd-tooltip={moment(item.updated_at).format("HH:mm")}
              flow="right"
            >
              ({gettext("updated at")}: {moment(item.updated_at).format("YYYY-MM-DD")})
            </time>
          ) : null}
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
              sd-tooltip={gettext("Paywall secured")}
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
                    article.tenant &&
                    article.tenant.pwa_config &&
                    article.tenant.pwa_config.url
                      ? article.tenant.pwa_config.url +
                        article._links.online.href
                      : article.tenant
                      ? article.tenant.subdomain
                        ? "https://" +
                          article.tenant.subdomain +
                          "." +
                          article.tenant.domain_name +
                          article._links.online.href
                        : "https://" +
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
              +{item.articles.length - 3} {gettext("more")}
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
                <span className="sd-list-item__text-label">{gettext("pageviews")}:</span>
                <span>{item.page_views_count}</span>
              </React.Fragment>
            ) : null}

            {store.selectedList === "published" && item.comments_count ? (
              <React.Fragment>
                <span className="sd-list-item__text-label">{gettext("comments")}:</span>
                <span>{item.comments_count}</span>
              </React.Fragment>
            ) : null}

            {item.place && item.place.length ? (
              <React.Fragment>
                <span className="sd-list-item__text-label">{gettext("location")}:</span>
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
            tooltip={{ text: gettext("Remove"), flow: "left" }}
            onClick={(e) => {
              e.stopPropagation();
              removeConfirm();
            }}
          />
        )}

        <IconButton
          icon="pencil"
          tooltip={{ text: gettext("Correct"), flow: "left" }}
          onClick={(e) => {
            e.stopPropagation();
            store.actions.correctPackage(item);
          }}
        />
        <IconButton
          icon="expand-thin"
          tooltip={{ text: gettext("Publish"), flow: "left" }}
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
