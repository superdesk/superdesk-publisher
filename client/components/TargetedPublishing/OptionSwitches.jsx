import React from "react";
import PropTypes from "prop-types";

import Checkbox from "../UI/Checkbox";

const OptionSwitches = ({
  fbiaEnabled,
  paywallEnabled,
  appleNewsEnabled,
  destination,
  onChange,
}) => {
  if (paywallEnabled || fbiaEnabled || appleNewsEnabled) {
    return (
      <div
        className="flex-grid flex-grid--wrap-items flex-grid--small-1 flex-grid--medium-2"
        style={{ overflow: "visible" }}
      >
        {fbiaEnabled && (
          <div
            className="flex-grid__item"
            style={{ marginBottom: "1em" }}
            sd-tooltip="Publish to facebook"
          >
            <span>
              <Checkbox
                label="Facebook"
                value={destination.is_published_fbia}
                onChange={(e) => onChange(e.target.value, "is_published_fbia")}
              />
            </span>
          </div>
        )}

        {appleNewsEnabled && (
          <div
            className="flex-grid__item"
            style={{ marginBottom: "1em" }}
            sd-tooltip="Publish to Apple News"
          >
            <span>
              <Checkbox
                label="Apple News"
                value={destination.is_published_to_apple_news}
                onChange={(e) =>
                  onChange(e.target.value, "is_published_to_apple_news")
                }
              />
            </span>
          </div>
        )}

        {paywallEnabled && (
          <div
            className="flex-grid__item"
            style={{ marginBottom: "1em" }}
            sd-tooltip="Enable Paywall"
          >
            <span>
              <Checkbox
                label="Paywall"
                value={destination.paywall_secured}
                onChange={(e) => onChange(e.target.value, "paywall_secured")}
              />
            </span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

OptionSwitches.propTypes = {
  fbiaEnabled: PropTypes.bool.isRequired,
  paywallEnabled: PropTypes.bool.isRequired,
  appleNewsEnabled: PropTypes.bool.isRequired,
  destination: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default OptionSwitches;
