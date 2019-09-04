import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import _ from "lodash";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      value: this.props.value ? this.props.value : ""
    };
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.value, prevProps.value)) {
      this.setState({ value: this.props.value });
    }
  }

  toggle = () => {
    this.setState({ open: !this.state.open }, () => {});
  };

  debouncedChange = _.debounce(
    () => this.props.onChange(this.state.value),
    this.props.debounceTime ? this.props.debounceTime : 900
  );

  handleChange = e => {
    this.setState({ value: e.target.value }, this.debouncedChange);
  };

  render() {
    let handlerStyle = {};
    let inputStyle = {};
    let wrapperStyle = {};

    if (this.props.style === "dark") {
      handlerStyle = { borderRight: "1px solid rgba(0, 0, 0, 0.1)" };
      inputStyle = { color: "#ffffff" };
      wrapperStyle = { backgroundColor: "transparent" };
    }
    return (
      <div
        className={classNames("flat-searchbar", {
          extended: this.state.open,
          "search-handler--left-border": this.props.leftBorder
        })}
        style={wrapperStyle}
      >
        <div
          className={classNames("search-handler", {
            "search-handler--left-border": this.props.leftBorder
          })}
          style={handlerStyle}
        >
          <label
            htmlFor="search-input"
            className="trigger-icon"
            onClick={this.toggle}
          >
            <i className="icon-search" style={inputStyle} />
          </label>
          <input
            type="text"
            placeholder="Search"
            value={this.state.value}
            onChange={this.handleChange}
            style={inputStyle}
          />
        </div>
      </div>
    );
  }
}

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.string,
  debounceTime: PropTypes.number,
  leftBorder: PropTypes.bool
};

SearchBar.defaultProps = {
  style: "light",
  leftBorder: false
};

export default SearchBar;
