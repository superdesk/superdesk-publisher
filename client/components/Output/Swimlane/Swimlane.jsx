import React, { forwardRef } from "react";

import Store from "../Store";
import TenantBoard from "./TenantBoard";

const Swimlane = props => {
  return (
    <Store.Consumer>
      {store => (
        <div className="sd-kanban-list sd-d-inline-flex">
          {store.tenants.map(tenant => (
            <TenantBoard
              key={"tenantBoard" + tenant.code}
              tenant={tenant}
            ></TenantBoard>
          ))}
        </div>
      )}
    </Store.Consumer>
  );
};

export default Swimlane;
