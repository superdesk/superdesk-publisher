import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import FilterPanel from "./FilterPanel";
import DropdownScrollable from "../../UI/DropdownScrollable";
import VirtualizedList from "../../generic/VirtualizedList";
import ArticleItem from "./ArticleItem";

class Automatic extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      isEmpty: props.list.content_list_items_count ? false : true,
      articles: {
        items: [],
        page: 0,
        totalPages: 1,
        loading: false,
        itemSize: 56
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.list, prevProps.list)) {
      this.setState({
        isEmpty: this.props.list.content_list_items_count ? false : true,
        articles: {
          items: [],
          page: 0,
          totalPages: 1,
          loading: false,
          itemSize: 56
        }
      });
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  pinUnpin = item => {
    let index = this.state.articles.items.findIndex(i => item.id === i.id);

    let articles = { ...this.state.articles };

    articles.items[index].loading = true;
    articles.loading = true;

    this.setState({ articles }, () => {
      this.props.publisher
        .pinArticle(this.props.list.id, item.id, {
          sticky: !item.sticky
        })
        .then(newItem => {
          articles.items[index] = newItem;
          articles.loading = false;
          this.setState({ articles });
        });
    });
  };

  onFiltersSave = updatedList => {
    this._queryArticles();
    this.props.onListUpdate(updatedList);
  };

  _queryArticles = () => {
    let articles = this.state.articles;
    articles.loading = true;
    this.setState({ articles }, () => {
      let params = {};
      params.limit = 20;
      params.page = this.state.articles.page + 1;

      this.props.publisher
        .queryListArticlesWithDetails(this.props.list.id, params)
        .then(response => {
          let articles = {
            page: response.page,
            totalPages: response.pages,
            items: [...this.state.articles.items, ...response._embedded._items],
            loading: false,
            itemSize: this.state.articles.itemSize
          };
          if (this._isMounted) this.setState({ articles });
        });
    });
  };

  render() {
    return (
      <div className="flex-grid flex-grid--grow flex-grid--small-1">
        <div className="flex-grid__item flex-grid__item--d-flex flex-grid__item--column">
          <div className="subnav subnav--mid-blue-grey">
            <button
              className="navbtn navbtn--left"
              onClick={this.props.onEditCancel}
            >
              <i className="icon-th" />
            </button>
            <button
              onClick={this.props.toggleFilters}
              className={classNames("navbtn navbtn--left navbtn--darker", {
                "navbtn--active": this.props.filtersOpen
              })}
              sd-tooltip="Filter"
              flow="right"
            >
              <i className="icon-filter-large" />
            </button>
            <DropdownScrollable
              button={
                <button className="dropdown__toggle navbtn navbtn--text-only dropdown-toggle">
                  {this.props.list.name}
                  <span className="dropdown__caret" />
                </button>
              }
            >
              <li>
                <div className="dropdown__menu-label">{this.props.label}</div>
              </li>
              {this.props.lists.map(item => (
                <li key={"dropdownElement" + item.id}>
                  <button onClick={() => this.props.listEdit(item)}>
                    {item.name}
                  </button>
                </li>
              ))}
            </DropdownScrollable>
          </div>

          <div className="sd-column-box--3">
            <FilterPanel
              list={this.props.list}
              toggle={this.props.toggleFilters}
              publisher={this.props.publisher}
              filters={this.props.list.filters ? this.props.list.filters : {}}
              onFiltersSave={list => this.onFiltersSave(list)}
              api={this.props.api}
            />
            <div
              className="sd-column-box__main-column relative"
              style={this.state.isEmpty ? null : { display: "flex" }}
            >
              <div
                className="sd-list-item-group sd-shadow--z2"
                style={{ flexGrow: "1" }}
              >
                {this.state.isEmpty ? (
                  <div className="alert alert-info alert-block">
                    <h4>The list is empty</h4>
                    <p>
                      Please update filter criteria to add articles to the list.
                    </p>
                  </div>
                ) : (
                  <VirtualizedList
                    hasNextPage={
                      this.state.articles.totalPages > this.state.articles.page
                        ? true
                        : false
                    }
                    isNextPageLoading={this.state.articles.loading}
                    loadNextPage={this._queryArticles}
                    items={this.state.articles.items}
                    itemSize={this.state.articles.itemSize}
                    ItemRenderer={ArticleItem}
                    itemRendererProps={{
                      openPreview: item => this.props.openPreview(item),
                      previewItem: this.props.previewItem,
                      pinUnpin: item => this.pinUnpin(item)
                    }}
                    heightSubtract={0}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Automatic.propTypes = {
  list: PropTypes.object.isRequired,
  lists: PropTypes.array.isRequired,
  publisher: PropTypes.object.isRequired,
  listEdit: PropTypes.func,
  onEditCancel: PropTypes.func,
  onListUpdate: PropTypes.func.isRequired,
  toggleFilters: PropTypes.func.isRequired,
  openPreview: PropTypes.func,
  previewItem: PropTypes.object,
  filtersOpen: PropTypes.bool,
  api: PropTypes.func.isRequired
};

export default Automatic;
