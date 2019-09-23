import React from "react";
import classNames from "classnames";

import Store from "./Store";

import CheckButton from "../UI/CheckButton";
import TenantSelect from "./TenantSelect";

const Subnav = props => {
  return (
    <Store.Consumer>
      {store => (
        <div className="subnav subnav--lower-z-index">
          <div className="subnav__content-bar">
            {store.isSuperdeskEditorOpen ? (
              <React.Fragment>
                <span sd-tooltip="Incoming content" flow="right">
                  <CheckButton
                    label={<i className="icon-ingest" />}
                    onClick={() => store.actions.setSelectedList("incoming")}
                    isChecked={store.selectedList === "incoming" ? true : false}
                  />
                </span>

                <span sd-tooltip="Published" flow="right">
                  <CheckButton
                    label={<i className="icon-expand-thin" />}
                    onClick={() => store.actions.setSelectedList("published")}
                    isChecked={
                      store.selectedList === "published" ? true : false
                    }
                  />
                </span>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <CheckButton
                  label="Incoming content"
                  onClick={() => store.actions.setSelectedList("incoming")}
                  isChecked={store.selectedList === "incoming" ? true : false}
                />

                <CheckButton
                  label="Published"
                  onClick={() => store.actions.setSelectedList("published")}
                  isChecked={store.selectedList === "published" ? true : false}
                />
              </React.Fragment>
            )}
          </div>

          <div className="subnav__spacer subnav__spacer--no-margin" />
          <div
            className={classNames(
              "subnav__content-bar sd-flex-wrap ml-auto sd-padding-l--1",
              { "sd-margin-r--1": store.isSuperdeskEditorOpen }
            )}
          >
            <div className="sd-margin-r--1">
              <span>Incoming:</span>
              <span className="badge sd-margin-l--0-5">
                {store.articlesCounts.incoming}
              </span>
            </div>
            <div>
              <span>Published:</span>
              <span className="badge sd-margin-l--0-5">
                {store.articlesCounts.published}
              </span>
            </div>
          </div>
          {store.selectedList === "published" &&
            store.listViewType !== "swimlane" && <TenantSelect />}
          {store.selectedList === "published" && (
            <button
              className="navbtn"
              onClick={store.actions.toggleListViewType}
            >
              {store.listViewType === "normal" ? (
                <i className="icon-kanban-view" />
              ) : (
                <i className="icon-list-view" />
              )}
            </button>
          )}
        </div>
      )}
    </Store.Consumer>
  );
};

export default Subnav;
