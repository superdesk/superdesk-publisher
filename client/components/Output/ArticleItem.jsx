import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

const ArticleItem = ({ item, style }) => {
  return (
    <div className="sd-list-item" style={style} ng-className="{'sd-list-item--activated':webPublisherOutput.selectedArticle.id === i.id, 'fadeElement' : i.animate}"
      ng-click="webPublisherOutput.openPreview(i); $event.stopPropagation();" ng-dblclick="webPublisherOutput.openPublish(i, 'publish'); $event.stopPropagation();"
      ng-repeat="i in articlesList">
      <div className="sd-list-item__border"></div>
      <div className="sd-list-item__column sd-list-item__column--grow sd-list-item__column--no-border">
        <div className="sd-list-item__row">
          <span className="sd-overflow-ellipsis sd-list-item__headline">i.headline</span>
          <time ng-if="i.updated_at" title="{{i.updated_at}}">i.updated_at | reldate</time>
          <time ng-if="!i.updated_at" title="{{i.created_at}}">i.created_at | reldate</time>
        </div>
        <div className="sd-list-item__row sd-list-item__row--wrap">
          <span className="sd-text-icon sd-margin-r--1" ng-repeat="item in i.extra_items" ng-if="item.type==='media'">
            <i className="icon-slideshow sd-opacity--40"></i>item.items.length
          </span>
          <span className="label label--hollow" ng-if="rootType === 'incoming'" ng-repeat="service in i.service">service.name</span>
          <span ng-if="i.version > 1 && rootType === 'incoming'" className="label label--darkBlue2 label--hollow">update i.version</span>
          <span ng-if="i.articles[0] && i.articles[0].paywall_secured" className="sd-list-item__inline-text no-line-height" sd-tooltip="Paywall secured"
            flow="left">
            <i className="icon-paywall icon--orange icon--full-opacity"></i>
          </span>
          <span ng-repeat="item in i.articles | orderBy:'-status' | limitTo:3" className="sd-d-inline-flex">
            <a className="label label--success cursorPointer" ng-if="item.status === 'published'" ng-href="{{item.tenant.subdomain ? 'http://' + item.tenant.subdomain + '.'  + item.tenant.domain_name + item._links.online.href: 'http://' + item.tenant.domain_name + item._links.online.href}}"
              target="_blank" ng-click="$event.stopPropagation()">
              item.tenant.name
                    <span ng-if="item.route.name"> / item.route.name</span>
            </a>

            <span className="label" ng-if="item.status !== 'published'" ng-className="{'label--alert': item.status == 'unpublished'}">
              item.tenant.name
                    <span ng-if="item.route.name"> / item.route.name</span>
            </span>
          </span>

          <span ng-if="i.articles.length - 3 > 0">+i.articles.length - 3 more</span>
          <span className="sd-overflow-ellipsis">
            <span ng-if="rootType === 'incoming'" className="sd-overflow-ellipsis sd-list-item--element-grow">i.byline</span>
            <span ng-if="rootType === 'published' && i.pageviewsCount" className="sd-list-item__text-label">pageviews:</span>
            <span ng-if="rootType === 'published' && i.pageviewsCount">i.pageviewsCount</span>
            <span ng-if="rootType === 'published' && i.comments_count" className="sd-list-item__text-label">comments:</span>
            <span ng-if="rootType === 'published' && i.comments_count">i.comments_count</span>
          </span>
        </div>
      </div>
      <div className="sd-list-item__action-menu sd-list-item__action-menu--direction-row">
        <button sd-tooltip="Remove" className="icn-btn" ng-if="rootType === 'incoming'" ng-click="webPublisherOutput.removeArticle(i); $event.stopPropagation();">
          <i className="icon-trash"></i>
        </button>
        <button sd-tooltip="Correct" className="icn-btn" ng-click="webPublisherOutput.correctArticle(i); $event.stopPropagation();">
          <i className="icon-pencil"></i>
        </button>
        <button sd-tooltip="Publish" className="icn-btn" ng-click="webPublisherOutput.openPublish(i, 'publish'); $event.stopPropagation();">
          <i className="icon-expand-thin"></i>
        </button>
      </div>
    </div>
  );
};

ArticleItem.propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired
};

export default ArticleItem;
