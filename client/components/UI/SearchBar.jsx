import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  toggle = () => {
    this.setState({ open: !this.state.open }, () => {});
  };

  render() {
    let handlerStyle = {};
    let inputStyle = {};

    if (this.props.style === "dark") {
      handlerStyle = { borderRight: "1px solid rgba(0, 0, 0, 0.1)" };
      inputStyle = { color: "#ffffff" };
    }
    return (
      <div
        className={classNames("flat-searchbar", { extended: this.state.open })}
      >
        <div className="search-handler" style={handlerStyle}>
          <label
            for="search-input"
            className="trigger-icon"
            onClick={this.toggle}
          >
            <i className="icon-search" style={inputStyle} />
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Search"
            value={this.props.value}
            onChange={this.props.onChange}
            style={inputStyle}
          />
        </div>
      </div>
    );
  }
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.string
};

SearchBar.defaultProps = {
  style: "lights1"
};

export default SearchBar;
