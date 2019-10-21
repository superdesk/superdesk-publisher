import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import helpers from "../../../services/helpers";

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
      newDestinations: []
    };
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.destinations, prevProps.destinations)) {
      this.setState({ newDestinations: this.props.destinations });
    }
  }

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

  publish = () => {
    let newDestinations = [...this.state.newDestinations];

    // forcing predefined destinations pass through _updatedKeys filtering
    newDestinations.forEach(item => {
      if (item.status === "new") {
        item.forcePublishing = true;
      }
    });

    let updated = helpers.getUpdatedValues(
      newDestinations,
      this.props.destinations
    );

    let destinations = [];

    updated.map(item => {
      console.log(item);
      // let destination = {
      //   tenant: item,
      //   route:
      //     this.newDestinations[item].route &&
      //     this.newDestinations[item].route.id
      //       ? this.newDestinations[item].route.id
      //       : null,
      //   is_published_fbia:
      //     this.newDestinations[item] &&
      //     this.newDestinations[item].is_published_fbia === true,
      //   published:
      //     this.newDestinations[item].route &&
      //     this.newDestinations[item].route.id
      //       ? true
      //       : false,
      //   paywall_secured:
      //     this.newDestinations[item] &&
      //     this.newDestinations[item].paywall_secured === true
      // };

      // if (
      //   this.newDestinations[item].status === "new" &&
      //   this.newDestinations[item].content_lists.length
      // ) {
      //   destination.content_lists = this.newDestinations[item].content_lists;
      // }

      // destinations.push(destination);
    });

    // if (destinations.length) {
    //   publisher
    //     .publishArticle(
    //       { destinations: destinations },
    //       this.selectedArticle.id
    //     )
    //     .then(() => {
    //       $scope.$broadcast(
    //         "removeFromArticlesList",
    //         this.selectedArticle.id
    //       );
    //       this.closePublish();
    //       this.closePreview();
    //     })
    //     .catch(err => {
    //       notify.error("Publishing failed!");
    //     });
    // }
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
            <div className="dropdown" dropdown="">
              <button
                className="btn btn--primary btn--icon-only-circle btn--large dropdown__toggle"
                sd-tooltip="Add destination"
                flow="right"
                dropdown__toggle=""
              >
                <i className="icon-plus-large"></i>
              </button>
              <ul className="dropdown__menu">
                <li ng-repeat="site in webPublisherOutput.publishingAvailableSites">
                  <button ng-click="webPublisherOutput.publishingAddDestination(site)">
                    site.name
                  </button>
                </li>
              </ul>
            </div>
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
