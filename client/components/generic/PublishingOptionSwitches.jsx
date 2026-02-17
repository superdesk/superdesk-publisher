import React from "react";
import PropTypes from "prop-types";

import { Checkbox } from "superdesk-ui-framework/react";

const PublishingOptionSwitches = ({
  paywallEnabled,
  appleNewsEnabled,
  destination,
  onChange,
}) => {
  if (paywallEnabled || appleNewsEnabled) {
    return (
      <div
        className="flex-grid flex-grid--wrap-items flex-grid--small-1 flex-grid--medium-2"
        style={{ overflow: "visible" }}
      >

        {appleNewsEnabled && (
          <div
            className="flex-grid__item"
            style={{ marginBottom: "1em" }}
            sd-tooltip="Publish to Apple News"
          >
            <span>
              <Checkbox
                label={{ text: "Apple News" }}
                checked={destination.is_published_to_apple_news}
                onChange={(value) =>
                  onChange(value, "is_published_to_apple_news")
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
                label={{ text: "Paywall" }}
                checked={destination.paywall_secured}
                onChange={(value) => onChange(value, "paywall_secured")}
              />
            </span>
          </div>
        )}
      </div>
    );
  }

  return null;
};

PublishingOptionSwitches.propTypes = {
  paywallEnabled: PropTypes.bool.isRequired,
  appleNewsEnabled: PropTypes.bool.isRequired,
  destination: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default PublishingOptionSwitches;
