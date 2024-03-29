/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherDashboardController
 * @requires publisher
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherDashboardController holds a set of functions used for web publisher dashboard
 */
import React from "react";
import ReactDOM from "react-dom";
import Dashboard from "../components/Dashboard/Dashboard";

WebPublisherDashboardController.$inject = ["publisher", "session"];
export function WebPublisherDashboardController(publisher, session) {
  class WebPublisherDashboard {
    constructor() {
      this.publisher = publisher;
      this.publisher.setTenant();
      
      ReactDOM.render(
        <Dashboard publisher={this.publisher} sessionToken={session.token.replace("Basic ", "")}/>,
        document.getElementById("sp-dashboard-react-app")
      );
    }
  }

  return new WebPublisherDashboard();
}
