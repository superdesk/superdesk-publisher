import React from "react";
import PropTypes from "prop-types";
import AwesomeSlider from "react-awesome-slider";
import AwsSliderStyles from "./slideshow.css";

const Slideshow = ({
  tenant,
  items,
  type = "viewImage",
  source = "article"
}) => {
  let images = [];

  if (source === "article") {
    let base = tenant.subdomain
      ? "https://" + tenant.subdomain + "." + tenant.domain_name
      : "https://" + tenant.domain_name;

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
  } else {
    items.forEach(item => {
      if (item.type === "picture") {
        let rendition = item.renditions.find(el => el.name === type);

        if (!rendition)
          rendition = item.renditions.find(el => el.name === "original");
        images.push(rendition.href);
      }
    });
  }

  if (!images.length) return null;

  return (
    <AwesomeSlider cssModule={AwsSliderStyles}>
      {images.map((image, index) => (
        <div data-src={image} key={`slider-${index}`} />
      ))}
    </AwesomeSlider>
  );
};

Slideshow.propTypes = {
  tenant: PropTypes.object,
  items: PropTypes.array.isRequired,
  type: PropTypes.string,
  source: PropTypes.string
};

export default Slideshow;
