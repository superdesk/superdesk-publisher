import React from "react";
import Select from "react-select";

import React, { Component } from "react";
import Select from "react-select/dist/react-select.browser.cjs.js";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" }
];

export default class SingleSelect extends Component {
  render() {
    return (
      <Select
        className="basic-single"
        classNamePrefix="select"
        name="color"
        options={options}
      />
    );
  }
}
