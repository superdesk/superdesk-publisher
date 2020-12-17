import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import PropTypes from "prop-types";

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    padding: 5,
  }),
  control: (provided) => ({
    ...provided,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: "rgba(0,0,0,0.15)",
    borderBottomWidth: "1px",
    backgroundColor: "transparent",
    position: "relative",
    transition: "border linear 0.2s, box-shadow linear 0.2s",
    boxShadow: "none",
    ":hover": {
      borderWidth: 0,
      borderColor: "#5ea9c8",
      borderBottomWidth: "1px",
      boxShadow: "0 1px 0 0 #5ea9c8",
    },
    ":active": {
      borderWidth: 0,
      borderColor: "#5ea9c8",
      borderBottomWidth: "1px",
      boxShadow: "0 1px 0 0 #5ea9c8",
    },
  }),
  container: (base, state) => {
    return {
      ...base,
      zIndex: state.isFocused ? "999" : "1", //Only when current state focused
    };
  },
  indicatorSeparator: (provided) => ({
    display: "none",
  }),
  indicatorsContainer: (provided) => ({
    width: "0",
    height: "0",
    verticalAlign: "middle",
    borderLeft: "0.4rem solid transparent",
    borderRight: "0.4rem solid transparent",
    borderTop: "0.4rem solid #000",
    opacity: "0.3",
    filter: "alpha(opacity=30)",
    content: "''",
    zIndex: 0,
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = "opacity 300ms";

    return { ...provided, opacity, transition };
  },
};

const AsyncMultiSelect = ({
  loadOptions,
  selectedOptions,
  onSelect,
  debounceTime = 500,
}) => {
  const [value, setValue] = useState("");
  let timer = null;

  const handleInputChange = (inputValue) => {
    setValue(inputValue);
  };

  const debouncedLoad = () => {
    return new Promise((resolve) => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        resolve(loadOptions(value));
      }, debounceTime);
    });
  };

  return (
    <AsyncSelect
      styles={customStyles}
      loadOptions={debouncedLoad}
      isMulti={true}
      defaultOptions
      onChange={onSelect}
      onInputChange={handleInputChange}
      value={selectedOptions}
    />
  );
};

AsyncMultiSelect.propTypes = {
  loadOptions: PropTypes.func.isRequired,
  selectedOptions: PropTypes.array.isRequired,
  onSelect: PropTypes.func,
  debounceTime: PropTypes.number,
};

export default AsyncMultiSelect;
