import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { gettext } from "../../superdeskApi";
import DropdownScrollable from "./DropdownScrollable";

const LanguageSelect = props => {
  let selectedLanguageName = gettext("All Languages");

  if (props.selectedLanguageCode) {
    let lang = props.languages.find(
      l => l.qcode === props.selectedLanguageCode
    );
    if (lang) selectedLanguageName = lang.name;
  }

  return (
    <React.Fragment>
      <div className="subnav__spacer subnav__spacer--no-margin" />
      <div
        className={classNames(
          "subnav__content-bar sd-flex-no-shrink sd-margin-x--0"
        )}
      >
        <DropdownScrollable
          button={
            <button className="dropdown__toggle navbtn navbtn--text-only dropdown-toggle">
              {selectedLanguageName}
              <span className="dropdown__caret" />
            </button>
          }
          classes="dropdown--align-right"
        >
          <li>
            <button onClick={() => props.setLanguage(null)}>
              {gettext("All Languages")}
            </button>
          </li>
          <li className="dropdown__menu-divider" />
          {props.languages.map(item => (
            <li key={"tenantSelect" + item.qcode}>
              <button onClick={() => props.setLanguage(item.qcode)}>
                {item.name}
              </button>
            </li>
          ))}
        </DropdownScrollable>
      </div>
    </React.Fragment>
  );
};

LanguageSelect.propTypes = {
  languages: PropTypes.array.isRequired,
  selectedLanguageCode: PropTypes.string,
  setLanguage: PropTypes.func.isRequired
};

export default LanguageSelect;
