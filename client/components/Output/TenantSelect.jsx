import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const TenantSelect = props => {
  return (
    <React.Fragment>
      <div className="subnav__spacer subnav__spacer--no-margin" />
      <div
        className={classNames("subnav__content-bar sd-flex-no-shrink", {
          "sd-margin-l--1 sd-margin-r--1": props.isSuperdeskEditorOpen
        })}
      >
        <div className="dropdown dropdown--align-right" dropdown="">
          <button
            className="dropdown__toggle dropdown-toggle"
            dropdown-toggle=""
            aria-haspopup="true"
            aria-expanded="false"
          >
            webPublisherOutput.filterByTenant.name || 'All Tenants'
            <span className="dropdown__caret" />
          </button>
          <ul className="dropdown__menu dropdown__menu--scrollable">
            <li>
              <button ng-click="webPublisherOutput.filterByTenant=null">
                All Tenants
              </button>
            </li>
            <li className="dropdown__menu-divider" />
            <li ng-repeat="tenant in webPublisherOutput.sites">
              <button ng-click="webPublisherOutput.filterByTenant=tenant">
                tenant.name
              </button>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

TenantSelect.propTypes = {
  isSuperdeskEditorOpen: PropTypes.bool.isRequired
};

export default TenantSelect;
