import React from "react";
import { renderToString } from "react-dom/server";
import PropTypes from "prop-types";
import _ from "lodash";

import ArticlePreview from "../generic/ArticlePreview";
import Loading from "../UI/Loading/Loading";

import Store from "./Store";

class PreviewPane extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      package: null,
      loading: true,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (
      !_.isEqual(prevProps.package, this.props.package) &&
      this.props.package
    ) {
      this.loadPackage();
    }
  }

  loadPackage = () => {
    this.setState({ loading: true });

    this.context.publisher
      .getPackage(this.props.package.id)
      .then((response) => {
        if (this._isMounted) {
          this.setState({
            loading: false,
            package: response,
          });
        }
      });
  };

  render() {
    if (!this.props.package) return null;

    let slideshows = [];

    if (this.state.package && this.state.package.extra_items) {
      this.state.package.extra_items.map((gal) => {
        if (gal.id === "gallery") {
          if (gal.items[1] && Number.isInteger(parseInt(gal.items[1].order))) {
            gal.items = _.sortBy(gal.items, "order");
          }
          slideshows.push(gal);
        }
      });
    }

    let body = this.props.package.body_html;

    if (this.state.loading) {
      body = renderToString(<Loading />);
    }

    let article = {
      feature_media:
        this.state.package && this.state.package.featured_media
          ? this.state.package.featured_media
          : null,
      updated_at: this.props.package.updated_at,
      article_statistics: {
        page_views_number: this.props.package.page_views_count,
      },
      comments_count: this.props.package.comments_count,
      title: this.props.package.headline,
      body: body,
      slideshows: slideshows,
      source: "package",
      status: this.props.package.status,
      paywall_secured: this.props.package.articles[0]
        ? this.props.package.articles[0].paywall_secured
        : false,
      articles: this.props.package.articles,
      authors: this.props.package.authors ? this.props.package.authors : [],
    };

    return <ArticlePreview article={article} close={this.props.close} />;
  }
}

PreviewPane.propTypes = {
  close: PropTypes.func.isRequired,
  package: PropTypes.object,
};

export default PreviewPane;
