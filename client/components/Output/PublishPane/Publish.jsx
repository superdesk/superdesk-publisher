import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import helpers from "../../../services/helpers";
import DropdownScrollable from "../../UI/DropdownScrollable";
import Loading from "../../UI/Loading/Loading";

import {
  Button,
  CheckButtonGroup,
  RadioButton,
} from "superdesk-ui-framework/react";
import RelatedArticles from "./RelatedArticles";
import Destination from "./Destination";
import MetadataEditor from "./MetadataEditor";
import Store from "../Store";

class Publish extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this.state = {
      filter: "all",
      newDestinations: props.destinations,
      availableTenants: [],
      metadataEditor: {
        isOpen: false,
        destination: null,
        type: "facebook",
      },
    };
  }

  componentDidMount() {
    this.setAvailableTenants();
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.destinations, prevProps.destinations)) {
      this.setState(
        {
          newDestinations: this.props.destinations,
          metadataEditor: {
            isOpen: false,
            destination: null,
            type: "Facebook",
          },
        },
        this.setAvailableTenants
      );
    }
  }

  setAvailableTenants = () => {
    let availableTenants = [...this.context.tenants];
    let newDestinations = [...this.state.newDestinations];

    newDestinations.map((dest) => {
      let tenantIndex = availableTenants.findIndex(
        (tenant) => tenant.code === dest.tenant.code
      );

      if (tenantIndex >= 0) {
        availableTenants.splice(tenantIndex, 1);
      }
    });

    this.setState({ availableTenants });
  };

  setFilter = (filter) => this.setState({ filter: filter });

  toggleMetadataEditor = (destination, type) => {
    this.setState({
      metadataEditor: {
        isOpen: !this.state.metadataEditor.isOpen,
        destination: destination,
        type: type,
      },
    });
  };

  updateDestination = (destination, index) => {
    let newDestinations = [...this.state.newDestinations];

    newDestinations[index] = destination;
    this.setState({ newDestinations });
  };

  removeDestination = (index) => {
    let newDestinations = [...this.state.newDestinations];

    newDestinations.splice(index, 1);
    this.setState({ newDestinations }, this.setAvailableTenants);
  };

  addDestination = (tenant) => {
    let newDestinations = [...this.state.newDestinations];
    let destination = {
      tenant: tenant,
      route: {},
      is_published_fbia: false,
      paywall_secured: false,
      is_published_to_apple_news: false,
      status: "new",
      content_lists: [],
    };

    newDestinations.unshift(destination);
    this.setState({ newDestinations }, this.setAvailableTenants);
  };

  convertDestination = (item) => {
    let destination = {
      tenant: item.tenant.code,
      route: item.route && item.route.id ? item.route.id : null,
      is_published_fbia: item.is_published_fbia,
      published: item.route && item.route.id ? true : false,
      paywall_secured: item.paywall_secured,
      is_published_to_apple_news: item.is_published_to_apple_news,
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

    newDestinations.forEach((item) => {
      if (item.status === "new") {
        destinations.push(this.convertDestination(item));
      } else {
        let originalItem = this.props.destinations.find(
          (i) => i.tenant.code === item.tenant.code
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
          let event = new CustomEvent("refreshOutputLists", {
            detail: true,
          });
          document.dispatchEvent(event);
          this.context.actions.togglePublish(null);
          this.context.actions.togglePreview(null);
        })
        .catch((err) => {
          this.context.notify.error("Publishing failed!");
        });
    }
  };

  shouldPublishButtonBeDisabled = () => {
    // if there are destinations without route - should be disabled
     let destinationsWithoutRoute = this.state.newDestinations.filter(
      (destination) => (Object.keys(destination.route).length ? false : true)
    );

    if (destinationsWithoutRoute.length) return true;

    // if there are destination that are not published - status "new" and have route assigned (from previous check) - should not be disabled
     let destinationsNotPublished = this.state.newDestinations.filter(
      (destination) => destination.status === "new" ? true : false
    );

    if (destinationsNotPublished.length) return false;
    
    // otherwise lets check if anything got updated
    let updated = helpers.getUpdatedValues(
      this.state.newDestinations,
      this.props.destinations
    );
    return Object.keys(updated).length ? false : true;
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
                <Button
                  type="primary"
                  icon="plus-large"
                  shape="round"
                  iconOnly={true}
                  sd-tooltip="Add destination"
                  flow="right"
                  disabled={this.state.availableTenants.length ? false : true}
                />
              }
            >
              {this.state.availableTenants.map((tenant) => (
                <li key={"availableTenants" + tenant.code}>
                  <button onClick={() => this.addDestination(tenant)}>
                    {tenant.name}
                  </button>
                </li>
              ))}
            </DropdownScrollable>
            <div>
              <CheckButtonGroup>
                <RadioButton
                  value={this.state.filter}
                  options={[
                    { value: "all", label: "All" },
                    { value: "published", label: "Published" },
                    { value: "unpublished", label: "Unpublished" },
                  ]}
                  onChange={(value) => this.setFilter(value)}
                />
              </CheckButtonGroup>
            </div>
          </div>
          <div className="side-panel__content-block side-panel__content-block--pad-small">
            {this.props.loading && <Loading />}
            {this.state.newDestinations.map((destination, index) =>
              this.state.filter === "all" ||
              this.state.filter === destination.status ? (
                <Destination
                  destination={destination}
                  originalDestination={this.props.destinations.find(
                    (dest) => dest.tenant.code === destination.tenant.code
                  )}
                  update={(destination) =>
                    this.updateDestination(destination, index)
                  }
                  openMetadataEditor={(destination, type) =>
                    this.toggleMetadataEditor(destination, type)
                  }
                  remove={() => this.removeDestination(index)}
                  openPreview={(item) => this.props.openPreview(item)}
                  key={"destination" + destination.tenant.code}
                />
              ) : null
            )}
          </div>

          <RelatedArticles destinations={this.props.destinations} />
        </div>

        <MetadataEditor
          isOpen={this.state.metadataEditor.isOpen}
          destination={this.state.metadataEditor.destination}
          type={this.state.metadataEditor.type}
          close={() =>
            this.toggleMetadataEditor(null, this.state.metadataEditor.type)
          }
        />

        <div className="side-panel__footer side-panel__footer--button-box-large">
          <Button
            text="Publish"
            type="success"
            expand={true}
            onClick={this.publish}
            disabled={this.shouldPublishButtonBeDisabled()}
          />
        </div>
      </React.Fragment>
    );
  }
}

Publish.propTypes = {
  destinations: PropTypes.array.isRequired,
  openPreview: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default Publish;
