import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  componentWillUnmount() {
    if (this.state.open) {
      document.removeEventListener("click", this.toggle);
    }
  }

  toggle = () => {
    this.setState({ open: !this.state.open }, () => {
      if (this.state.open) {
        document.addEventListener("click", this.toggle);
      } else {
        document.removeEventListener("click", this.toggle);
      }
    });
  };

  render() {
    return (
      <div
        className={classNames("dropdown dropdown--align-right", {
          open: this.state.open
        })}
        flow="left"
      >
        <span onClick={this.toggle}>{this.props.button}</span>
        <ul className="dropdown__menu dropdown--align-right">
          {this.props.children}
        </ul>
      </div>
    );
  }
}

Dropdown.propTypes = {
  button: PropTypes.element.isRequired
};

export default Dropdown;
