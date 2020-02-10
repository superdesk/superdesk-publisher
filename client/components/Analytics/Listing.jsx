import React from "react";
import PropTypes from "prop-types";

import VirtualizedList from "../generic/VirtualizedList";
import ArticleItem from "./ArticleItem";

const Listing = props => {
  return (
    <div className="sd-column-box__main-column-inner sd-d-flex">
      <div
        className="sd-flex-table sd-table--shadowed sd-table--action-hover"
        style={{ flexGrow: "1", position: "relative" }}
      >
        <div className="sd-flex-table__row sd-flex-table--head">
          <div className="sd-flex-table__cell sd-flex-grow">
            <div>Title</div>
          </div>
          <div className="sd-flex-table__cell">&nbsp;</div>
          <div className="sd-flex-table__cell">
            <div>Page Views</div>
          </div>
          {/* <div className="sd-flex-table__cell">
          <div>Click Rate</div>
        </div>
        <div className="sd-flex-table__cell">
          <div>Impressions</div>
        </div> */}
        </div>
        {!props.articles.loading &&
          props.articles.items &&
          !props.articles.items.length && (
            <p style={{ padding: "1em", textAlign: "center" }}>
              No results found
            </p>
          )}
        {!props.loading && (
          <VirtualizedList
            hasNextPage={
              props.articles.totalPages > props.articles.page ? true : false
            }
            isNextPageLoading={props.articles.loading}
            loadNextPage={props.queryArticles}
            items={props.articles.items}
            itemSize={props.articles.itemSize}
            ItemRenderer={ArticleItem}
            heightSubtract={46}
          />
        )}
      </div>
    </div>
  );
};

Listing.propTypes = {
  articles: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  queryArticles: PropTypes.func.isRequired
};

export default Listing;
