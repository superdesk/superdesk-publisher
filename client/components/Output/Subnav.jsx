import React from "react";
import classNames from "classnames";

import Store from "./Store";
import { CheckButtonGroup, RadioButton, Badge } from "superdesk-ui-framework";
import TenantSelect from "./TenantSelect";
import SortingOptions from "./SortingOptions";
import LanguageSelect from "../UI/LanguageSelect";

const Subnav = (props) => {
  return (
    <Store.Consumer>
      {(store) => (
        <div className="subnav subnav--lower-z-index">
          <div className="subnav__content-bar">
            <div style={{ marginLeft: "1rem" }}>
              <CheckButtonGroup>
                <RadioButton
                  value={store.selectedList}
                  options={[
                    {
                      value: "incoming",
                      label: store.isSuperdeskEditorOpen ? (
                        <i className="icon-ingest" />
                      ) : (
                        "Incoming"
                      ),
                    },
                    {
                      value: "published",
                      label: store.isSuperdeskEditorOpen ? (
                        <i className="icon-expand-thin" />
                      ) : (
                        "Published"
                      ),
                    },
                  ]}
                  onChange={(value) => store.actions.setSelectedList(value)}
                />
              </CheckButtonGroup>
            </div>
          </div>

          <div className="subnav__content-bar sd-flex-wrap ml-auto sd-padding-l--1">
            {!store.isSuperdeskEditorOpen && <SortingOptions />}
          </div>

          <div className="subnav__spacer subnav__spacer--no-margin"></div>

          <div
            className={classNames(
              "subnav__content-bar sd-flex-wrap sd-padding-l--1 ui-responsive-small--d-none ui-responsive-small--d-block if-authoring--d-none",
              { "sd-margin-r--1": store.isSuperdeskEditorOpen }
            )}
          >
            <div className="sd-margin-r--1">
              <span>Incoming:</span>
              <span className="sd-margin-l--0-5">
                <Badge
                  text={store.articlesCounts.incoming
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                />
              </span>
            </div>
            <div>
              <span>Published:</span>
              <span className="sd-margin-l--0-5">
                <Badge
                  text={store.articlesCounts.published
                    .toString()
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                />
              </span>
            </div>
          </div>
          {store.selectedList === "published" &&
            !store.isSuperdeskEditorOpen &&
            store.listViewType !== "swimlane" && <TenantSelect />}
          {store.listViewType !== "swimlane" &&
            store.isLanguagesEnabled &&
            !store.isSuperdeskEditorOpen && (
              <LanguageSelect
                languages={store.languages}
                selectedLanguageCode={store.filters.language}
                setLanguage={(lang) => {
                  store.actions.setFilters({ language: lang });
                }}
              />
            )}

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
