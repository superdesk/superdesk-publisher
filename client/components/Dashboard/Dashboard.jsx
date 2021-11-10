import React from "react";
import PropTypes from "prop-types";

import Tenant from "./Tenant";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this._isMounted = false;

    this.state = {
      loading: true,
      tenants: []
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.props.publisher
      .setToken()
      .then(() => this.props.publisher.querySites(false, true))
      .then(sites => {
        let tenants = sites.map(s => {
          s.articles_count = this.formatNumber(s.articles_count);
          return s;
        });
        if (this._isMounted) this.setState({ tenants, loading: false });
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  formatNumber = number => {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  render() {
    return (
      <React.Fragment>
        <div className="subnav">
          <h3 className="subnav__page-title">Publisher Dashboard</h3>
        </div>
        <div className="sd-column-box--3">
          <div className="sd-column-box__main-column">
            {this.state.loading && <div className="sd-loader" />}

            {!this.state.loading && !this.state.tenants.length && (
              <div className="panel-info">
                <div className="panel-info__icon">
                  <i className="big-icon--add-to-list"></i>
                </div>
                <h3 className="panel-info__heading">No tenants so far.</h3>
                <p className="panel-info__description">
                  To create a site go to Publisher Settings
                </p>
              </div>
            )}
            {!this.state.loading && this.state.tenants.length && (
              <div className="sd-grid-list sd-grid-list--large">
                {this.state.tenants.map(tenant => (
                  <div className="sd-grid-item-wrapper" key={tenant.code}>
                    <Tenant tenant={tenant} sessionToken={this.props.sessionToken}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  publisher: PropTypes.object.isRequired,
  sessionToken: PropTypes.string.isRequired
};

export default Dashboard;
