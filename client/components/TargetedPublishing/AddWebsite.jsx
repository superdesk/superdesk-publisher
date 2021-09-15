import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { gettext } from "../../superdeskApi";
import { Button } from "superdesk-ui-framework/react";

class AddWebsite extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sites: [],
      sitesDropdownOpen: false,
    };
  }

  componentDidMount() {
    this.getSites();
  }

  getSites = () => {
    return axios
      .get(this.props.apiUrl + "tenants/?limit=9999", {
        headers: this.props.apiHeader,
      })
      .then((res) => {
        this.setState({
          sites: res.data._embedded._items,
        });
        return res;
      });
  };

  toggleSitesDropdown = () => {
    let sitesDropdownOpen = !this.state.sitesDropdownOpen;
    this.setState({
      sitesDropdownOpen: sitesDropdownOpen,
    });
  };

  addDestination = (site) => {
    // close site selection "dropdown"
    this.toggleSitesDropdown();
    this.props.setNewDestination(site);
  };

  render() {
    let styles = {
      addWebsiteDropdown: {
        boxSizing: "border-box",
        background: "#fff",
        marginTop: "10px",
        maxHeight: 0,
        overflow: "hidden",
        transition: "all ease-in-out .4s",
      },
    };

    if (this.state.sitesDropdownOpen) {
      styles.addWebsiteDropdown.maxHeight = 999;
    }

    const remainingSites = [...this.state.sites];
    const rules = [...this.props.rules];

    rules.forEach((rule) => {
      let index = remainingSites.findIndex((site) =>
        rule.tenant ? rule.tenant.id === site.id : rule.code === site.code
      );
      if (index >= 0) {
        remainingSites.splice(index, 1);
      }
    });

    return (
      <React.Fragment>
        {!!remainingSites.length && (
          <Button
            type="primary"
            icon="plus-large"
            iconOnly={true}
            shape="round"
            onClick={this.toggleSitesDropdown}
          />
        )}
        <div style={styles.addWebsiteDropdown} data-testid="dropdown">
          <div style={{ padding: "1.5rem" }}>
            <h3 className="tp-dropdown-heading">{gettext("Add Website")}</h3>
            <ul className="simple-list--dotted simple-list">
              {remainingSites.map((site) => (
                <li
                  key={site.id}
                  className="simple-list__item tp-dropdown-li"
                  onClick={() => this.addDestination(site)}
                >
                  {site.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

AddWebsite.propTypes = {
  setNewDestination: PropTypes.func.isRequired,
  apiUrl: PropTypes.string.isRequired,
  apiHeader: PropTypes.object.isRequired,
  rules: PropTypes.array.isRequired,
};

export default AddWebsite;
