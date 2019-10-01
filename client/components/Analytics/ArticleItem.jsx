import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

const ArticleItem = ({ item, style }) => {
  return (
    <div className="sd-flex-table__row" style={style}>
      <div className="sd-flex-table__cell sd-flex-grow">
        <div className="sd-text__strong">
          <strong>{item.title}.</strong>
        </div>
        <div>
          <span className="sd-text__date-time sd-text__italic">Category: </span>
          <span className="sd-text__normal sd-margin-r--1">
            {item.route && item.route.name}
          </span>
          {item.authors && item.authors.length ? (
            <React.Fragment>
              <span className="sd-text__date-time sd-text__italic">
                Authors:{" "}
              </span>
              <span className="sd-text__normal sd-margin-r--1">
                {item.authors.map((author, index) =>
                  index > 0 ? (
                    <span key={"author_" + index}>{author.name}, </span>
                  ) : (
                    <span key={"author_" + index}>{author.name} </span>
                  )
                )}
              </span>
            </React.Fragment>
          ) : null}

          <span className="sd-text__date-time sd-text__italic ">
            Published:{" "}
          </span>
          <time>{moment(item.published_at).format("YYYY.MM.DD, HH:mm")}</time>
        </div>
      </div>
      <div className="sd-flex-table__cell sd-text__center">
        {item._links && item._links.online && item._links.online.href ? (
          <a
            className="icn-btn"
            target="_blank"
            href={
              item.tenant.subdomain
                ? "http://" +
                  item.tenant.subdomain +
                  "." +
                  item.tenant.domain_name +
                  item._links.online.href
                : "http://" + item.tenant.domain_name + item._links.online.href
            }
          >
            <i className="icon-external" />
          </a>
        ) : null}
      </div>
      <div className="sd-flex-table__cell">
        {item.article_statistics.page_views_number}
      </div>
      {/* <div className="sd-flex-table__cell">
        {item.article_statistics.internal_click_rate}
      </div>
      <div className="sd-flex-table__cell">
        {item.article_statistics.impressions_number}
      </div> */}
    </div>
  );
};

ArticleItem.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

export default ArticleItem;
