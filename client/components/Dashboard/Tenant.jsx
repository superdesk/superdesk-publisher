import React from "react";
import PropTypes from "prop-types";

const Tenant = ({ tenant, sessionToken }) => {
  const tenant_href = tenant.pwa_config && tenant.pwa_config.url
    ? tenant.pwa_config.url
    : tenant.output_channel
      ? tenant.output_channel.config.url
      : tenant.subdomain
        ? "https://" + tenant.subdomain + "." + tenant.domain_name
        : "https://" + tenant.domain_name;
  return (
    <React.Fragment>
      <div className="sd-grid-item-header">
        <h3 className="sd-grid-item-header__heading sd-overflow-ellipsis">
          <a
            target="_blank"
            href={tenant_href}
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
          <div className={`
            big-number-block big-number-block--grow big-number-block--center
            ${tenant.articles_count.toString().length > 5 ? 'big-number-block--wrap' : ''}`}>
            <div className="big-number-block__number">
              {tenant.articles_count}
            </div>
            <div className="big-number-block__text">
              Published <span>items</span>
            </div>
          </div>
          {!tenant.output_channel ? (
            <div className="btn-icon-group">
              {tenant.pwa_config && tenant.pwa_config.url && (
                <a
                  href={tenant_href + "/page-editor?token=" + sessionToken}
                  className="btn btn--icon-only-circle btn--large btn--hollow"
                  sd-tooltip="Theme Editor"
                  flow="down"
                >
                  <i className="icon-edit-line"></i>
                </a>
              )}
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
  sessionToken: PropTypes.string.isRequired
};

export default Tenant;
