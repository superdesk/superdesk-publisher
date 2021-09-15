import React from "react";
import { IconButton } from "superdesk-ui-framework/react";
import Dropdown from "../UI/Dropdown";
import {gettext} from '../../superdeskApi';

const SortingOptions = ({ filters, setFilters }) => {
  const setSort = (value) => {
    filters.sort = value;
    setFilters(filters);
  };

  const setOrder = (value) => {
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
          <button onClick={() => setSort("published_at")}>{gettext("Publish date")}</button>
        </li>
        <li>
          <button
            onClick={() => setSort("article_statistics.page_views_number")}
          >
            {gettext("Page views")}
          </button>
        </li>
      </Dropdown>
      {filters.order === "desc" ? (
        <IconButton
          icon="descending"
          tooltip={{ text: gettext("Descending"), flow: "bottom" }}
          onClick={() => setOrder("asc")}
        />
      ) : (
        <IconButton
          icon="ascending"
          tooltip={{ text: gettext("Ascending"), flow: "bottom" }}
          onClick={() => setOrder("desc")}
        />
      )}
    </React.Fragment>
  );
};

export default SortingOptions;
