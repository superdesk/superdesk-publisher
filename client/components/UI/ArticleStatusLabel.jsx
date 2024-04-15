import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const ArticleStatusLabel = ({ article, style, url }) => {
  if (article.status === "published") {
    return (
      <a
        className="label label--success cursorPointer sd-margin-r--1"
        href={url}
        target="_blank"
        style={style}
      >
        {article.tenant && article.tenant.name}
        {article.route && <span> / {article.route.name}</span>}
      </a>
    );
  } else {
    return (
      <span
        className={classNames("label sd-margin-r--1", {
          "label--alert": article.status == "unpublished"
        })}
        style={style}
      >
        {article.tenant && article.tenant.name}
        {article.route && <span> / {article.route.name}</span>}
      </span>
    );
  }
};

ArticleStatusLabel.propTypes = {
  article: PropTypes.object.isRequired,
  style: PropTypes.object,
  url: PropTypes.string
};

export default ArticleStatusLabel;
