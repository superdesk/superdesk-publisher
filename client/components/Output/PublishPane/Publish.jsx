import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import helpers from "../../../services/helpers";
import DropdownScrollable from "../../UI/DropdownScrollable";
import CheckButton from "../../UI/CheckButton";
import RelatedArticles from "./RelatedArticles";
import Destination from "./Destination";
import Store from "../Store";

class Publish extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this.state = {
      filter: "all",
      newDestinations: [],
      availableTenants: []
    };
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.destinations, prevProps.destinations)) {
      this.setState(
        { newDestinations: this.props.destinations },
        this.setAvailableTenants
      );
    }
  }

  setAvailableTenants = () => {
    let availableTenants = this.context.tenants;
    this.setState({ availableTenants });
  };

  setFilter = filter => this.setState({ filter: filter });

  updateDestination = (destination, index) => {
    let newDestinations = [...this.state.newDestinations];

    newDestinations[index] = destination;
    this.setState({ newDestinations });
  };

  removeDestination = index => {
    let newDestinations = [...this.state.newDestinations];

    newDestinations.splice(index, 1);
    this.setState({ newDestinations });
  };

  addDestination = tenant => {
    let newDestinations = [...this.state.newDestinations];
    let destination = {
      tenant: tenant,
      route: {},
      is_published_fbia: false,
      paywall_secured: false,
      status: "new",
      content_lists: []
    };

    newDestinations.unshift(destination);
    this.setState({ newDestinations });
  };

  convertDestination = item => {
    let destination = {
      tenant: item.tenant.code,
      route: item.route && item.route.id ? item.route.id : null,
      is_published_fbia: item.is_published_fbia,
      published: item.route && item.route.id ? true : false,
      paywall_secured: item.paywall_secured
    };

    if (
      item.status === "new" &&
      item.content_lists &&
      item.content_lists.length
    ) {
      destination.content_lists = item.content_lists;
    }

    return destination;
  };

  publish = () => {
    let newDestinations = [...this.state.newDestinations];
    let destinations = [];

    newDestinations.forEach(item => {
      if (item.status === "new") {
        destinations.push(this.convertDestination(item));
      } else {
        let originalItem = this.props.destinations.find(
          i => i.tenant.code === item.tenant.code
        );

        if (!originalItem) {
          destinations.push(this.convertDestination(item));
        } else {
          let updatedValues = helpers.getUpdatedValues(item, originalItem);

          if (!_.isEmpty(updatedValues, true)) {
            destinations.push(this.convertDestination(item));
          }
        }
      }
    });

    if (destinations.length) {
      this.context.publisher
        .publishArticle(
          { destinations: destinations },
          this.context.selectedItem.id
        )
        .then(() => {
          // $scope.$broadcast( todo
          //   "removeFromArticlesList",
          //   this.selectedArticle.id
          // );
          this.context.actions.togglePublish(null);
          this.context.actions.togglePreview(null);
        })
        .catch(err => {
          this.context.notify.error("Publishing failed!");
        });
    }
  };

  isChanged = () => {
    let updated = helpers.getUpdatedValues(
      this.state.newDestinations,
      this.props.destinations
    );
    return Object.keys(updated).length ? true : false;
  };

  render() {
    if (!this.context.selectedItem) return null;
    return (
      <React.Fragment>
        <div className="side-panel__content">
          <div className="side-panel__content-block side-panel__content-block--pad-small">
            <div className="side-panel__content-block-heading side-panel__content-block-heading--small-margin">
              {this.context.selectedItem.headline}
            </div>
          </div>
          <div className="side-panel__content-block side-panel__content-block--flex side-panel__content-block--space-between">
            <DropdownScrollable
              button={
                <button
                  className="btn btn--primary btn--icon-only-circle btn--large dropdown__toggle"
                  sd-tooltip="Add destination"
                  flow="right"
                >
                  <i className="icon-plus-large"></i>
                </button>
              }
            >
              {this.state.availableTenants.map(tenant => (
                <li key={"availableTenants" + tenant.code}>
                  <button onClick={() => this.addDestination(tenant)}>
                    {tenant.name}
                  </button>
                </li>
              ))}
            </DropdownScrollable>
            <div>
              <CheckButton
                label="All"
                onClick={() => this.setFilter("all")}
                isChecked={this.state.filter === "all" ? true : false}
              />

              <CheckButton
                label="Published"
                onClick={() => this.setFilter("published")}
                isChecked={this.state.filter === "published" ? true : false}
              />
              <CheckButton
                label="Unpublished"
                onClick={() => this.setFilter("unpublished")}
                isChecked={this.state.filter === "unpublished" ? true : false}
              />
            </div>
          </div>
          <div className="side-panel__content-block side-panel__content-block--pad-small">
            {this.state.newDestinations.map((destination, index) =>
              this.state.filter === "all" ||
              this.state.filter === destination.status ? (
                <Destination
                  destination={destination}
                  originalDestination={this.props.destinations.find(
                    dest => dest.tenant.code === destination.tenant.code
                  )}
                  update={destination =>
                    this.updateDestination(destination, index)
                  }
                  remove={() => this.removeDestination(index)}
                  key={"destination" + destination.tenant.code}
                />
              ) : null
            )}
          </div>

          <RelatedArticles destinations={this.props.destinations} />
        </div>
        <div
          className="side-panel__content-block-overlay-grid"
          ng-class="{'side-panel__content-block-overlay-grid--open' : webPublisherOutput.metaDataOverlayOpen}"
          ng-if="webPublisherOutput.activePublishPane === 'publish'"
          ng-include="'output/metaDataOverlay.html'"
        ></div>
        <div className="side-panel__footer side-panel__footer--button-box-large">
          <button
            className="btn btn--large btn--success btn--expanded"
            onClick={this.publish}
            disabled={this.isChanged() ? false : true}
          >
            Publish
          </button>
        </div>
      </React.Fragment>
    );
  }
}

Publish.propTypes = {
  destinations: PropTypes.array.isRequired
};

export default Publish;
