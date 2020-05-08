import React from "react";
import PropTypes from "prop-types";

import { Checkbox } from "superdesk-ui-framework/react";

const OptionSwitches = ({
  fbiaEnabled,
  paywallEnabled,
  destination,
  onChange,
}) => {
  let paywalSecuredStyle = {};

  if (paywallEnabled && fbiaEnabled) {
    paywalSecuredStyle = { marginLeft: "2em" };
  }

  if (paywallEnabled || fbiaEnabled) {
    return (
      <div className="form__row">
        {fbiaEnabled && (
          <span sd-tooltip="Publish to facebook">
            <Checkbox
              label={{ text: "Facebook" }}
              checked={destination.is_published_fbia}
              onChange={(value) => onChange(value, "is_published_fbia")}
            />
          </span>
        )}

        {paywallEnabled && (
          <span style={paywalSecuredStyle} sd-tooltip="Enable Paywall">
            <Checkbox
              label={{ text: "Paywall Secured" }}
              label=""
              checked={destination.paywall_secured}
              onChange={(value) => onChange(value, "paywall_secured")}
            />
          </span>
        )}
      </div>
    );
  }

  return null;
};

OptionSwitches.propTypes = {
  fbiaEnabled: PropTypes.bool.isRequired,
  paywallEnabled: PropTypes.bool.isRequired,
  destination: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptionSwitches;
