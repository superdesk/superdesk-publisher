import React from "react";
import { gettext } from "../../superdeskApi";
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

  render() {
    return (
      <ToggleBox
        title={gettext("Web publishing")}
        style="toggle-box--dark sp--dark-ui toggle-box--circle"
        isOpen={true}
      >
        {!this.props.rules.length && (
          <div className="tp-alert">
            {gettext("No websites have been set, this article won't show up on any website. It will go to")}: <br />
            <span style={{ fontWeight: "500" }}>
              {gettext("Publisher &gt; Output Control &gt; Incoming list")}
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
            cancel={() => this.setNewDestination({})}
            reload={this.props.reload}
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
            reload={this.props.reload}
          />
        )}
        <AddWebsite
          setNewDestination={(newDestination) => {
            this.props.reload();
            this.setNewDestination(newDestination);
          }}
          apiHeader={this.props.apiHeader}
          apiUrl={this.props.apiUrl}
          rules={[...this.props.rules, this.state.newDestination]}
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
