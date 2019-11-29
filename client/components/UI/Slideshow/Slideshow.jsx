import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import "./slideshow.css";

import helpers from "../../../services/helpers";

const Slide = ({ image }) => {
  const styles = {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "50% 60%"
  };
  return <div className="slide" style={styles}></div>;
};

const LeftArrow = props => {
  return (
    <div className="backArrow arrow" onClick={props.goToPrevSlide}>
      <i className="icon-chevron-left-thin" aria-hidden="true"></i>
    </div>
  );
};

const RightArrow = props => {
  return (
    <div className="nextArrow arrow" onClick={props.goToNextSlide}>
      <i className="icon-chevron-right-thin" aria-hidden="true"></i>
    </div>
  );
};

class Slideshow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: [],
      currentIndex: 0,
      translateValue: 0
    };
  }

  componentDidMount() {
    this.prepareData();
  }

  componentDidUpdate(prevProps) {
    if (
      !_.isEqual(prevProps.items, this.props.items) &&
      this.props.items.length
    ) {
      this.prepareData();
    }
  }

  prepareData = () => {
    let images = [];

    if (this.props.source === "package") {
      this.props.items.forEach(item => {
        if (item.type === "picture" && item.renditions) {
          let rendition = item.renditions.find(
            el => el.name === this.props.type
          );

          if (!rendition && item.renditions)
            rendition = item.renditions.find(el => el.name === "original");

          if (rendition) images.push(rendition.href);
        }
      });
    } else {
      this.props.items.forEach(item => {
        if (item.article_media && item.article_media.renditions) {
          let renditionUrl = helpers.getRenditionUrl(
            item.article_media.renditions,
            this.props.type
          );
          images.push(renditionUrl);
        }
      });
    }
    this.setState({ images, currentIndex: 0, translateValue: 0 });
  };

  goToPrevSlide = () => {
    if (this.state.currentIndex === 0) return;

    this.setState(prevState => ({
      currentIndex: prevState.currentIndex - 1,
      translateValue: prevState.translateValue + this.slideWidth()
    }));
  };

  goToNextSlide = () => {
    // Exiting the method early if we are at the end of the images array.
    // We also want to reset currentIndex and translateValue, so we return
    // to the first image in the array.
    if (this.state.currentIndex === this.state.images.length - 1) {
      return this.setState({
        currentIndex: 0,
        translateValue: 0
      });
    }

    // This will not run if we met the if condition above
    this.setState(prevState => ({
      currentIndex: prevState.currentIndex + 1,
      translateValue: prevState.translateValue + -this.slideWidth()
    }));
  };

  slideWidth = () => {
    return document.querySelector(".sp-slider").clientWidth;
  };

  render() {
    return (
      <div className="sp-slider">
        <div
          className="slider-wrapper"
          style={{
            transform: `translateX(${this.state.translateValue}px)`,
            transition: "transform ease-out 0.45s"
          }}
        >
          {this.state.images.map((image, i) => (
            <Slide key={i} image={image} />
          ))}
        </div>

        <LeftArrow goToPrevSlide={this.goToPrevSlide} />

        <RightArrow goToNextSlide={this.goToNextSlide} />
      </div>
    );
  }
}

Slideshow.propTypes = {
  items: PropTypes.array.isRequired,
  type: PropTypes.string,
  source: PropTypes.string
};

export default Slideshow;
