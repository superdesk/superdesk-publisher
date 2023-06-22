import React from "react";
import PropTypes from "prop-types";
import { Button } from "superdesk-ui-framework/react";

import ContentListElement from "./ContentListElement";

const ContentLists = (props) => {
  let ruleLists = [...props.ruleLists];
  let allContentLists = [...props.contentLists];
  let remainingLists = [...props.contentLists];

  ruleLists.forEach((list) => {
    let index = remainingLists.findIndex((rlist) => list.id === rlist.id);
    if (index >= 0) {
      remainingLists.splice(index, 1);
    }
  });

  return (
    <div style={{ margin: "1em 0" }}>
      <label className="form-label">Content lists</label>
      {ruleLists.map((list, index) => (
        <ContentListElement
          key={"list_el" + index}
          ruleLists={props.ruleLists}
          removeList={props.removeList}
          index={index}
          list={list}
          allContentLists={allContentLists}
          save={props.save}
        />
      ))}

      {!!remainingLists.length && (
        <Button
          onClick={props.addList}
          text="Add to content list"
          style="hollow"
          type="primary"
          expand="true"
        />
      )}
    </div>
  );
};

ContentLists.propTypes = {
  ruleLists: PropTypes.array.isRequired,
  contentLists: PropTypes.array.isRequired,
  removeList: PropTypes.func.isRequired,
  addList: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
};

export default ContentLists;
