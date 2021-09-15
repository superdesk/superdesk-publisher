import React from "react";

import Dropdown from "../UI/Dropdown";
import Store from "./Store";

import { IconButton } from "superdesk-ui-framework/react";
import { gettext } from "../../superdeskApi";

const SortingOptions = (props) => {
  const store = React.useContext(Store);

  const setSort = (value) => {
    let filters = { ...store.filters };

    filters.sort = value;
    store.actions.setFilters(filters);
  };

  const setOrder = (value) => {
    let filters = { ...store.filters };

    filters.order = value;
    store.actions.setFilters(filters);
  };

  return (
    <React.Fragment>
      <Dropdown
        button={
          <button className="dropdown__toggle">
            {store.filters.sort === "updated_at" ?  gettext("Updated") :  gettext("Created")}
            <span className="dropdown__caret"></span>
          </button>
        }
      >
        <li>
          <button onClick={() => setSort("updated_at")}> {gettext("Updated")}</button>
        </li>
        <li>
          <button onClick={() => setSort("created_at")}> {gettext("Created")}</button>
        </li>
      </Dropdown>
      {store.filters.order === "desc" ? (
        <IconButton
          icon="descending"
          tooltip={{ text:  gettext("Descending"), flow: "bottom" }}
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
