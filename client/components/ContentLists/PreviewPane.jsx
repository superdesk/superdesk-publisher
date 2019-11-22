import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import ArticlePreview from "../generic/ArticlePreview";

class PreviewPane extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      article: null
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
      !_.isEqual(prevProps.article, this.props.article) &&
      this.props.article
    ) {
      this.loadArticle();
    }
  }

  loadArticle = () => {
    this.props.publisher.setTenant(this.props.article.tenant);

    this.props.publisher.getArticle(this.props.article.id).then(response => {
      if (this._isMounted) {
        this.setState({
          article: response
        });
      }
    });
  };

  render() {
    if (!this.props.article) return null;
    let article = this.props.article;
    article.slideshows = null;

    if (this.state.article) article = this.state.article;

    return <ArticlePreview article={article} close={this.props.close} />;
  }
}

PreviewPane.propTypes = {
  close: PropTypes.func.isRequired,
  article: PropTypes.object,
  publisher: PropTypes.object.isRequired
};

export default PreviewPane;
