import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import DropdownScrollable from "../UI/DropdownScrollable";
import Store from "./Store";

const TenantSelect = props => {
  const store = React.useContext(Store);

  const setTenant = tenant => {
    let filters = { ...store.filters };

    filters.tenant = tenant;
    store.actions.setFilters(filters);
  };

  if (store.tenants.length < 2) return null;

  return (
    <React.Fragment>
      <div className="subnav__spacer subnav__spacer--no-margin" />
      <div
        className={classNames("subnav__content-bar sd-flex-no-shrink sd-margin-x--0")}
      >
        <DropdownScrollable
          button={
            <button className="dropdown__toggle navbtn navbtn--text-only dropdown-toggle">
              {store.filters.tenant ? store.filters.tenant.name : "All Tenants"}
              <span className="dropdown__caret" />
            </button>
          }
          classes="dropdown--align-right"
        >
          <li>
            <button onClick={() => setTenant(null)}>All Tenants</button>
          </li>
          <li className="dropdown__menu-divider" />
          {store.tenants.map(item => (
            <li key={"tenantSelect" + item.code}>
              <button onClick={() => setTenant(item)}>{item.name}</button>
            </li>
          ))}
        </DropdownScrollable>
      </div>
    </React.Fragment>
  );
};

TenantSelect.propTypes = {};

export default TenantSelect;
