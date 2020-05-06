import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import _ from "lodash";
import { ToggleBox } from "../UI/ToggleBox";
import Destination from "./Destination";
import AddWebsite from "./AddWebsite";

class TargetedPublishing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newDestination: {},
    };
  }

  setNewDestination = (site) => {
    this.setState({
      newDestination: site,
    });
  };

  onSave = () => {
    this.setNewDestination({});
    this.props.reload();
  };

  render() {
    return (
      <ToggleBox
        title="Web publishing"
        style="toggle-box--dark sp--dark-ui toggle-box--circle"
        isOpen={true}
      >
        {!this.props.rules.length && (
          <div className="tp-alert">
            No websites have been set, this article won't show up on any
            website. It will go to: <br />
            <span style={{ fontWeight: "500" }}>
              Publisher > Output Control > Incoming list
            </span>
          </div>
        )}
        {this.props.rules.map((rule, index) => (
          <Destination
            key={rule.tenant.code}
            isOpen={false}
            rule={rule}
            apiHeader={this.props.apiHeader}
            config={this.props.config}
            item={this.props.item}
            cancel={this.onSave}
            done={this.onSave}
          />
        ))}

        {this.state.newDestination && this.state.newDestination.id && (
          <Destination
            key={this.state.newDestination.id}
            isOpen={true}
            site={this.state.newDestination}
            apiHeader={this.props.apiHeader}
            config={this.props.config}
            item={this.props.item}
            cancel={() => this.setNewDestination({})}
            done={this.onSave}
          />
        )}
        <AddWebsite
          setNewDestination={(newDestination) =>
            this.setNewDestination(newDestination)
          }
          apiHeader={this.props.apiHeader}
          apiUrl={this.props.apiUrl}
          rules={this.props.rules}
        />
      </ToggleBox>
    );
  }
}

TargetedPublishing.propTypes = {
  rules: PropTypes.array.isRequired,
  apiUrl: PropTypes.string.isRequired,
  apiHeader: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  reload: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
};

export default TargetedPublishing;
