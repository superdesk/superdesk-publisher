import React from "react";
import PropTypes from "prop-types";

import CheckButton from "../UI/CheckButton";
import ListCard from "./ListCard";
import Dropdown from "../UI/Dropdown";

import SearchBar from "../UI/SearchBar";

class Listing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: "all",
      search: ""
    };
  }

  setFilter = kind => this.setState({ filter: kind });

  addList = type => {
    if (this.state.filter !== "all" && type !== this.state.filter) {
      this.setState({ filter: "all" });
    }
    this.props.addList(type);
  };

  render() {
    let lists = [...this.props.lists];

    if (this.state.filter !== "all")
      lists = lists.filter(list => list.type === this.state.filter);

    if (this.state.search)
      lists = lists.filter(list =>
        list.name.toLowerCase().includes(this.state.search)
      );

    return (
      <div className="sd-column-box__main-column relative sd-display-flex-column">
        <div className="subnav subnav--lower-z-index">
          <SearchBar
            value={this.state.search}
            onChange={value => this.setState({ search: value.toLowerCase() })}
            debounceTime={1}
          />
          <CheckButton
            label="All"
            isChecked={this.state.filter === "all"}
            onClick={() => this.setFilter("all")}
          />
          <CheckButton
            label="Automatic"
            isChecked={this.state.filter === "automatic"}
            onClick={() => this.setFilter("automatic")}
          />
          <CheckButton
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
              <button onClick={() => this.addList("automatic")}>
                Automatic List
              </button>
            </li>
            <li>
              <button onClick={() => this.addList("manual")}>
                Manual List
              </button>
            </li>
          </Dropdown>
        </div>
        <div className="sd-display-flex-column">
          <div className="sd-grid-list sd-grid-list--large">
            {lists.map(list => (
              <ListCard
                key={list.id + list.name + "sf"}
                list={list}
                publisher={this.props.publisher}
                onListDelete={id => this.props.onListDelete(id)}
                listEdit={list => this.props.listEdit(list)}
              />
            ))}
          </div>
        </div>
        {this.props.lists && !this.props.lists.length ? (
          <div className="panel-info">
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
  onListDelete: PropTypes.func.isRequired,
  addList: PropTypes.func.isRequired,
  listEdit: PropTypes.func.isRequired
};

export default Listing;
