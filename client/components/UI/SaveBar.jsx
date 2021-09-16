import React from "react";
import PropTypes from "prop-types";
import { Button } from "superdesk-ui-framework/react";
import { gettext } from "../../superdeskApi";

const SaveBar = ({ save, cancel, isDisabled }) => {
  return (
    <div className="sd-collapse-box__sliding-toolbar-wrapper">
      <div className="sd-collapse-box__sliding-toolbar">
        <div className="sliding-toolbar__inner" />
        <Button text={gettext("Cancel")} style="hollow" theme="dark" onClick={cancel} />
        <Button
          text={gettext("Save")}
          type="primary"
          theme="dark"
          onClick={save}
          disabled={isDisabled}
          data-testid="save-button"
        />
      </div>
    </div>
  );
};

SaveBar.propTypes = {
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

SaveBar.defaultProps = {
  isDisabled: false,
};

export default SaveBar;
