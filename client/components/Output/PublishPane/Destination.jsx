import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Store from "../Store";
import OptionSwitches from "./OptionSwitches";
import RouteSelect from "./RouteSelect";
import MetadataButtons from "./MetadataButtons";
import ContentListPicker from "./ContentListPicker";

class Destination extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      isOpen: this.props.destination.status === "new" ? true : false
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  handleRouteChange = e => {
    const routeId = parseInt(e.target.value);
    let dest = { ...this.props.destination };
    let tenantRoutes = this.getTenantRoutes();

    dest.route = tenantRoutes.find(r => r.id === routeId);
    this.props.update(dest);
  };

  handleSwitchChange = (value, fieldName) => {
    const dest = { ...this.props.destination };
    dest[fieldName] = value;
    this.props.update(dest);
  };

  shouldItemMarkedUnpublished = () => {
    if (this.props.destination.status !== "unpublished") return false;

    // checking if route changed
    return (
      this.props.originalDestination &&
      this.props.originalDestination.route &&
      this.props.destination.route &&
      this.props.originalDestination.route.id ===
        this.props.destination.route.id
    );
  };

  getTenant = () =>
    this.context.tenants.find(
      tenant => tenant.code === this.props.destination.tenant.code
    );

  getTenantRoutes = () => {
    const tenant = this.getTenant();

    return tenant.routes.map(route => {
      route.name = route.name.replace(tenant.name + " / ", "");
      return route;
    });
  };

  render() {
    const { destination } = this.props;
    let shouldItemMarkedUnpublished = this.shouldItemMarkedUnpublished();
    let tenant = this.getTenant();
    let tenantRoutes = this.getTenantRoutes();

    return (
      <div
        className={classNames("sd-collapse-box sd-shadow--z2", {
          "sd-collapse-box--open": this.state.isOpen
        })}
      >
        <div className="sd-collapse-box__header" onClick={this.toggle}>
          <div className="sd-list-item">
            <div
              className={classNames("sd-list-item__dot", {
                "sd-list-item__dot--success": !shouldItemMarkedUnpublished,
                "sd-list-item__dot--locked": shouldItemMarkedUnpublished
              })}
            ></div>
            <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
              <div className="sd-list-item__row">
                <span className="sd-overflow-ellipsis sd-list-item--element-grow">
                  <span className="sd-list-item__text-strong">
                    {destination.tenant.name}
                  </span>
                </span>
                {destination.status === "new" ? (
                  <a
                    className="icn-btn disabled"
                    sd-tooltip="Remove tenant"
                    flow="left"
                    onClick={event => {
                      this.props.remove();
                      event.stopPropagation();
                    }}
                  >
                    <i className="icon-trash"></i>
                  </a>
                ) : (
                  <a className="icn-btn disabled"></a>
                )}
              </div>
              <div className="sd-list-item__row">
                <span
                  className={classNames("sd-overflow-ellipsis label", {
                    "label--success": !shouldItemMarkedUnpublished
                  })}
                >
                  {shouldItemMarkedUnpublished
                    ? "unpublished"
                    : destination.route
                    ? destination.route.name
                    : null}
                </span>
                {!!destination.is_published_fbia && (
                  <span className="sd-list-item__inline-text sd-list-item--element-grow no-line-height">
                    <i className="icon-facebook icon--blue icon--full-opacity"></i>
                  </span>
                )}
                {!!destination.paywall_secured && (
                  <span className="sd-list-item__inline-text no-line-height">
                    <i className="icon-paywall icon--full-opacity icon--orange"></i>
                  </span>
                )}
              </div>

              {destination.content_lists && destination.content_lists.length ? (
                <div className="sd-list-item__row">
                  <span className="sd-list-item__text-label">
                    Content lists:
                  </span>
                  <span className="sd-overflow-ellipsis">
                    {destination.content_lists.map((list, index) =>
                      index > 0 ? ", " + list.name : list.name
                    )}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <div className="sd-collapse-box__content-wraper">
          <div className="sd-collapse-box__content">
            <div
              className={classNames("sd-list-item__dot", {
                "sd-list-item__dot--success": !shouldItemMarkedUnpublished,
                "sd-list-item__dot--locked": shouldItemMarkedUnpublished
              })}
            ></div>
            <div className="sd-collapse-box__tools sd-collapse-box__tools--flex">
              <a
                className="sd-collapse-box__collapse-btn"
                onClick={this.toggle}
              >
                <span className="icn-btn">
                  <i className="icon-chevron-up-thin"></i>
                </span>
              </a>
              {destination.status === "new" && (
                <a
                  className="icn-btn"
                  sd-tooltip="Remove tenant"
                  flow="left"
                  onClick={event => {
                    this.props.remove();
                    event.stopPropagation();
                  }}
                >
                  <i className="icon-trash"></i>
                </a>
              )}
            </div>
            <div className="sd-collapse-box__content-block sd-collapse-box__content-block--top">
              <div className="sd-list-item sd-list-item--no-bg sd-list-item--no-hover">
                <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                  <div className="sd-list-item__row">
                    <span className="sd-overflow-ellipsis sd-list-item__text-strong">
                      {destination.tenant.name}
                    </span>
                    {destination.live_url &&
                    this.props.originalDestination &&
                    this.props.originalDestination.route.id ===
                      destination.route.id ? (
                      <a
                        href={destination.live_url}
                        target="_blank"
                        className="icn-btn"
                        sd-tooltip="Preview"
                        flow="bottom"
                      >
                        <i className="icon-external icon--full-opacity icon--white"></i>
                      </a>
                    ) : null}

                    {destination.route.id &&
                    this.props.originalDestination &&
                    (!destination.live_url ||
                      this.props.originalDestination.route.id !==
                        destination.route.id) &&
                    destination.status != "unpublished" ? (
                      <a
                        onClick={() => this.props.openPreview(destination)}
                        className="icn-btn"
                        sd-tooltip="Preview"
                        flow="bottom"
                      >
                        <i className="icon-external icon--full-opacity icon--white"></i>
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            {!destination.tenant.output_channel && (
              <div className="form__row">
                <RouteSelect
                  routes={tenantRoutes}
                  onChange={e => this.handleRouteChange(e)}
                  selectedRouteId={
                    this.props.destination.route &&
                    this.props.destination.route.id
                      ? this.props.destination.route.id
                      : ""
                  }
                />
              </div>
            )}
            <OptionSwitches
              fbiaEnabled={tenant.paywall_enabled}
              paywallEnabled={tenant.fbia_enabled}
              destination={this.props.destination}
              onChange={(value, fieldName) =>
                this.handleSwitchChange(value, fieldName)
              }
            />

            {destination.content_lists &&
            destination.content_lists.length &&
            destination.status !== "new" ? (
              <div className="form__row">
                <label className="form-label">Content lists</label>
                <div>
                  {destination.content_lists.map((list, index) => (
                    <span
                      className="text--lighter text--italic"
                      key={"contentlistsdestinationdeep" + list.id + "" + index}
                    >
                      {index > 0 ? ", " + list.name : list.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {destination.status === "new" && (
              <ContentListPicker
                destination={this.props.destination}
                update={this.props.update}
              />
            )}

            {!destination.status !== "new" ? (
              <div className="form__row" ng-if="destination.status !== 'new'">
                <MetadataButtons
                  open={type =>
                    this.props.openMetadataEditor(this.props.destination, type)
                  }
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

Destination.propTypes = {
  destination: PropTypes.object.isRequired,
  originalDestination: PropTypes.object,
  update: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  openMetadataEditor: PropTypes.func.isRequired,
  openPreview: PropTypes.func.isRequired
};

export default Destination;
