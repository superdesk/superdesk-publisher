import React from "react";

import Dropdown from "../UI/Dropdown";

const SortingOptions = ({ filters, setFilters }) => {
  const setSort = value => {
    filters.sort = value;
    setFilters(filters);
  };

  const setOrder = value => {
    filters.order = value;
    setFilters(filters);
  };

  return (
    <React.Fragment>
      <Dropdown
        button={
          <button className="dropdown__toggle">
            {filters.sort === "published_at" ? "Publish date" : "Page views"}
            <span className="dropdown__caret"></span>
          </button>
        }
      >
        <li>
          <button onClick={() => setSort("published_at")}>Publish date</button>
        </li>
        <li>
          <button
            onClick={() => setSort("article_statistics.page_views_number")}
          >
            Page views
          </button>
        </li>
      </Dropdown>
      {filters.order === "desc" ? (
        <a
          className="icn-btn"
          sd-tooltip="Descending"
          flow="bottom"
          onClick={() => setOrder("asc")}
        >
          <i className="icon-descending"></i>
        </a>
      ) : (
        <a
          className="icn-btn"
          sd-tooltip="Ascending"
          flow="bottom"
          onClick={() => setOrder("desc")}
        >
          <i className="icon-ascending"></i>
        </a>
      )}
    </React.Fragment>
  );
};

export default SortingOptions;
