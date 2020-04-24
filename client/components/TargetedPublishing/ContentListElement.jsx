import React from "react";
import PropTypes from "prop-types";
import { IconButton } from "superdesk-ui-framework";

const ContentListElement = (props) => {
  const createPositionOptions = (list) => {
    if (!Number.isInteger(list.id)) return null;

    let listObj = props.allContentLists.find((l) => l.id === list.id);
    let count = listObj.content_list_items_count;
    let options = [];

    for (let i = 0; i < count; i++) {
      options.push(
        <option key={"optionelement" + list.id + "" + i} value={i}>
          {i + 1}
        </option>
      );
    }

    if (!count) {
      options.push(
        <option key={"optionelement" + list.id + "0"} value={0}>
          {1}
        </option>
      );
    }

    return options;
  };

  const contentListChangeHandler = (e, index) => {
    const name = e.target.name;
    const value = parseInt(e.target.value);
    let newRuleLists = [...props.ruleLists];

    newRuleLists[index][name] = value;

    props.save(newRuleLists);
  };

  let remainingLists = [...props.allContentLists];

  props.ruleLists.forEach((list) => {
    let index = remainingLists.findIndex(
      (rlist) => list.id === rlist.id && rlist.id !== props.list.id
    );

    if (index >= 0) {
      remainingLists.splice(index, 1);
    }
  });

  return (
    <div className="sd-list-item sd-list-item--no-hover sd-margin-b--1">
      <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--large-padding">
        <div className="sd-list-item__row no-margin sd-flex-justify-end">
          <IconButton
            icon="trash"
            tooltip={{ text: "Remove list", flow: "left" }}
            onClick={() => props.removeList(props.index)}
          />
        </div>
        <div className="sd-list-item__row">
          <div className="sd-line-input sd-line-input--is-select sd-list-item--element-grow">
            <label className="sd-line-input__label">Choose list</label>
            <select
              className="sd-line-input__select"
              value={props.list.id ? props.list.id : ""}
              name="id"
              onChange={(e) => contentListChangeHandler(e, props.index)}
            >
              <option value="" />
              {remainingLists.map((rl) => (
                <option
                  value={rl.id}
                  key={"select" + props.list.id + "-" + rl.id}
                >
                  {rl.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="sd-list-item__row">
          <div className="sd-line-input sd-line-input--is-select sd-list-item--element-grow">
            <label className="sd-line-input__label">Set order</label>
            <select
              className="sd-line-input__select"
              value={props.list.position}
              name="position"
              onChange={(e) => contentListChangeHandler(e, props.index)}
            >
              {createPositionOptions(props.list)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

ContentListElement.propTypes = {
  ruleLists: PropTypes.array.isRequired,
  removeList: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  list: PropTypes.object.isRequired,
  allContentLists: PropTypes.array.isRequired,
  save: PropTypes.func.isRequired,
};

export default ContentListElement;
