import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

const ContentListPicker = props => {
  const allLists = props.destination.tenant.content_lists.filter(
    l => l.type === "manual"
  );

  const remainingLists = _.reject(allLists, item =>
    _.find(props.destination.content_lists, { id: item.id })
  );

  const addList = () => {
    if (!remainingLists.length) return;

    let dest = { ...props.destination };
    dest.content_lists.push({
      id: remainingLists[0].id,
      position: 0
    });

    props.update(dest);
  };

  const removeList = index => {
    let dest = { ...props.destination };
    dest.content_lists.splice(index, 1);

    props.update(dest);
  };

  const onListChange = (e, index) => {
    let dest = { ...props.destination };

    // return if list already selected
    if (_.find(dest.content_lists, { id: parseInt(e.target.value) })) return;

    dest.content_lists[index].id = parseInt(e.target.value);
    props.update(dest);
  };

  const onPositionChange = (e, index) => {
    let dest = { ...props.destination };

    dest.content_lists[index].position = parseInt(e.target.value);
    props.update(dest);
  };

  if (!allLists.length) return null;

  return (
    <React.Fragment>
      {props.destination.content_lists.map((list, index) => {
        let positionOptions = [];
        let listObject = _.find(allLists, {
          id: list.id
        });
        console.log(listObject.content_list_items_count);
        for (
          let i = 0;
          i < parseInt(listObject.content_list_items_count);
          i++
        ) {
          console.log(i);
          positionOptions.push(
            <option key={listObject.id + "positionoption" + i} value={i}>
              {i + 1}
            </option>
          );
        }

        if (!positionOptions.length) {
          positionOptions.push(
            <option key={listObject.id + "positionoption"} value={0}>
              1
            </option>
          );
        }

        return (
          <div
            className="sd-list-item sd-list-item--no-hover sd-margin-b--1"
            key={
              "contentlistselector" + props.destination.tenant.code + "" + index
            }
          >
            <div className="sd-list-item__column sd-list-item__column--grow">
              <div className="sd-list-item__row sd-list-item__row--only-child">
                <span className="sd-margin-r--1">Choose list</span>
                <div className="sd-line-input sd-line-input--is-select sd-list-item--element-grow sd-line-input--no-margin">
                  <select
                    className="sd-line-input__select"
                    onChange={e => onListChange(e, index)}
                    value={list.id}
                  >
                    {allLists.map((l, index) => (
                      <option
                        key={
                          "listoption" +
                          props.destination.tenant.code +
                          "" +
                          index
                        }
                        value={l.id}
                        disabled={
                          list.id !== l.id &&
                          _.find(props.destination.content_lists, {
                            id: l.id
                          })
                        }
                      >
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <a
                  className="icn-btn disabled"
                  sd-tooltip="Remove list"
                  flow="left"
                  onClick={() => removeList(index)}
                >
                  <i className="icon-trash"></i>
                </a>
              </div>
              <div className="sd-list-item__row sd-margin-b--1">
                <span className="sd-margin-r--1">Set order</span>
                <div className="sd-line-input sd-line-input--is-select sd-list-item--element-grow sd-line-input--no-margin sd-line-input--no-label sd-margin-r--2">
                  <select
                    className="sd-line-input__select"
                    value={list.position}
                    onChange={e => onPositionChange(e, index)}
                  >
                    {positionOptions}
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      {remainingLists.length ? (
        <div className="form__row">
          <button
            className="btn btn--hollow btn--expanded btn--primary"
            onClick={addList}
          >
            Add to content list
          </button>
        </div>
      ) : null}
    </React.Fragment>
  );
};

ContentListPicker.propTypes = {
  update: PropTypes.func.isRequired,
  destination: PropTypes.object.isRequired
};

export default ContentListPicker;
