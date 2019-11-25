import React from "react";
import PropTypes from "prop-types";

import { ToggleBox } from "../../UI/ToggleBox";

const MetadataButtons = props => {
  return (
    <ToggleBox title="Meta data" style="toggle-box--dark sp--dark-ui">
      <div className="sd-list-item-group sd-shadow--z1 no-margin">
        <div className="sd-list-item" onClick={() => props.open("Facebook")}>
          <div className="sd-list-item__border"></div>
          <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
            <div className="sd-list-item__row">
              <span className="sd-overflow-ellipsis">Facebook</span>
            </div>
          </div>
          <div className="sd-list-item__action-menu">
            <i className="icon-chevron-right-thin"></i>
          </div>
        </div>
        <div className="sd-list-item" onClick={() => props.open("Twitter")}>
          <div className="sd-list-item__border"></div>
          <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
            <div className="sd-list-item__row">
              <span className="sd-overflow-ellipsis">Twitter</span>
            </div>
          </div>
          <div className="sd-list-item__action-menu">
            <i className="icon-chevron-right-thin"></i>
          </div>
        </div>

        <div className="sd-list-item" onClick={() => props.open("SEO")}>
          <div className="sd-list-item__border"></div>
          <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
            <div className="sd-list-item__row">
              <span className="sd-overflow-ellipsis">SEO / Meta Tags</span>
            </div>
          </div>
          <div className="sd-list-item__action-menu">
            <i className="icon-chevron-right-thin"></i>
          </div>
        </div>
      </div>
    </ToggleBox>
  );
};

MetadataButtons.propTypes = {
  open: PropTypes.func.isRequired
};

export default MetadataButtons;
