import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import _ from "lodash";

import Store from "../Store";

class Unpublish extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {};
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  toggleUnpublishFlag = (item, index) => {
    let destinations = [...this.props.destinations];
    destinations[index] = { ...item, unpublish: item.unpublish ? false : true };

    this.props.setDestinations(destinations);
  };

  unpublish = () => {
    let tenants = this.props.destinations
      .filter(item => item.unpublish)
      .map(item => item.tenant.code);

    this.context.publisher
      .unPublishArticle({ tenants: tenants }, this.context.selectedItem.id)
      .then(() => {
        this.context.actions.togglePublish(null);
        this.context.actions.togglePreview(null);
        let event = new CustomEvent("refreshOutputLists", {
          detail: true
        });
        document.dispatchEvent(event);
      });
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
          <div className="side-panel__content-block">
            <div className="form__row form__row--small-padding">
              <div className="flex-grid flex-grid--boxed-small flex-grid--wrap-items flex-grid--small-1">
                {this.props.destinations.map((item, index) => {
                  if (item.status === "published") {
                    return (
                      <button
                        key={"unpublishbutton" + item.tenant.code}
                        onClick={() => this.toggleUnpublishFlag(item, index)}
                        className={classNames("btn__check flex-grid__item", {
                          "btn__check--active": item.unpublish
                        })}
                      >
                        {item.tenant.name}
                      </button>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="side-panel__footer side-panel__footer--button-box-large">
          <button
            className="btn btn--large btn--alert btn--expanded"
            disabled={
              !this.props.destinations.filter(item => item.unpublish).length
            }
            onClick={this.unpublish}
          >
            Unpublish
          </button>
        </div>
      </React.Fragment>
    );
  }
}

Unpublish.propTypes = {
  destinations: PropTypes.array.isRequired,
  setDestinations: PropTypes.func.isRequired
};

export default Unpublish;
