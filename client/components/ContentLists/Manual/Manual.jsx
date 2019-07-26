import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import FilterPanel from "./FilterPanel";
import DropdownScrollable from "../../UI/DropdownScrollable";
import SearchBar from "../../UI/SearchBar";

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`
  }));

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

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

class Manual extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
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

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    droppable: "items",
    droppable2: "selected"
  };

  getList = id => this.state[this.id2List[id]];

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

      let state = { items };

      if (source.droppableId === "droppable2") {
        state = { selected: items };
      }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.setState({
        items: result.droppable,
        selected: result.droppable2
      });
    }
  };

  render() {
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
              <SearchBar value="" onChange={() => {}} style="dark" />
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
                ng-disabled="!webPublisherContentLists.listChangeFlag"
                ng-click="webPublisherContentLists.saveManualList()"
              >
                Save
              </button>
            </div>

            <div className="sd-column-box--3">
              <div className="sd-column-box__main-column relative dropZone">
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {this.state.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              {item.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
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
              <SearchBar value="" onChange={() => {}} />
              <h3 className="subnav__page-title">All published articles</h3>
            </div>
            <div className="sd-column-box--3">
              <div className="sd-column-box__main-column relative">
                <Droppable droppableId="droppable2">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {this.state.selected.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              {item.content}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              <FilterPanel />
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
