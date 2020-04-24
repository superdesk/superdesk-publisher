import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import classNames from "classnames";
import { Alert, TabList, Tab } from "superdesk-ui-framework";

const Item = ({ item }) => {
  const [state, setState] = React.useState({ isExpanded: false, tab: 1 });

  let messageKeys = Object.keys(item.message);

  return (
    <div className="sd-list-item sd-list-item--no-hover sd-shadow--z1">
      <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
        <div
          className="sd-list-item__row cursorPointer"
          onClick={() => setState({ isExpanded: !state.isExpanded, tab: 1 })}
        >
          <div className="sd-overflow-ellipsis sd-list-item--element-grow">
            <span className="state-label state-in_progress sd-margin-r--1">
              {item.transport}
            </span>
            {item.class}{" "}
            <span className="sd-text__date-time sd-margin-l--1">
              {moment(item.failed_at).format("YYYY-MM-DD, HH:mm:ss")}
            </span>
          </div>
          {state.isExpanded ? (
            <i className="icon-chevron-up-thin sd-margin-l--1"></i>
          ) : (
            <i className="icon-chevron-down-thin sd-margin-l--1"></i>
          )}
        </div>

        {state.isExpanded && (
          <React.Fragment>
            <div style={{ margin: "1em 2em 0 1em" }}>
              <Alert style="hollow" size="small" type="alert">
                {item.error_message}
              </Alert>
            </div>

            <div>
              <TabList>
                <Tab label="Message">
                  {messageKeys.map((key, index) => (
                    <div key={"message" + index + "-" + item.id}>
                      <strong>{key}: </strong>
                      <pre>{item.message[key]}</pre>
                    </div>
                  ))}
                </Tab>
                <Tab label="Stacktrace">
                  <pre>{item.exception_stacktrace}</pre>
                </Tab>
                <Tab label="Redeliveries">
                  <ul>
                    {item.redeliveries.map((r, index) => (
                      <li key={"redelivery" + index + "-" + item.id}>
                        {moment(r).format("YYYY-MM-DD, HH:mm:ss")}
                      </li>
                    ))}
                  </ul>
                </Tab>
              </TabList>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

export default Item;
