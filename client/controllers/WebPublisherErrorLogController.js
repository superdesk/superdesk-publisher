/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherErrorLogController
 * @requires publisher
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherErrorLogController holds a set of functions used for web publisher failed queue
 */
import React from "react";
import ReactDOM from "react-dom";
import ErrorLog from "../components/ErrorLog/ErrorLog";

WebPublisherErrorLogController.$inject = ["publisher"];
export function WebPublisherErrorLogController(publisher) {
  class WebPublisherErrorLog {
    constructor() {
      this.publisher = publisher;
      this.publisher.setTenant();

      ReactDOM.render(
        <ErrorLog publisher={this.publisher} />,
        document.getElementById("sp-error-log-react-app")
      );
    }
  }

  return new WebPublisherErrorLog();
}
