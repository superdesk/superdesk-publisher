/* eslint-disable */
import React from "react";
import classNames from "classnames";
import "./Loading.css";

const Loading = ({ dark = false }) => {
  return (
    <div
      className={classNames("spinner", {
        "spinner--dark": dark
      })}
    >
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
  );
};

export default Loading;
