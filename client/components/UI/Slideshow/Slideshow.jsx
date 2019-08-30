import React from "react";
import PropTypes from "prop-types";
import AwesomeSlider from "react-awesome-slider";
import AwsSliderStyles from "./slideshow.css";

const Slideshow = ({ tenant, items, type = "viewImage" }) => {
  let base = tenant.subdomain
    ? "https://" + tenant.subdomain + "." + tenant.domain_name
    : "https://" + tenant.domain_name;

  let images = [];

  items.forEach(item => {
    if (item.article_media && item.article_media.image) {
      let rendition = item.article_media.renditions.find(
        el => el.name === type
      );

      if (!rendition)
        rendition = item.article_media.renditions.find(
          el => el.name === "original"
        );

      let extension =
        rendition.image.file_extension === "jpeg"
          ? "jpg"
          : rendition.image.file_extension;
      images.push(
        base + "/media/" + rendition.image.asset_id + "." + extension
      );
    }
  });

  if (!images.length) return null;

  return (
    <AwesomeSlider cssModule={AwsSliderStyles}>
      {images.map((image, index) => (
        <div data-src={image} key={"slideshowItem" + index} />
      ))}
    </AwesomeSlider>
  );
};

Slideshow.propTypes = {
  tenant: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  type: PropTypes.string
};

export default Slideshow;
