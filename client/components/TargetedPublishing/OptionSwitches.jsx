import React from "react";
import PropTypes from "prop-types";

import Checkbox from "../UI/Checkbox";

const OptionSwitches = ({
  fbiaEnabled,
  paywallEnabled,
  destination,
  onChange
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
              label="Facebook"
              value={destination.is_published_fbia}
              onChange={e => onChange(e.target.value, "is_published_fbia")}
            />
          </span>
        )}

        {paywallEnabled && (
          <span style={paywalSecuredStyle}>
            <Checkbox
              label="Paywall Secured"
              value={destination.paywall_secured}
              onChange={e => onChange(e.target.value, "paywall_secured")}
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
  onChange: PropTypes.func.isRequired
};

export default OptionSwitches;
