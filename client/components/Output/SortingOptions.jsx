import React from "react";

import Dropdown from "../UI/Dropdown";
import Store from "./Store";

const SortingOptions = props => {
  const store = React.useContext(Store);

  const setSort = value => {
    let filters = { ...store.filters };

    filters.sort = value;
    store.actions.setFilters(filters);
  };

  const setOrder = value => {
    let filters = { ...store.filters };

    filters.order = value;
    store.actions.setFilters(filters);
  };

  return (
    <React.Fragment>
      <Dropdown
        button={
          <button className="dropdown__toggle">
            {store.filters.sort === "updatedAt" ? "Updated" : "Created"}
            <span className="dropdown__caret"></span>
          </button>
        }
      >
        <li>
          <button onClick={() => setSort("updatedAt")}>Updated</button>
        </li>
        <li>
          <button onClick={() => setSort("createdAt")}>Created</button>
        </li>
      </Dropdown>
      {store.filters.order === "desc" ? (
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
