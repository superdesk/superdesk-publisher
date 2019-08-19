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
    console.log("ehe");
    this.setState({ value: e.target.value }, () => {
      if (this.state.value.length > 2) this.debouncedChange();
    });
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
  debounceTime: PropTypes.number
};

SearchBar.defaultProps = {
  style: "light"
};

export default SearchBar;
