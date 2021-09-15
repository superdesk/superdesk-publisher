import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { gettext } from "../../superdeskApi";
import OptGroup from "../UI/OptGroup";

class RouteSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      routes: [],
      loading: true,
    };

    this.pubConfig = this.props.config.publisher || {};
  }

  componentDidMount() {
    this.getRoutes();
  }

  getRoutes = () => {
    axios
      .get(this.props.apiUrl + "content/routes/", {
        headers: this.props.apiHeader,
        params: { limit: 1000 },
      })
      .then((res) => {
        this.setState({
          routes: res.data._embedded._items,
          loading: false,
        });
      });
  };

  render() {
    let collectionRoutes = this.state.routes.filter(
      (route) => route.type === "collection"
    );
    let contentRoutes = this.state.routes.filter(
      (route) => route.type === "content"
    );
    let customRoutes = this.state.routes.filter(
      (route) => route.type != "content" && route.type != "collection"
    );

    return (
      <div className="sd-line-input sd-line-input--is-select sd-line-input--dark-ui sd-line-input--no-margin">
        <label className="sd-line-input__label">{gettext("Route")}</label>
        <select
          name="routeId"
          className="sd-line-input__select"
          value={this.props.selectedRouteId}
          onChange={this.props.onChange}
        >
          {this.state.loading && (
            <option value="" disabled>
              {gettext("Loading...")}
            </option>
          )}
          {this.state.routes.length && (
            <option value="" disabled>
              {gettext("Select a route")}
            </option>
          )}
          {!this.state.routes.length && !this.state.loading && (
            <option value="" disabled>
              {gettext("No routes defined")}
            </option>
          )}
          <OptGroup
            list={collectionRoutes}
            valueField="id"
            nameField="name"
            label={gettext("Collection")}
          />

          {this.pubConfig.hideContentRoutesInPublishPane ? null : (
            <OptGroup
              list={contentRoutes}
              valueField="id"
              nameField="name"
              label={gettext("Content")}
            />
          )}

          {this.pubConfig.hideCustomRoutesInPublishPane ? null : (
            <OptGroup
              list={customRoutes}
              valueField="id"
              nameField="name"
              label={gettext("Custom")}
            />
          )}
        </select>
      </div>
    );
  }
}

RouteSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectedRouteId: PropTypes.any.isRequired,
  apiHeader: PropTypes.object.isRequired,
  apiUrl: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
};

export default RouteSelect;
