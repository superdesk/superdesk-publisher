import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Check from "../UI/Check";
import ListCard from "./ListCard";
import Dropdown from "../UI/Dropdown";

class Listing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "all"
    };
  }

  setFilter = kind => this.setState({ filter: kind });

  render() {
    let lists = [...this.props.lists];

    return (
      <div className="sd-column-box__main-column relative sd-display-flex-column">
        <div
          className="subnav subnav--padded subnav--lower-z-index"
          style={{ paddingRight: "0px" }}
        >
          <Check
            label="All"
            isChecked={this.state.filter === "all"}
            onClick={() => this.setFilter("all")}
          />
          <Check
            label="Automatic"
            isChecked={this.state.filter === "automatic"}
            onClick={() => this.setFilter("automatic")}
          />
          <Check
            label="Manual"
            isChecked={this.state.filter === "manual"}
            onClick={() => this.setFilter("manual")}
          />
          <div className="subnav__stretch-bar" />
          <Dropdown
            button={
              <button
                className="navbtn dropdown sd-create-btn dropdown-toggle"
                sd-tooltip="Create new list"
              >
                <i className="icon-plus-large" />
                <span className="circle" />
              </button>
            }
          >
            <li>
              <div className="dropdown__menu-label">Create new list</div>
            </li>
            <li className="dropdown__menu-divider" />
            <li>
              <button onClick={() => this.props.addList("automatic")}>
                Automatic List
              </button>
            </li>
            <li>
              <button onClick={() => this.props.addList("manual")}>
                Manual List
              </button>
            </li>
          </Dropdown>
        </div>
        <div className="sd-display-flex-column">
          <div className="sd-grid-list sd-grid-list--large">
            {lists.map(list => (
              <ListCard
                key={list.id}
                list={list}
                publisher={this.props.publisher}
                onListDelete={id => this.props.onListDelete(id)}
              />
            ))}
          </div>
        </div>
        {this.props.lists && !this.props.lists.length ? (
          <div className="panel-info" ng-if="!lists.length">
            <div className="panel-info__icon">
              <i className="big-icon--add-to-list" />
            </div>
            <h3 className="panel-info__heading">No Content Lists</h3>
            <p className="panel-info__description">Create the first one...</p>
          </div>
        ) : null}
      </div>
    );
  }
}

Listing.propTypes = {
  lists: PropTypes.array.isRequired,
  publisher: PropTypes.object.isRequired,
  onListDelete: PropTypes.func.isRequired
};

export default Listing;
