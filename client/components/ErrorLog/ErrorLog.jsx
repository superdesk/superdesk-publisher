import React from "react";
import PropTypes from "prop-types";

import Item from "./Item";
import {gettext} from '../../superdeskApi';

class ErrorLog extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.state = {
      loading: true,
      errors: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.publisher.setToken().then(this.getErrors);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getErrors = () => {
    let params = {
      limit: 9999
    };

    this.props.publisher.getFailedQueue(params).then(response => {
      if (this._isMounted) {
        this.setState({
          errors: response,
          loading: false
        });
      }
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="subnav">
          <h3 className="subnav__page-title">{gettext("Error Log")}</h3>
        </div>
        <div className="sd-column-box--3">
          <div className="sd-column-box__main-column">
            {this.state.loading && <div className="sd-loader" />}

            {!this.state.loading && !this.state.errors.length && (
              <div className="panel-info">
                <div className="panel-info__icon">
                  <i className="big-icon--add-to-list"></i>
                </div>
                <h3 className="panel-info__heading">{gettext("No errors so far.")}</h3>
              </div>
            )}
            {!this.state.loading && this.state.errors.length ? (
              <div className="sd-column-box__main-column">
                <div className="sd-list-item-group sd-list-item-group--space-between-items">
                  {this.state.errors.map((item, index) => (
                    <Item item={item} key={"error" + item.id} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ErrorLog.propTypes = {
  publisher: PropTypes.object.isRequired
};

export default ErrorLog;
