import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import classNames from "classnames";

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
            <div
              className="sd-alert sd-alert--hollow sd-alert--alert sd-alert--small"
              style={{ margin: "1em 2em 1em 1em" }}
            >
              {item.error_message}
            </div>

            <div>
              <ul className="nav-tabs">
                <li
                  className={classNames("nav-tabs__tab", {
                    "nav-tabs__tab--active": state.tab === 1
                  })}
                >
                  <button
                    onClick={() => setState({ isExpanded: true, tab: 1 })}
                    className="nav-tabs__link"
                  >
                    <span>Message</span>
                  </button>
                </li>
                <li
                  className={classNames("nav-tabs__tab", {
                    "nav-tabs__tab--active": state.tab === 2
                  })}
                >
                  <button
                    onClick={() => setState({ isExpanded: true, tab: 2 })}
                    className="nav-tabs__link"
                  >
                    <span>Stacktrace</span>
                  </button>
                </li>
                <li
                  className={classNames("nav-tabs__tab", {
                    "nav-tabs__tab--active": state.tab === 3
                  })}
                >
                  <button
                    onClick={() => setState({ isExpanded: true, tab: 3 })}
                    className="nav-tabs__link"
                  >
                    <span>Redeliveries</span>
                  </button>
                </li>
              </ul>
              <div className="nav-tabs__content">
                {state.tab === 1 && (
                  <div className="nav-tabs__pane">
                    {messageKeys.map((key, index) => (
                      <div key={"message" + index + "-" + item.id}>
                        <strong>{key}: </strong>
                        <pre>{item.message[key]}</pre>
                      </div>
                    ))}
                  </div>
                )}
                {state.tab === 2 && (
                  <div className="nav-tabs__pane">
                    <pre>{item.exception_stacktrace}</pre>
                  </div>
                )}
                {state.tab === 3 && (
                  <div className="nav-tabs__pane">
                    <ul>
                      {item.redeliveries.map((r, index) => (
                        <li key={"redelivery" + index + "-" + item.id}>
                          {moment(r).format("YYYY-MM-DD, HH:mm:ss")}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

Item.propTypes = {
  item: PropTypes.object.isRequired
};

export default Item;
