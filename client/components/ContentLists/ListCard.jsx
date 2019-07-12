import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import moment from "moment";
import helpers from "../../services/helpers.js";

import Dropdown from "../UI/Dropdown";
import Modal from "../UI/Modal";

class ListCard extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      list: { ...props.list },
      isEditing: false,
      loading: true,
      articles: [],
      modalType: null
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.props.publisher
      .queryListArticles(this.props.list.id)
      .then(articles => {
        if (this._isMounted) this.setState({ articles, loading: false });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  modalClose = () => {
    this.setState({ modalType: null });
  };

  settingsShow = () => {
    this.setState({ modalType: "settings" });
  };

  save = () => {
    let updatedValues = helpers.getUpdatedValues(
      this.state.list,
      this.props.list
    );

    this.props.publisher
      .manageList(updatedValues, this.state.list.id)
      .then(this.modalClose)
      .catch(err => {
        console.error(err);
      });
  };

  deleteConfirm = () => {
    this.setState({ modalType: "delete" });
  };

  deleteList = () => {
    this.props.publisher
      .removeList(this.state.list.id)
      .then(() => this.props.onListDelete(this.state.list.id));

    this.modalClose();
  };

  handleInputChange = (e, a) => {
    let { name, value } = e.target;
    let list = { ...this.state.list };

    list[name] = value;
    this.setState({ list });
  };

  render() {
    let { list, modalType } = this.state;
    let modalContent = "";

    if (modalType === "settings") {
      modalContent = (
        <React.Fragment>
          <div className="modal__header">
            <a className="close" onClick={this.modalClose}>
              <i className="icon-close-small" />
            </a>
            <h3>Settings</h3>
          </div>
          <div className="modal__body">
            <form name="settingsForm">
              <fieldset>
                <div className="field">
                  <label for="listLimit" translate="">
                    number of articles limit
                  </label>
                  <input
                    type="number"
                    className="line-input"
                    value={this.state.list.limit}
                    name="limit"
                    min="0"
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="field">
                  <label for="listCacheLifeTime">cache lifetime</label>
                  <input
                    type="number"
                    className="line-input"
                    name="cache_life_time"
                    value={this.state.list.cache_life_time}
                    onChange={this.handleInputChange}
                    min="0"
                    required=""
                  />
                </div>
              </fieldset>
            </form>
          </div>
          <div className="modal__footer">
            <button className="btn" onClick={this.modalClose}>
              Cancel
            </button>
            <button
              className="btn btn--primary"
              onClick={this.save}
              disabled={
                helpers.getUpdatedValues(this.state.list, this.props.list)
                  .length
                  ? false
                  : true
              }
            >
              Save
            </button>
          </div>
        </React.Fragment>
      );
    }

    if (modalType === "delete") {
      modalContent = (
        <React.Fragment>
          <div className="modal__header ">
            <h3>Confirm</h3>
          </div>
          <div className="modal__body ">
            Please confirm you want to delete list.
          </div>
          <div className="modal__footer ng-scope">
            <button className="btn" onClick={this.modalClose}>
              Cancel
            </button>
            <button className="btn btn--primary" onClick={this.deleteList}>
              OK
            </button>
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <div className="sd-card flexGrow">
          <div
            className={classNames("sd-card__header sd-card__header--padding", {
              "sd-card__header--secondary-color": list.type === "automatic"
            })}
          >
            {this.state.isEditing ? (
              <React.Fragment>
                <div
                  className="sd-card__heading"
                  ng-if="webPublisherContentLists._editMode(list, webPublisherContentLists.selectedList, webPublisherContentLists.listAdd)"
                >
                  <input
                    type="text"
                    ng-model="newList.name"
                    className="line-input line-input--alt"
                    required
                  />
                </div>
                <div
                  ng-if="webPublisherContentLists._editMode(list, webPublisherContentLists.selectedList, webPublisherContentLists.listAdd)"
                  className="sd-card__btn-group sd-card__btn-group--right margin--top0"
                >
                  <button
                    ng-click="webPublisherContentLists.cancelEditListCard()"
                    className="btn btn--icon-only"
                  >
                    <i className="icon-close-small" />
                  </button>
                  <button
                    ng-click="webPublisherContentLists.saveList()"
                    className="btn btn--icon-only"
                  >
                    <i className="icon-ok" />
                  </button>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div
                  className="sd-card__heading"
                  ng-click="webPublisherContentLists.editListCard(list)"
                >
                  {list.name}
                </div>
                <div className="sd-card__actions-group">
                  <a
                    className="btn btn--small btn--hollow btn--ui-dark"
                    ng-click="webPublisherContentLists.openListCriteria(list)"
                  >
                    Edit
                  </a>
                  <Dropdown
                    button={
                      <button className="dropdown__toggle icn-btn">
                        <i className="icon-dots-vertical" />
                      </button>
                    }
                  >
                    <li>
                      <button onClick={this.settingsShow} title="Settings">
                        <i className="icon-settings" />
                        Settings
                      </button>
                    </li>
                    <li>
                      <button onClick={this.deleteConfirm} title="Remove list">
                        <i className="icon-trash" />
                        Remove
                      </button>
                    </li>
                  </Dropdown>
                </div>
              </React.Fragment>
            )}
          </div>
          <div className="sd-card__content sd-card__content--scrollable relative">
            <ul className="sd-card__content-list">
              {this.state.loading && <div className="sd-loader" />}
              {!this.state.loading && !this.state.articles.length && (
                <div className="sd-card__content-list-item sd-card__content-list-item--small">
                  <span translate>No articles in this list</span>
                </div>
              )}
              {!this.state.loading && this.state.articles.length
                ? this.state.articles.map(article => (
                    <li
                      key={article.content.slug}
                      className="sd-card__content-list-item sd-card__content-list-item--small"
                    >
                      {article.content.title}
                    </li>
                  ))
                : null}
            </ul>
          </div>
          <div className="sd-card__footer sd-card__footer--spread">
            <div>
              <span className="sd-text__info">Last modified: </span>
              <span>{moment(list.updated_at).fromNow()}</span>
            </div>
            {list.enabled && (
              <span className="label label--success label--hollow">active</span>
            )}
          </div>
        </div>

        <Modal isOpen={this.state.modalType ? true : false}>
          {modalContent}
        </Modal>
      </React.Fragment>
    );
  }
}

ListCard.propTypes = {
  list: PropTypes.object.isRequired,
  publisher: PropTypes.object.isRequired
};

export default ListCard;
