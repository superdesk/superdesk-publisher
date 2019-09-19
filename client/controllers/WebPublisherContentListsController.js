/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherContentListsController
 * @requires publisher
 * @requires modal
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherContentListsController holds a set of functions used for web publisher content lists management
 */
import React from "react";
import ReactDOM from "react-dom";
import ContentLists from "../components/ContentLists/ContentLists";

WebPublisherContentListsController.$inject = [
  "$scope",
  "publisher",
  "$route",
  "api",
  "notify"
];
export function WebPublisherContentListsController(
  $scope,
  publisher,
  $route,
  api,
  notify
) {
  class WebPublisherContentLists {
    constructor() {
      this.tenant = $route.current.params._tenant;
      this.list = $route.current.params._list;
      this.publisher = publisher;
      // a little hack to avoid too many props
      api.notify = notify;
      this.api = api;

      ReactDOM.render(
        <ContentLists
          tenant={this.tenant}
          publisher={this.publisher}
          list={this.list}
          api={this.api}
        />,
        document.getElementById("sp-content-lists-react-app")
      );
    }
  }

  return new WebPublisherContentLists();
}
