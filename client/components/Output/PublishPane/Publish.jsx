import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

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

  componentDidUpdate() {
    if (!_.isEqual(this.props.destinations, this.state.newDestinations)) {
      this.setNewDestinations(this.props.destinations);
    }
  }

  setNewDestinations = newDestinations => this.setState({ newDestinations });

  setFilter = filter => this.setState({ filter: filter });

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
            {this.state.newDestinations.map(destination =>
              this.state.filter === "all" ||
              this.state.filter === destination.status ? (
                <Destination
                  destination={destination}
                  originalDestination={this.props.destinations.find(
                    dest => dest.tenant.code === destination.tenant.code
                  )}
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
            ng-disabled="webPublisherOutput._isEmpty(webPublisherOutput.newDestinations)"
            ng-click="webPublisherOutput.publishArticle()"
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
