import React from "react";
import PropTypes from "prop-types";
import AwesomeSlider from "react-awesome-slider";
import AwsSliderStyles from "./slideshow.css";

import helpers from "../../../services/helpers";

const Slideshow = ({ items, type = "viewImage", source = "article" }) => {
  let images = [];

  if (source === "package") {
    items.forEach(item => {
      if (item.type === "picture" && item.renditions) {
        let rendition = item.renditions.find(el => el.name === type);

        if (!rendition && item.renditions)
          rendition = item.renditions.find(el => el.name === "original");

        if (rendition) images.push(rendition.href);
      }
    });
  } else {
    items.forEach(item => {
      if (item.article_media && item.article_media.renditions) {
        let renditionUrl = helpers.getRenditionUrl(
          item.article_media.renditions,
          type
        );
        images.push(renditionUrl);
      }
    });
  }

  if (!images.length) return null;

  return (
    <AwesomeSlider
      cssModule={AwsSliderStyles}
      style={{ marginTop: "1em", marginBottom: "2em" }}
    >
      {images.map((image, index) => (
        <div data-src={image} key={`slider-${index}`} />
      ))}
    </AwesomeSlider>
  );
};

Slideshow.propTypes = {
  items: PropTypes.array.isRequired,
  type: PropTypes.string,
  source: PropTypes.string
};

export default Slideshow;
