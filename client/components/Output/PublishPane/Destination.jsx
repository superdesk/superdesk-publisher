import React from "react";
import PropTypes, { object } from "prop-types";
import classNames from "classnames";
import _ from "lodash";

import Store from "../Store";
import RouteSelect from "./RouteSelect";
import OptionSwitches from "./OptionSwitches";

class Destination extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      isOpen: false,
      newDestination: props.destination
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

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

  render() {
    const { destination } = this.props;
    let shouldItemMarkedUnpublished = this.shouldItemMarkedUnpublished();

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
                      webPublisherOutput.publishingRemoveDestination(
                        destination
                      );
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

              {destination.content_lists && destination.content_lists.length && (
                <div className="sd-list-item__row">
                  <span className="sd-list-item__text-label">
                    Content lists:
                  </span>
                  <span className="sd-overflow-ellipsis">
                    <span ng-repeat="list in destination.content_lists">
                      webPublisherOutput.getContentListName(list,
                      destination.tenant.content_lists)
                      <span ng-show="$index !== destination.content_lists.length - 1">
                        ,{" "}
                      </span>
                    </span>
                  </span>
                </div>
              )}
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
                  ng-click="webPublisherOutput.publishingRemoveDestination(destination); $event.stopPropagation();"
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
                    <a
                      ng-if="destination.live_url && webPublisherOutput.publishedDestinations[destination.tenant.code].route.id === destination.route.id"
                      ng-href="{{destination.live_url}}"
                      target="_blank"
                      className="icn-btn"
                      sd-tooltip="Preview"
                      flow="bottom"
                    >
                      <i className="icon-external icon--full-opacity icon--white"></i>
                    </a>

                    <a
                      ng-if='destination.route.id && ( !destination.live_url || webPublisherOutput.publishedDestinations[destination.tenant.code].route.id !== destination.route.id) && destination.status != "unpublished"'
                      ng-click="webPublisherOutput.openArticlePreview(destination.route.id, destination.tenant)"
                      className="icn-btn"
                      sd-tooltip="Preview"
                      flow="bottom"
                    >
                      <i className="icon-external icon--full-opacity icon--white"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {!this.state.newDestination.tenant.output_channel && (
              <div className="form__row">
                <RouteSelect
                  routes={[]}
                  onChange={e => this.handleRouteChange(e)}
                  selectedRouteId={
                    this.state.newDestination.route &&
                    this.state.newDestination.route.id
                      ? this.state.newDestination.route.id
                      : ""
                  }
                />
              </div>
            )}
            <OptionSwitches
              fbiaEnabled={this.state.newDestination.tenant.paywall_enabled}
              paywallEnabled={this.state.newDestination.tenant.fbia_enabled}
              destination={this.state.newDestination}
              onChange={(value, fieldName) =>
                this.handleSwitchChange(value, fieldName)
              }
            />

            <div
              className="form__row"
              ng-include="'output/publish-pane-listItem-contentLists.html'"
            ></div>
            <div className="form__row" ng-if="destination.status !== 'new'">
              <div
                sd-toggle-box
                data-title="Meta data"
                data-open="false"
                data-style="circle"
              >
                <div className="sd-list-item-group sd-shadow--z1 no-margin">
                  <div
                    className="sd-list-item"
                    ng-click="webPublisherOutput.toggleMetaDataOverlay('Facebook', destination)"
                  >
                    <div className="sd-list-item__border"></div>
                    <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                      <div className="sd-list-item__row">
                        <span className="sd-overflow-ellipsis">Facebook</span>
                      </div>
                    </div>
                    <div className="sd-list-item__action-menu">
                      <i className="icon-chevron-right-thin"></i>
                    </div>
                  </div>
                  <div
                    className="sd-list-item"
                    ng-click="webPublisherOutput.toggleMetaDataOverlay('Twitter', destination)"
                  >
                    <div className="sd-list-item__border"></div>
                    <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                      <div className="sd-list-item__row">
                        <span className="sd-overflow-ellipsis">Twitter</span>
                      </div>
                    </div>
                    <div className="sd-list-item__action-menu">
                      <i className="icon-chevron-right-thin"></i>
                    </div>
                  </div>

                  <div
                    className="sd-list-item"
                    ng-click="webPublisherOutput.toggleMetaDataOverlay('SEO', destination)"
                  >
                    <div className="sd-list-item__border"></div>
                    <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                      <div className="sd-list-item__row">
                        <span className="sd-overflow-ellipsis">
                          SEO / Meta Tags
                        </span>
                      </div>
                    </div>
                    <div className="sd-list-item__action-menu">
                      <i className="icon-chevron-right-thin"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Destination.propTypes = {
  destination: PropTypes.object.isRequired,
  originalDestination: PropTypes.object
};

export default Destination;
