import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import DropdownScrollable from "./DropdownScrollable";

const SourceSelect = props => {
  let selectedSource = {id: 'publisher', name: 'All published articles'};

  if (props.selectedSource) selectedSource = props.selectedSource;
  
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
              {selectedSource.name}
              <span className="dropdown__caret" />
            </button>
          }
          classes="dropdown--align-right"
        >
          <li>
            <button onClick={() => props.setSource(null)}>
              All published articles
            </button>
          </li>
          <li className="dropdown__menu-divider" />
          {props.sources.map(item => (
            <li key={"sourceSelect-" + item.id}>
              <button onClick={() => props.setSource(item)}>
                {item.name}
              </button>
            </li>
          ))}
        </DropdownScrollable>
      </div>
    </React.Fragment>
  );
};

SourceSelect.propTypes = {
  sources: PropTypes.array.isRequired,
  selectedSource: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  setSource: PropTypes.func.isRequired
};

export default SourceSelect;
