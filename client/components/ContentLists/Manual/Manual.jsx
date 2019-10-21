import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";

import FilterPanel from "./FilterPanel";
import DropdownScrollable from "../../UI/DropdownScrollable";
import SearchBar from "../../UI/SearchBar";
import ArticleItem from "./ArticleItem";
import Loading from "../../UI/Loading/Loading";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

class Manual extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.listScroll = React.createRef();
    this.articlesScroll = React.createRef();

    this.state = {
      list: {
        items: [],
        page: 0,
        totalPages: 1,
        loading: false
      },
      articles: {
        items: [],
        page: 0,
        totalPages: 1,
        loading: false
      },
      listSearchQuery: "",
      articlesFilters: {},
      changesRecord: []
    };
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.list, prevProps.list)) {
      this.setState(
        {
          list: {
            items: [],
            page: 0,
            totalPages: 1,
            loading: false
          },
          articles: {
            items: [],
            page: 0,
            totalPages: 1,
            loading: false
          },
          listSearchQuery: "",
          articlesFilters: {},
          changesRecord: []
        },
        this._loadData
      );
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this._loadData();
    this.attachScrollEvents();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.detachScrollEvents();
  }

  scrollListener = (e, list) => {
    if (e.type !== "scroll") return;
    let el = null;

    if (list === "articles") {
      el = this.articlesScroll.current;
    } else {
      el = this.listScroll.current;
    }

    let listEl = el.querySelector(".sd-list-item-group");

    if (listEl.scrollHeight - el.scrollTop - el.clientHeight < 100) {
      if (list === "articles") {
        this._queryArticles();
      } else {
        this._queryListArticles();
      }
    }
  };

  scrollListenerList = _.debounce(e => this.scrollListener(e, "list"), 150);
  scrollListenerArticles = _.debounce(
    e => this.scrollListener(e, "articles"),
    150
  );

  attachScrollEvents = () => {
    this.listScroll.current.addEventListener(
      "scroll",
      this.scrollListenerList,
      false
    );

    this.articlesScroll.current.addEventListener(
      "scroll",
      this.scrollListenerArticles,
      false
    );
  };

  detachScrollEvents = () => {
    this.listScroll.current.removeEventListener(
      "scroll",
      this.scrollListenerList,
      false
    );

    this.articlesScroll.current.removeEventListener(
      "scroll",
      this.scrollListenerArticles,
      false
    );
  };

  _loadData = () => {
    this._queryArticles();
    this._queryListArticles();
  };

  _queryListArticles = (reset = false, limit = 20) => {
    let list = this.state.list;
    if (list.loading || (list.page === list.totalPages && !reset)) return;

    if (reset) {
      list = {
        items: [],
        page: 0,
        totalPages: 1,
        loading: false
      };
    }

    list.loading = true;
    this.setState({ list }, () => {
      let params = {};
      params.limit = limit;
      params.page = this.state.list.page + 1;

      this.props.publisher
        .queryListArticlesWithDetails(this.props.list.id, params)
        .then(response => {
          let list = {
            page: response.page,
            totalPages: response.pages,
            items: [...this.state.list.items, ...response._embedded._items],
            loading: false
          };
          if (this._isMounted) this.setState({ list });
        });
    });
  };

  _queryArticles = (reset = false) => {
    let articles = this.state.articles;
    if (articles.loading || (articles.page === articles.totalPages && !reset))
      return;

    if (reset) {
      articles = {
        items: [],
        page: 0,
        totalPages: 1,
        loading: false
      };
    }

    articles.loading = true;
    this.setState({ articles }, () => {
      let params = _.pickBy({ ...this.state.articlesFilters }, _.identity);
      params.limit = 20;
      params.page = this.state.articles.page + 1;
      params["sorting[published_at]"] = "desc";
      params.status = "published";

      this.props.publisher.queryTenantArticles(params).then(response => {
        let articles = {
          page: response.page,
          totalPages: response.pages,
          items: [...this.state.articles.items, ...response._embedded._items],
          loading: false
        };
        if (this._isMounted) this.setState({ articles });
      });
    });
  };

  handleListSearch = query => {
    this.setState(
      {
        listSearchQuery: query
      },
      () => this._queryListArticles(true, 99999)
    );
  };

  handleArticlesSearch = query => {
    let articlesFilters = { ...this.state.articlesFilters };
    articlesFilters.term = query;
    this.setState(
      {
        articlesFilters
      },
      () => this._queryArticles(true)
    );
  };

  filterArticles = filters =>
    this.setState({ articlesFilters: filters }, () =>
      this._queryArticles(true)
    );

  removeItem = id => {
    let list = { ...this.state.list };
    let index = list.items.findIndex(item => {
      let itemId = item.content ? item.content.id : item.id;
      return itemId === id;
    });

    if (index > -1) {
      this.recordChange("delete", index, [...list.items]);
      list.items.splice(index, 1);
      this.setState({ list });
    }
  };

  save = () => {
    this.props.publisher
      .saveManualList(
        {
          items: this.state.changesRecord,
          updated_at: this.props.list.updated_at
        },
        this.props.list.id
      )
      .then(savedList => {
        let list = { ...this.props.list };
        list.updated_at = savedList.updated_at;
        list.content_list_items_updated_at =
          savedList.content_list_items_updated_at;
        this.props.onListUpdate(list);
      })
      .catch(err => {
        if (err.status === 409) {
          this.props.api.notify.error(
            "Cannot save. List has been already modified by another user"
          );

          let list = { items: [], page: 0, totalPages: 1, loading: false };
          this.setState({ list, changesRecord: [] });
          this._queryListArticles();
        } else {
          this.props.api.notify.error("Something went wrong. Try again.");
        }
      });
  };

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    contentList: "list",
    articles: "articles"
  };

  getList = id => this.state[this.id2List[id]].items;

  onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let list = { ...this.state.list };

      list.items = items;
      this.recordChange("move", destination.index, [...list.items]);
      this.setState({ list });
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      let list = { ...this.state.list };
      let articles = { ...this.state.articles };

      if (
        this.props.list.limit &&
        this.props.list.limit < result.contentList.length
      ) {
        this.props.api.notify.error(
          "This list is limited to " + this.props.list.limit + " articles"
        );
        return null;
      }

      list.items = result.contentList;
      articles.items = result.articles;
      this.recordChange("add", destination.index, [...list.items]);
      this.setState({
        list,
        articles
      });
    }
  };

  // action = move, add, delete
  // index - new index in list
  // list - updated list
  recordChange = (action, index, list) => {
    let changesRecord = [...this.state.changesRecord];
    let item = list[index];

    let change = {
      content_id: item.content ? item.content.id : item.id,
      action: action,
      position: index
    };

    if (action === "delete") delete change.position;

    changesRecord.push(change);
    changesRecord = this.updatePositions(changesRecord, list);
    this.setState({ changesRecord });
  };

  updatePositions = (changesRecord, list) => {
    for (let i = 0; i < changesRecord.length; i++) {
      let itemIndex = list.findIndex(item => {
        let itemId = item.content ? item.content.id : item.id;
        return itemId === changesRecord[i].content_id;
      });

      if (changesRecord[i].action !== "delete") {
        changesRecord[i].position = itemIndex;
      }
    }

    return changesRecord;
  };

  markDuplicates = list => {
    list.forEach(el => {
      let elId = el.content ? el.content.id : el.id;
      let result = list.filter(element => {
        let elementId = element.content ? element.content.id : element.id;
        return elId === elementId;
      });
      if (el.content) {
        el.content.isDuplicate = result.length > 1 ? true : false;
      } else {
        el.isDuplicate = result.length > 1 ? true : false;
      }
    });

    return list;
  };

  render() {
    let filteredContentListItems = this.markDuplicates([
      ...this.state.list.items
    ]);

    if (this.state.listSearchQuery) {
      filteredContentListItems = filteredContentListItems.filter(item =>
        item.content
          ? item.content.title
              .toLowerCase()
              .includes(this.state.listSearchQuery.toLowerCase())
          : item.title
              .toLowerCase()
              .includes(this.state.listSearchQuery.toLowerCase())
      );
    }

    return (
      <div className="flex-grid flex-grid--grow flex-grid--small-2">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <div className="flex-grid__item flex-grid__item--d-flex flex-grid__item--column panel-border-right">
            <div className="subnav subnav--lower-z-index subnav--dark-blue-grey">
              <button
                className="navbtn navbtn--left"
                onClick={this.props.onEditCancel}
              >
                <i className="icon-th" />
              </button>
              <SearchBar
                value={this.state.listSearchQuery}
                onChange={value => this.handleListSearch(value)}
                style="dark"
              />
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
              <div className="subnav__stretch-bar" />
              <button
                className="btn btn--primary margin--right"
                disabled={this.state.changesRecord.length ? false : true}
                onClick={this.save}
              >
                Save
              </button>
            </div>

            <div className="sd-column-box--3">
              <div
                className={classNames(
                  "sd-column-box__main-column relative dropZone",
                  {
                    "dropZone--empty":
                      !this.state.list.loading && !this.state.list.items.length
                  }
                )}
                ref={this.listScroll}
              >
                {!this.state.list.items.length && !this.state.list.loading && (
                  <h2 className="dropZone__heading">Drag your Articles here</h2>
                )}
                <Droppable droppableId="contentList">
                  {(provided, snapshot) => (
                    <ul
                      className="sd-list-item-group sd-shadow--z2"
                      ref={provided.innerRef}
                      style={
                        !this.state.list.items.length &&
                        !this.state.list.loading
                          ? { height: "calc(100% - 50px)" }
                          : {}
                      }
                    >
                      {filteredContentListItems.map((item, index) => (
                        <Draggable
                          key={"list" + item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                            >
                              <ArticleItem
                                item={item.content ? item.content : item}
                                openPreview={item =>
                                  this.props.openPreview(item)
                                }
                                previewItem={this.props.previewItem}
                                index={index}
                                showExtras={true}
                                remove={id => this.removeItem(id)}
                              />
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {this.state.list.loading && (
                        <li>
                          <Loading dark={true} />
                        </li>
                      )}
                    </ul>
                  )}
                </Droppable>
              </div>
            </div>
          </div>

          <div className="flex-grid__item flex-grid__item--d-flex flex-grid__item--column">
            <div className="subnav subnav--lower-z-index">
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
              <SearchBar
                value={
                  this.state.articlesFilters.term
                    ? this.state.articlesFilters.term
                    : ""
                }
                onChange={value => this.handleArticlesSearch(value)}
              />
              <h3 className="subnav__page-title">All published articles</h3>
            </div>
            <div className="sd-column-box--3">
              <div
                className="sd-column-box__main-column relative"
                ref={this.articlesScroll}
              >
                <Droppable droppableId="articles" isDropDisabled={true}>
                  {(provided, snapshot) => (
                    <ul
                      className="sd-list-item-group sd-shadow--z2"
                      ref={provided.innerRef}
                    >
                      {this.state.articles.items.map((item, index) => (
                        <Draggable
                          key={"article" + item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                            >
                              <ArticleItem
                                item={item.content ? item.content : item}
                                openPreview={item =>
                                  this.props.openPreview(item)
                                }
                                previewItem={this.props.previewItem}
                              />
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {this.state.articles.loading && (
                        <li>
                          <Loading dark={true} />
                        </li>
                      )}
                    </ul>
                  )}
                </Droppable>
              </div>

              <FilterPanel
                filter={filters => this.filterArticles(filters)}
                toggle={this.props.toggleFilters}
                publisher={this.props.publisher}
                api={this.props.api}
              />
            </div>
          </div>
        </DragDropContext>
      </div>
    );
  }
}

Manual.propTypes = {
  list: PropTypes.object.isRequired,
  lists: PropTypes.array.isRequired,
  publisher: PropTypes.object.isRequired,
  listEdit: PropTypes.func,
  onEditCancel: PropTypes.func,
  onListUpdate: PropTypes.func.isRequired,
  toggleFilters: PropTypes.func,
  openPreview: PropTypes.func,
  previewItem: PropTypes.object,
  filtersOpen: PropTypes.bool,
  api: PropTypes.func.isRequired
};

export default Manual;
