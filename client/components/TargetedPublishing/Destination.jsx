import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classNames from "classnames";
import _ from "lodash";

import ContentLists from "./ContentLists";
import RouteSelect from "./RouteSelect";
import OptionSwitches from "./OptionSwitches";

import Checkbox from "../UI/Checkbox";
import SaveBar from "../UI/SaveBar";

class Destination extends Component {
  constructor(props) {
    super(props);

    let destination = {};
    const pubConfig = props.config.publisher || {};
    const protocol = pubConfig.protocol || "https";
    let subdomain = null;
    let domainName = null;
    let hasOutputChannel = false;
    let hasFbiaEnabled = false;
    let hasPaywallEnabled = false;

    if (props.rule || props.site) {
      destination = {
        is_published_fbia: false,
        published: true,
        paywall_secured: false,
        package_guid: props.item.evolvedfrom
          ? props.item.evolvedfrom
          : props.item.guid,
        content_lists: []
      };

      if (props.site) {
        destination.tenant = props.site.code;

        hasFbiaEnabled = props.site.fbia_enabled;
        hasPaywallEnabled = props.site.paywall_enabled;
        hasOutputChannel = props.site.output_channel;
        subdomain = props.site.subdomain ? props.site.subdomain : "";
        domainName = props.site.domain_name;
      } else if (props.rule) {
        destination.tenant = props.rule.tenant.code;
        destination.route = props.rule.route ? props.rule.route.id : null;
        destination.is_published_fbia = props.rule.is_published_fbia;
        destination.published = props.rule.published;
        destination.paywall_secured = props.rule.paywall_secured;
        destination.content_lists = props.rule.content_lists
          ? props.rule.content_lists
          : [];

        hasFbiaEnabled = props.rule.tenant.fbia_enabled;
        hasPaywallEnabled = props.rule.tenant.paywall_enabled;
        hasOutputChannel = props.rule.tenant.output_channel;
        subdomain = props.rule.tenant.subdomain
          ? props.rule.tenant.subdomain
          : "";
        domainName = props.rule.tenant.domain_name;
      }
    }

    this.state = {
      contentLists: [],
      previewUrl: null,
      originalDestination: destination ? destination : {},
      destination: destination ? JSON.parse(JSON.stringify(destination)) : {},
      apiUrl: protocol
        ? `${protocol}://${subdomain}.${domainName}/api/v1/`
        : "",
      subdomain: subdomain ? subdomain : "",
      domainName: domainName ? domainName : "",
      hasOutputChannel: hasOutputChannel ? hasOutputChannel : false,
      hasPaywallEnabled: hasPaywallEnabled ? hasPaywallEnabled : false,
      hasFbiaEnabled: hasFbiaEnabled ? hasFbiaEnabled : false,
      isOpen: props.isOpen,
      deleted: false
    };
  }

  componentDidMount() {
    this.getContentLists();
  }

  componentWillReceiveProps(props) {
    if (props.rule || props.site) {
      let destination = {
        is_published_fbia: false,
        published: true,
        paywall_secured: false,
        package_guid: props.item.evolvedfrom
          ? props.item.evolvedfrom
          : props.item.guid,
        content_lists: []
      };

      const pubConfig = props.config.publisher || {};
      const protocol = pubConfig.protocol || "https";
      let subdomain = null;
      let domainName = null;
      let hasOutputChannel = false;
      let hasFbiaEnabled = false;
      let hasPaywallEnabled = false;

      if (props.site) {
        destination.tenant = props.site.code;

        hasFbiaEnabled = props.site.fbia_enabled;
        hasPaywallEnabled = props.site.paywall_enabled;
        hasOutputChannel = props.site.output_channel;
        subdomain = props.site.subdomain ? props.site.subdomain : "";
        domainName = props.site.domain_name;
      } else if (props.rule) {
        destination.tenant = props.rule.tenant.code;
        destination.route = props.rule.route ? props.rule.route.id : null;
        destination.is_published_fbia = props.rule.is_published_fbia;
        destination.published = props.rule.published;
        destination.paywall_secured = props.rule.paywall_secured;
        destination.content_lists = props.rule.content_lists
          ? props.rule.content_lists
          : [];

        hasFbiaEnabled = props.rule.tenant.fbia_enabled;
        hasPaywallEnabled = props.rule.tenant.paywall_enabled;
        hasOutputChannel = props.rule.tenant.output_channel;
        subdomain = props.rule.tenant.subdomain
          ? props.rule.tenant.subdomain
          : "";
        domainName = props.rule.tenant.domain_name;
      }

      this.setState(
        {
          originalDestination: destination,
          destination: JSON.parse(JSON.stringify(destination)),
          apiUrl: `${protocol}://${subdomain}.${domainName}/api/v1/`,
          subdomain: subdomain,
          domainName: domainName,
          hasOutputChannel: hasOutputChannel,
          hasPaywallEnabled: hasPaywallEnabled,
          hasFbiaEnabled: hasFbiaEnabled,
          isOpen: props.isOpen
        },
        this.getContentLists
      );
    }
  }

  toggleOpen = () => {
    let isOpen = this.state.isOpen;
    isOpen = !isOpen;
    this.setState({
      isOpen: isOpen
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
      .then(res => {
        this.setState({
          previewUrl: res.data.preview_url
        });
        return res;
      });
  };

  getContentLists = () => {
    if (!this.state.apiUrl) return;

    return axios
      .get(this.state.apiUrl + "content/lists/", {
        headers: this.props.apiHeader,
        params: { limit: 1000 }
      })
      .then(res => {
        let manualLists = res.data._embedded._items.filter(
          el => el.type === "manual"
        );

        this.setState({
          contentLists: manualLists
        });
        return res;
      });
  };

  handleSwitchChange = (value, fieldName) => {
    const dest = { ...this.state.destination };
    dest[fieldName] = value;
    this.setState({
      destination: dest
    });
  };

  handleRouteChange = e => {
    const routeId = parseInt(e.target.value);
    const dest = { ...this.state.destination };

    dest.route = routeId;
    this.setState(
      {
        destination: dest,
        previewUrl: null
      },
      this.setPreview
    );
  };

  saveContentList = data => {
    let destination = { ...this.state.destination };
    destination.content_lists = data;

    this.setState({ destination });
  };

  addContentList = () => {
    let destination = { ...this.state.destination };
    destination.content_lists.push({ id: "", position: 0 });
    this.setState({ destination });
  };

  removeContentList = index => {
    let destination = { ...this.state.destination };
    destination.content_lists.splice(index, 1);
    this.setState({ destination });
  };

  save = () => {
    axios
      .post(
        this.state.apiUrl + "organization/destinations/",
        this.state.destination,
        { headers: this.props.apiHeader }
      )
      .then(res => {
        this.props.done();
      });
  };

  delete = () => {
    let destination = { ...this.state.destination };
    destination.published = false;
    this.setState({ destination, deleted: true }, this.save);
  };

  render() {
    if (this.state.deleted) return null;

    let siteDomain = this.state.subdomain
      ? this.state.subdomain + "." + this.state.domainName
      : this.state.domainName;
    let showSaveBar = true;
    let disableSave =
      this.state.destination &&
      !this.state.destination.route &&
      !this.state.hasOutputChannel
        ? true
        : false;
    const destination = { ...this.state.destination };
    let contentListsNames = "";

    if (
      this.props.rule &&
      _.isEqual(this.state.destination, this.state.originalDestination)
    ) {
      showSaveBar = false;
    }

    if (destination.content_lists && destination.content_lists.length) {
      destination.content_lists.forEach(list => {
        let theList = this.state.contentLists.find(el => el.id === list.id);
        if (theList)
          contentListsNames += contentListsNames
            ? ", " + theList.name
            : theList.name;
      });
    }

    let preview = (
      <a className="icn-btn" sd-tooltip="Preview" flow="left" target="_blank" />
    );

    if (this.state.previewUrl) {
      preview = (
        <a
          href={this.state.previewUrl}
          target="_blank"
          className="icn-btn"
          sd-tooltip="Preview"
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
          "sd-collapse-box--open": this.state.isOpen
        })}
      >
        <div className="sd-collapse-box__header" onClick={this.toggleOpen}>
          <div className="sd-list-item">
            <div className="sd-list-item__border" />
            <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
              <div className="sd-list-item__row">
                <span className="sd-overflow-ellipsis sd-list-item--element-grow">
                  <span className="sd-list-item__text-strong">
                    {siteDomain}
                  </span>
                </span>
              </div>
              {!this.state.destination.published && (
                <div className="sd-list-item__row">
                  <span className="label label--alert">Do not publish</span>
                </div>
              )}
              {this.state.destination.published && publishRoute && (
                <div className="sd-list-item__row">
                  <span className="sd-list-item__text-label">Publish to:</span>
                  <span className="sd-overflow-ellipsis">{publishRoute}</span>
                </div>
              )}
              {contentListsNames && this.state.destination.published && (
                <div className="sd-list-item__row">
                  <span className="sd-list-item__text-label">
                    Content lists:
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
              <a
                className="sd-collapse-box__collapse-btn"
                onClick={this.toggleOpen}
              >
                <span className="icn-btn">
                  <i className="icon-chevron-up-thin" />
                </span>
              </a>
              {this.props.rule && (
                <a onClick={this.delete} sd-tooltip="Remove">
                  <span className="icn-btn">
                    <i className="icon-trash" />
                  </span>
                </a>
              )}
            </div>
            {showSaveBar && (
              <SaveBar
                save={() => this.save()}
                cancel={() => this.props.cancel()}
                isDisabled={disableSave}
              />
            )}
            <div className="sd-collapse-box__content-block sd-collapse-box__content-block--top">
              <div className="sd-list-item sd-list-item--no-bg sd-list-item--no-hover">
                <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
                  <div className="sd-list-item__row">
                    <span className="sd-overflow-ellipsis sd-list-item--element-grow sd-list-item__text-strong">
                      {siteDomain}
                    </span>
                    {preview}
                  </div>
                  {publishRoute && (
                    <div className="sd-list-item__row">
                      <span className="sd-list-item__text-label sd-overflow-ellipsis">
                        Automatically:
                      </span>
                      <span className="sd-overflow-ellipsis">
                        {publishRoute}
                      </span>
                    </div>
                  )}
                  {contentListsNames ? (
                    <div className="sd-list-item__row">
                      <span className="sd-list-item__text-label">
                        Content lists:
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
                  apiUrl={this.state.apiUrl}
                  apiHeader={this.props.apiHeader}
                  onChange={e => this.handleRouteChange(e)}
                  selectedRouteId={
                    this.state.destination.route
                      ? this.state.destination.route
                      : ""
                  }
                />
              </div>
            )}
            <OptionSwitches
              fbiaEnabled={this.state.hasFbiaEnabled}
              paywallEnabled={this.state.hasPaywallEnabled}
              destination={this.state.destination}
              onChange={(value, fieldName) =>
                this.handleSwitchChange(value, fieldName)
              }
            />
            {!!this.state.contentLists.length && (
              <ContentLists
                ruleLists={destination.content_lists}
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
  cancel: PropTypes.func.isRequired,
  done: PropTypes.func.isRequired,
  isOpen: PropTypes.bool
};

Destination.defaultProps = {
  isOpen: false
};

export default Destination;
