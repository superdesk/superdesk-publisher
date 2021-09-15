import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classNames from "classnames";
import _ from "lodash";

import { Label, IconButton } from "superdesk-ui-framework/react";

import ContentLists from "./ContentLists";
import RouteSelect from "./RouteSelect";
import PublishingOptionSwitches from "../generic/PublishingOptionSwitches";
import { gettext } from "../../superdeskApi";
class Destination extends Component {
  constructor(props) {
    super(props);

    let destination = {};
    const pubConfig = props.config.publisher || {};
    const protocol = pubConfig.protocol || "https";
    let subdomain = null;
    let domainName = null;
    let pwaUrl = null;
    let siteName = null;
    let hasOutputChannel = false;
    let hasFbiaEnabled = false;
    let hasPaywallEnabled = false;
    let hasAppleNewsEnabled = false;

    if (props.rule || props.site) {
      destination = {
        is_published_fbia: false,
        published: true,
        paywall_secured: false,
        package_guid: props.item.evolvedfrom
          ? props.item.evolvedfrom
          : props.item.guid,
        content_lists: [],
      };

      if (props.site) {
        destination.tenant = props.site.code;

        hasFbiaEnabled = props.site.fbia_enabled;
        hasPaywallEnabled = props.site.paywall_enabled;
        hasAppleNewsEnabled =
          props.site.apple_news_config &&
          props.site.apple_news_config.channel_id
            ? true
            : false;
        hasOutputChannel = props.site.output_channel;
        subdomain = props.site.subdomain ? props.site.subdomain : "";
        domainName = props.site.domain_name;
        siteName = props.site.name;
        pwaUrl =
          props.site.pwa_config && props.site.pwa_config.url
            ? props.site.pwa_config.url
            : null;
      } else if (props.rule) {
        destination.tenant = props.rule.tenant.code;
        destination.route = props.rule.route ? props.rule.route.id : null;
        destination.is_published_fbia = props.rule.is_published_fbia;
        destination.is_published_to_apple_news =
          props.rule.is_published_to_apple_news;
        destination.published = props.rule.published;
        destination.paywall_secured = props.rule.paywall_secured;
        destination.content_lists = props.rule.content_lists
          ? props.rule.content_lists
          : [];

        hasFbiaEnabled = props.rule.tenant.fbia_enabled;
        hasPaywallEnabled = props.rule.tenant.paywall_enabled;
        hasAppleNewsEnabled =
          props.rule.tenant.apple_news_config &&
          props.rule.tenant.apple_news_config.channel_id
            ? true
            : false;
        hasOutputChannel = props.rule.tenant.output_channel;
        subdomain = props.rule.tenant.subdomain
          ? props.rule.tenant.subdomain
          : "";
        domainName = props.rule.tenant.domain_name;
        siteName = props.rule.tenant.name;
        pwaUrl =
          props.rule.tenant.pwa_config && props.rule.tenant.pwa_config.url
            ? props.rule.tenant.pwa_config.url
            : null;
      }
    }

    this.state = {
      contentLists: [],
      previewUrl: null,
      destination: destination ? JSON.parse(JSON.stringify(destination)) : {},
      apiUrl: protocol
        ? `${protocol}://${
            subdomain ? subdomain + "." : ""
          }${domainName}/api/v2/`
        : "",
      subdomain: subdomain ? subdomain : "",
      domainName: domainName ? domainName : "",
      pwaUrl: pwaUrl,
      siteName: siteName ? siteName : "",
      hasOutputChannel: hasOutputChannel ? hasOutputChannel : false,
      hasPaywallEnabled: hasPaywallEnabled ? hasPaywallEnabled : false,
      hasAppleNewsEnabled: hasAppleNewsEnabled ? true : false,
      hasFbiaEnabled: hasFbiaEnabled ? hasFbiaEnabled : false,
      isOpen: props.isOpen,
      deleted: false,
    };
  }

  componentDidMount() {
    this.getContentLists();
  }

  componentDidUpdate(prevProps, prevState) {
    let props = this.props;

    if (
      (props.rule && !_.isEqual(props.rule, prevProps.rule)) ||
      (props.site && !_.isEqual(props.site, prevProps.site))
    ) {
      let destination = {
        is_published_fbia: false,
        published: true,
        paywall_secured: false,
        package_guid: props.item.evolvedfrom
          ? props.item.evolvedfrom
          : props.item.guid,
        content_lists: [],
      };

      const pubConfig = props.config.publisher || {};
      const protocol = pubConfig.protocol || "https";
      let subdomain = null;
      let domainName = null;
      let pwaUrl = null;
      let siteName = null;
      let hasOutputChannel = false;
      let hasFbiaEnabled = false;
      let hasPaywallEnabled = false;
      let hasAppleNewsEnabled = false;

      if (props.site) {
        destination.tenant = props.site.code;

        hasFbiaEnabled = props.site.fbia_enabled;
        hasPaywallEnabled = props.site.paywall_enabled;
        hasAppleNewsEnabled =
          props.site.apple_news_config &&
          props.site.apple_news_config.channel_id;
        hasOutputChannel = props.site.output_channel;
        subdomain = props.site.subdomain ? props.site.subdomain : "";
        domainName = props.site.domain_name;
        siteName = props.site.name;
        pwaUrl =
          props.site.pwa_config && props.site.pwa_config.url
            ? props.site.pwa_config.url
            : null;
      } else if (props.rule) {
        destination.tenant = props.rule.tenant.code;
        destination.route = props.rule.route ? props.rule.route.id : null;
        destination.is_published_fbia = props.rule.is_published_fbia;
        destination.is_published_to_apple_news =
          props.rule.is_published_to_apple_news;
        destination.published = props.rule.published;
        destination.paywall_secured = props.rule.paywall_secured;
        destination.content_lists = props.rule.content_lists
          ? props.rule.content_lists
          : [];

        hasFbiaEnabled = props.rule.tenant.fbia_enabled;
        hasPaywallEnabled = props.rule.tenant.paywall_enabled;
        hasAppleNewsEnabled =
          props.rule.tenant.apple_news_config &&
          props.rule.tenant.apple_news_config.channel_id
            ? true
            : false;
        hasOutputChannel = props.rule.tenant.output_channel;
        subdomain = props.rule.tenant.subdomain
          ? props.rule.tenant.subdomain
          : "";
        domainName = props.rule.tenant.domain_name;
        siteName = props.rule.tenant.name;
        pwaUrl =
          props.rule.tenant.pwa_config && props.rule.tenant.pwa_config.url
            ? props.rule.tenant.pwa_config.url
            : null;
      }

      this.setState(
        {
          destination: JSON.parse(JSON.stringify(destination)),
          apiUrl: `${protocol}://${
            subdomain ? subdomain + "." : ""
          }${domainName}/api/v2/`,
          subdomain: subdomain,
          domainName: domainName,
          pwaUrl: pwaUrl,
          siteName: siteName,
          hasOutputChannel: hasOutputChannel,
          hasPaywallEnabled: hasPaywallEnabled,
          hasAppleNewsEnabled: hasAppleNewsEnabled,
          hasFbiaEnabled: hasFbiaEnabled,
          isOpen: props.isOpen,
        },
        this.getContentLists
      );
    }

    if (
      !_.isEqual(prevState.destination, this.state.destination) &&
      (this.state.destination.route || this.state.hasOutputChannel)
    ) {
      this.save();
    }
  }

  toggleOpen = () => {
    let isOpen = this.state.isOpen;
    isOpen = !isOpen;
    this.setState({
      isOpen: isOpen,
    });
    if (isOpen) this.setPreview();
  };

  setPreview = () => {
    return axios
      .post(
        this.state.apiUrl +
          "preview/package/generate_token/" +
          this.state.destination.route,
        this.props.item,
        { headers: this.props.apiHeader }
      )
      .then((res) => {
        let previewUrl = res.data.preview_url;

        if (this.state.pwaUrl) {
          const regex = /preview\/publish\/package\/([a-zA-Z0-9]+)/gm;
          const match = regex.exec(previewUrl);

          previewUrl = this.state.pwaUrl + "/preview/token/" + match[1];
        }

        this.setState({
          previewUrl: previewUrl,
        });
        return res;
      });
  };

  getContentLists = () => {
    if (!this.state.apiUrl) return;

    return axios
      .get(this.state.apiUrl + "content/lists/", {
        headers: this.props.apiHeader,
        params: { limit: 1000 },
      })
      .then((res) => {
        let manualLists = res.data._embedded._items.filter(
          (el) => el.type === "manual"
        );

        this.setState({
          contentLists: manualLists,
        });
        return res;
      });
  };

  handleSwitchChange = (value, fieldName) => {
    const dest = { ...this.state.destination };
    dest[fieldName] = value;
    this.setState({
      destination: dest,
    });
  };

  handleRouteChange = (e) => {
    const routeId = parseInt(e.target.value);
    const dest = { ...this.state.destination };

    dest.route = routeId;
    this.setState(
      {
        destination: dest,
        previewUrl: null,
      },
      this.setPreview
    );
  };

  saveContentList = (data) => {
    let destination = JSON.parse(JSON.stringify(this.state.destination));
    destination.content_lists = data;

    this.setState({ destination });
  };

  addContentList = () => {
    let destination = JSON.parse(JSON.stringify(this.state.destination));
    destination.content_lists.push({ id: "", position: 0 });
    this.setState({ destination });
  };

  removeContentList = (index) => {
    let destination = JSON.parse(JSON.stringify(this.state.destination));
    destination.content_lists.splice(index, 1);
    this.setState({ destination });
  };

  save = () => {
    axios.post(
      this.state.apiUrl + "organization/destinations/",
      this.state.destination,
      { headers: this.props.apiHeader }
    );
  };

  delete = () => {
    let destination = { ...this.state.destination };
    if (!destination.route) {
      this.props.cancel();
      this.props.reload();
      return;
    }
    destination.published = false;
    this.setState({ destination, deleted: true }, () => {
      this.save();
      this.props.reload();
    });
  };

  render() {
    if (this.state.deleted) return null;
    const destination = { ...this.state.destination };
    let contentListsNames = "";

    if (destination.content_lists && destination.content_lists.length) {
      destination.content_lists.forEach((list) => {
        let theList = this.state.contentLists.find((el) => el.id === list.id);
        if (theList)
          contentListsNames += contentListsNames
            ? ", " + theList.name
            : theList.name;
      });
    }

    let preview = (
      <a className="icn-btn" sd-tooltip={gettext("Preview")} flow="left" target="_blank" />
    );

    if (this.state.previewUrl) {
      preview = (
        <a
          href={this.state.previewUrl}
          target="_blank"
          className="icn-btn"
          sd-tooltip={gettext("Preview")}
          flow="left"
        >
          <i className="icon-external" />
        </a>
      );
    }

    let publishRoute = null;
    if (this.props.rule) {
      if (this.props.rule.tenant.output_channel) {
        publishRoute = this.props.rule.tenant.output_channel.type;
      } else {
        publishRoute = this.state.destination.is_published_fbia
          ? this.props.rule.route.name + ", Facebook"
          : this.props.rule.route.name;
      }
    }

    return (
      <div
        className={classNames("sd-collapse-box sd-shadow--z2", {
          "sd-collapse-box--open": this.state.isOpen,
        })}
      >
        <div className="sd-collapse-box__header" onClick={this.toggleOpen}>
          <div className="sd-list-item">
            <div className="sd-list-item__border" />
            <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
              <div className="sd-list-item__row">
                <span className="sd-overflow-ellipsis sd-list-item--element-grow">
                  <span className="sd-list-item__text-strong">
                    {this.state.siteName}
                  </span>
                </span>
              </div>
              {!this.state.destination.published && (
                <div className="sd-list-item__row">
                  <Label text={gettext("Do not publish")} type="alert" />
                </div>
              )}
              {this.state.destination.published && publishRoute && (
                <div className="sd-list-item__row">
                  <span className="sd-list-item__text-label">{gettext("Publish to")}:</span>
                  <span className="sd-overflow-ellipsis">{publishRoute}</span>
                </div>
              )}
              {contentListsNames && this.state.destination.published && (
                <div className="sd-list-item__row">
                  <span className="sd-list-item__text-label">
                    {gettext("Content lists")}:
                  </span>
                  <span className="sd-overflow-ellipsis">
                    {contentListsNames}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="sd-collapse-box__content-wraper">
          <div className="sd-collapse-box__content">
            <div className="sd-collapse-box__tools sd-collapse-box__tools--flex">
              <span className="sd-collapse-box__collapse-btn">
                <IconButton icon="chevron-up-thin" onClick={this.toggleOpen} />
              </span>
              <IconButton
                icon="trash"
                tooltip={{ text: gettext("Remove"), flow: "left" }}
                onClick={this.delete}
              />
            </div>
            <div className="sd-collapse-box__content-block sd-collapse-box__content-block--top">
              <div className="sd-list-item sd-list-item--no-bg sd-list-item--no-hover">
                <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                  <div className="sd-list-item__row">
                    <span className="sd-overflow-ellipsis sd-list-item--element-grow sd-list-item__text-strong">
                      {this.state.siteName}
                    </span>
                    {preview}
                  </div>
                  {publishRoute && (
                    <div className="sd-list-item__row">
                      <span className="sd-list-item__text-label sd-overflow-ellipsis">
                        {gettext("Automatically")}:
                      </span>
                      <span className="sd-overflow-ellipsis">
                        {publishRoute}
                      </span>
                    </div>
                  )}
                  {contentListsNames ? (
                    <div className="sd-list-item__row">
                      <span className="sd-list-item__text-label">
                        {gettext("Content lists")}:
                      </span>
                      <span className="sd-overflow-ellipsis">
                        {contentListsNames}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {!this.state.hasOutputChannel && (
              <div className="form__row">
                <RouteSelect
                  config={this.props.config}
                  apiUrl={this.state.apiUrl}
                  apiHeader={this.props.apiHeader}
                  onChange={(e) => this.handleRouteChange(e)}
                  selectedRouteId={
                    this.state.destination.route
                      ? this.state.destination.route
                      : ""
                  }
                />
              </div>
            )}
            <PublishingOptionSwitches
              fbiaEnabled={this.state.hasFbiaEnabled}
              paywallEnabled={this.state.hasPaywallEnabled}
              appleNewsEnabled={this.state.hasAppleNewsEnabled}
              destination={this.state.destination}
              onChange={(value, fieldName) =>
                this.handleSwitchChange(value, fieldName)
              }
            />
            {!!this.state.contentLists.length && (
              <ContentLists
                ruleLists={JSON.parse(
                  JSON.stringify(this.state.destination.content_lists)
                )}
                contentLists={this.state.contentLists}
                save={this.saveContentList}
                addList={this.addContentList}
                removeList={this.removeContentList}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

Destination.propTypes = {
  rule: PropTypes.object,
  site: PropTypes.object,
  apiHeader: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  isOpen: PropTypes.bool,
  cancel: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
};

Destination.defaultProps = {
  isOpen: false,
};

export default Destination;
