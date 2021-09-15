import React from "react";
import PropTypes from "prop-types";
import {gettext} from '../../superdeskApi';

const Tenant = ({ tenant }) => {
  return (
    <React.Fragment>
      <div className="sd-grid-item-header">
        <h3 className="sd-grid-item-header__heading sd-overflow-ellipsis">
          <a
            target="_blank"
            href={
              tenant.pwa_config && tenant.pwa_config.url
                ? tenant.pwa_config.url
                : tenant.output_channel
                ? tenant.output_channel.config.url
                : tenant.subdomain
                ? "https://" + tenant.subdomain + "." + tenant.domain_name
                : "https://" + tenant.domain_name
            }
            flow="down"
          >
            <span>{tenant.name}</span>
            <i className="icon-external"></i>
          </a>
        </h3>
        {tenant.pwa_config && tenant.pwa_config.url && (
          <span className="sp-logo-pwa"></span>
        )}
      </div>
      <div className="sd-card sd-card--flex-grow">
        <div className="dashboard-content-header sd-shadow--z1">
          <div className="big-number-block big-number-block--grow big-number-block--center">
            <div className="big-number-block__number">
              {tenant.articles_count}
            </div>
            <div className="big-number-block__text">
              {gettext("Published")}
              <br />
              {gettext("items")}
            </div>
          </div>
          {!tenant.output_channel ? (
            <div className="btn-icon-group">
              <a
                href={"#/publisher/analytics/" + tenant.code}
                className="btn btn--icon-only-circle btn--large btn--hollow"
                sd-tooltip="Analytics"
                flow="down"
              >
                <i className="icon-analytics"></i>
              </a>
              <a
                href={"#/publisher/content_lists/" + tenant.code}
                className="btn btn--icon-only-circle btn--large btn--hollow"
                sd-tooltip="Content lists"
                flow="down"
              >
                <i className="icon-unordered-list"></i>
              </a>
            </div>
          ) : (
            <i
              className="sp-logo-wordpress"
              sd-tooltip="Wordpress"
              flow="left"
            ></i>
          )}
        </div>
        <div
          className="sd-card__content"
          style={{
            maxHeight: "210px",
            overflowY: "auto",
          }}
        >
          <ul className="sd-card__content-list">
            {!tenant.content_lists || !tenant.content_lists.length ? (
              <div className="panel-info">
                <div className="panel-info__icon">
                  {tenant.output_channel ? (
                    <i className="big-icon--web"></i>
                  ) : (
                    <i className="big-icon--add-to-list"></i>
                  )}
                </div>
                <h3 className="panel-info__heading">&nbsp;</h3>
                <p className="panel-info__description">&nbsp;</p>
              </div>
            ) : (
              tenant.content_lists.map((list) => (
                <li
                  key={list.name + list.id}
                  className="sd-card__content-list-item sd-card__content-list-item--no-padding"
                >
                  <a
                    href={
                      "#/publisher/content_lists/" + tenant.code + "/" + list.id
                    }
                    className="sd-card__content-list-block-link sd-card__content-list-block-link--icon-hover sd-overflow-ellipsis"
                  >
                    {list.name}
                    <i className="icon-pencil icon--dark-blue-grey"></i>
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

Tenant.propTypes = {
  tenant: PropTypes.object.isRequired,
};

export default Tenant;
