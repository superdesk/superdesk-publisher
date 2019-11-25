import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import classNames from "classnames";
import { ToggleBox } from "../../UI/ToggleBox";
import Loading from "../../UI/Loading/Loading";
import Store from "../Store";

class RelatedArticles extends React.Component {
  static contextType = Store;

  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      selectedItem: {},
      articles: [],
      loading: true
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentDidUpdate() {
    if (
      this.context.selectedItem &&
      this.context.selectedItem.id !== this.state.selectedItem.id
    ) {
      this.setState(
        {
          loading: true,
          selectedItem: this.context.selectedItem
        },
        this.load
      );
    }
  }

  load = () => {
    this.context.publisher
      .queryRelatedArticlesStatus(this.context.selectedItem.id)
      .then(response => {
        if (this._isMounted) {
          this.setState({
            articles: response.related_article_items,
            loading: false
          });
        }
      });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    if (!this.state.articles.length && !this.state.loading) return null;
    return (
      <div className="side-panel__content-block">
        <ToggleBox
          title="Related Articles"
          style="toggle-box--dark sp--dark-ui"
          isOpen={true}
        >
          {this.state.loading && <Loading />}
          <ul className="simple-list simple-list--dotted simple-list--no-padding">
            {this.state.articles.map((article, index) => (
              <li className="simple-list__item" key={"relatedArticle" + index}>
                <p>{article.title}</p>
                {this.props.destinations.map(destination => {
                  let isPublished = article.tenants.findIndex(
                    t => t && t.code === destination.tenant.code
                  );

                  return (
                    <span
                      key={
                        "relatedArticleTenant" + destination.tenant.code + index
                      }
                      className={classNames("label-icon", {
                        "label-icon--success": isPublished >= 0
                      })}
                    >
                      <i className="icon-globe" /> {destination.tenant.name}
                    </span>
                  );
                })}
              </li>
            ))}
          </ul>
        </ToggleBox>
      </div>
    );
  }
}

RelatedArticles.propTypes = {
  destinations: PropTypes.array.isRequired
};

export default RelatedArticles;
