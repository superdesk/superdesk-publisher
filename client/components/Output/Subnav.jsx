import React from "react";
import PropTypes from "prop-types";

import Check from "../UI/Check";

const Subnav = props => {
  return (
    <div className="subnav subnav--lower-z-index">
      <div className="subnav__content-bar">
        {/* isSuperdeskEditorOpen show icons */}
        <span sd-tooltip="Incoming content" flow="right">
          <Check
            label="Incoming content"
            onClick={() => null}
            isChecked={false}
          />
        </span>
        {/* <i className="icon-ingest" /> */}
        <span sd-tooltip="Published" flow="right">
          <Check
            label={<i className="icon-expand-thin" />}
            onClick={() => null}
            isChecked={false}
          />
        </span>
      </div>

      <div className="subnav__spacer subnav__spacer--no-margin" />
      <div
        className="subnav__content-bar sd-flex-wrap ml-auto sd-padding-l--1"
        ng-className="{'sd-margin-r--1': isSuperdeskEditorOpen}"
      >
        <div className="sd-margin-r--1">
          <span>Incoming:</span>
          <span className="badge sd-margin-l--0-5">0</span>
        </div>
        <div>
          <span>Published:</span>
          <span className="badge sd-margin-l--0-5">0</span>
        </div>
      </div>
      <div
        className="subnav__spacer subnav__spacer--no-margin"
        ng-show="webPublisherOutput.listType == 'published'  !webPublisherOutput.swimlaneView"
      />
      <div
        className="subnav__content-bar sd-flex-no-shrink"
        ng-className="{'sd-margin-l--1 sd-margin-r--1': superdesk.flags.authoring}"
        ng-show="webPublisherOutput.listType == 'published'  !webPublisherOutput.swimlaneView"
      >
        <div
          className="dropdown dropdown--align-right"
          dropdown=""
          ng-show="webPublisherOutput.listType == 'published' !webPublisherOutput.swimlaneView"
        >
          <button
            className="dropdown__toggle dropdown-toggle"
            dropdown-toggle=""
            aria-haspopup="true"
            aria-expanded="false"
          >
            webPublisherOutput.filterByTenant.name || 'All Tenants'
            <span className="dropdown__caret" />
          </button>
          <ul className="dropdown__menu dropdown__menu--scrollable">
            <li>
              <button ng-click="webPublisherOutput.filterByTenant=null">
                All Tenants
              </button>
            </li>
            <li className="dropdown__menu-divider" />
            <li ng-repeat="tenant in webPublisherOutput.sites">
              <button ng-click="webPublisherOutput.filterByTenant=tenant">
                tenant.name
              </button>
            </li>
          </ul>
        </div>
      </div>
      <button
        className="navbtn"
        ng-click="webPublisherOutput.swimlaneView = !webPublisherOutput.swimlaneView; webPublisherOutput.leftFilterOpen = false"
        ng-show="webPublisherOutput.listType == 'published'"
      >
        <i
          className="icon-kanban-view ng-hide"
          ng-show="webPublisherOutput.swimlaneView"
        />
        <i
          className="icon-list-view"
          ng-hide="webPublisherOutput.swimlaneView"
        />
      </button>
    </div>
  );
};

Subnav.propTypes = {};

export default Subnav;
