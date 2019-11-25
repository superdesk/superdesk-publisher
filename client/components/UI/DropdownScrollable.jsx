import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

class DropdownScrollable extends React.Component {
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
        className={classNames("dropdown " + this.props.classes, {
          open: this.state.open
        })}
      >
        <span onClick={this.toggle}>{this.props.button}</span>

        <ul className="dropdown__menu dropdown__menu--scrollable">
          {this.props.children}
        </ul>
      </div>
    );
  }
}

DropdownScrollable.propTypes = {
  button: PropTypes.element.isRequired,
  classes: PropTypes.string
};

export default DropdownScrollable;
