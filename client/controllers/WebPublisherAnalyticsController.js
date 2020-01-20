/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherAnalyticsController
 * @requires publisher
 * @requires modal
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherAnalyticsController holds a set of functions used for web publisher analytics
 */

import React from "react";
import ReactDOM from "react-dom";
import Analytics from "../components/Analytics/Analytics";

WebPublisherAnalyticsController.$inject = ["$scope", "publisher", "$route", "api"];
export function WebPublisherAnalyticsController($scope, publisher, $route, api) {
  class WebPublisherAnalytics {
    constructor() {
      this.tenant = $route.current.params._tenant;
      this.publisher = publisher;
      this.api = api;

      ReactDOM.render(
        <Analytics tenant={this.tenant} publisher={this.publisher} api={this.api} />,
        document.getElementById("sp-analytics-react-app")
      );
    }
  }

  return new WebPublisherAnalytics();
}
