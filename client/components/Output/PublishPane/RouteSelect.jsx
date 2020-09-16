import React, { Component } from "react";
import PropTypes from "prop-types";
import Store from "../Store";
import OptGroup from "../../UI/OptGroup";

const RouteSelect = (props) => {
  const store = React.useContext(Store);
  const pubConfig = store.config.publisher || {};

  let collectionRoutes = props.routes.filter(
    (route) => route.type === "collection"
  );
  let contentRoutes = props.routes.filter((route) => route.type === "content");
  let customRoutes = props.routes.filter(
    (route) => route.type != "content" && route.type != "collection"
  );

  return (
    <div className="sd-line-input sd-line-input--is-select sd-line-input--dark-ui sd-line-input--no-margin">
      <label className="sd-line-input__label">Route</label>
      <select
        name="routeId"
        className="sd-line-input__select"
        value={props.selectedRouteId}
        onChange={props.onChange}
      >
        {props.routes.length && !props.selectedRouteId && (
          <option value="" disabled>
            Select a route
          </option>
        )}

        {!props.routes.length && (
          <option value="" disabled>
            No routes defined
          </option>
        )}
        <OptGroup
          list={collectionRoutes}
          valueField="id"
          nameField="name"
          label="Collection"
        />
        {pubConfig.hideContentRoutesInPublishPane ? null : (
          <OptGroup
            list={contentRoutes}
            valueField="id"
            nameField="name"
            label="Content"
          />
        )}

        {pubConfig.hideCustomRoutesInPublishPane ? null : (
          <OptGroup
            list={customRoutes}
            valueField="id"
            nameField="name"
            label="Custom"
          />
        )}
      </select>
    </div>
  );
};

RouteSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectedRouteId: PropTypes.any.isRequired,
  routes: PropTypes.array.isRequired,
};

export default RouteSelect;
