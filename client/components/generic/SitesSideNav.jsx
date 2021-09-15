import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { gettext } from "../../superdeskApi";

const SitesSideNav = ({ toggle, setTenant, open, sites, selectedSite }) => {
  return (
    <React.Fragment>
      <div
        className={classNames("nav-tabs-vertical", {
          "nav-tabs-vertical--closed": open
        })}
      >
        <ul className="nav-tabs-vertical__list">
          <li className="nav-tabs-vertical__tab">
            <button className="nav-tabs-vertical__link" onClick={toggle}>
              {gettext("Website")}
            </button>
          </li>
        </ul>
      </div>
      <div className="sd-content-navigation-panel sd-content-navigation-panel--border-right">
        <div className="subnav subnav--padded subnav--lower-z-index">
          <h3 className="sd-content-nav-title sd-content-nav-title--uppercase">
            {gettext("Website")}
          </h3>
          <a className="icn-btn ml-auto" onClick={toggle}>
            <i className="icon-close-small" />
          </a>
        </div>
        <nav className="sd-content-nav">
          <ul>
            {sites.map(site => (
              <li key={site.code + "nav"}>
                <a
                  style={{ cursor: "pointer" }}
                  className={classNames("sd-content-nav__btn", {
                    "sd-content-nav__btn--active": selectedSite
                      ? site.code === selectedSite.code
                      : false
                  })}
                  onClick={() => setTenant(site)}
                >
                  {site.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </React.Fragment>
  );
};

SitesSideNav.propTypes = {
  toggle: PropTypes.func,
  setTenant: PropTypes.func,
  open: PropTypes.bool.isRequired,
  sites: PropTypes.array.isRequired,
  selectedSite: PropTypes.object
};

export default SitesSideNav;
