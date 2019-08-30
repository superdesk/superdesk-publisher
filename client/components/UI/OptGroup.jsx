import React, { Component } from "react";
import PropTypes from "prop-types";

const OptGroup = ({ list, valueField, nameField, label }) => {
  if (!list.length) return null;

  return (
    <optgroup label={label} style={{ color: "black" }}>
      {list.map((item, index) => (
        <option value={item[valueField]} key={"optitem" + item[valueField]}>
          {item[nameField]}
        </option>
      ))}
    </optgroup>
  );
};

OptGroup.propTypes = {
  list: PropTypes.array.isRequired,
  valueField: PropTypes.string.isRequired,
  nameField: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default OptGroup;
