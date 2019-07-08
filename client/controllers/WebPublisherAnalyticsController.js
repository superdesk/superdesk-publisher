/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherAnalyticsController
 * @requires publisher
 * @requires modal
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherAnalyticsController holds a set of functions used for web publisher analytics
 */
WebPublisherAnalyticsController.$inject = ["$scope", "publisher", "$route"];
export function WebPublisherAnalyticsController($scope, publisher, $route) {
  class WebPublisherAnalytics {
    constructor() {
      this.tenant = $route.current.params._tenant;
      this.publisher = publisher;
    }
  }

  return new WebPublisherAnalytics();
}
