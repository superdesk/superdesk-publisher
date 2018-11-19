/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherDashboardController
 * @requires publisher
 * @requires modal
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherManagerController holds a set of functions used for web publisher manager
 */
WebPublisherDashboardController.$inject = ['$scope', 'publisher', 'modal', 'privileges', '$window'];
export function WebPublisherDashboardController($scope, publisher, modal, privileges, $window) {
    class WebPublisherDashboard {
        constructor() {
            this.TEMPLATES_DIR = 'scripts/apps/web-publisher/views';
            $scope.loading = true;

            publisher.setToken().then(() => {
                this._refreshSites();
            });
            this.livesitePermission = privileges.userHasPrivileges({livesite: 1});
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#changeListFilter
         * @param {String} type - type of content lists
         * @description Sets type for content lists
         */
        changeListFilter(type) {
            this.listType = type;
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#activateLiveSite
         * @param {Object} site - site which is edited
         * @description Opens site in new tab with live site activated
         */
        activateLiveSite(site) {
            publisher.setTenant(site);
            publisher.activateLiveSite().then((response) => {
                $window.open(response.url, '_blank');
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#isObjEmpty
         * @param {Object} value
         * @returns {Boolean}
         * @description Checks if object is empty
         */
        isObjEmpty(value) {
            return angular.equals({}, value);
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#_updatedKeys
         * @private
         * @param {Object} a
         * @param {Object} b
         * @returns {Array}
         * @description Compares 2 objects and returns keys of fields that are updated
         */
        _updatedKeys(a, b) {
            return _.reduce(a, (result, value, key) => _.isEqual(value, b[key]) ? result : result.concat(key), []);
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#_refreshSites
         * @private
         * @description Loads list of sites
         */
        _refreshSites() {
            $scope.loading = true;
            return publisher.querySites().then((sites) => {
                // assigning theme to site
                $scope.sites = sites;
                $scope.loading = false;
            });
        }
    }

    return new WebPublisherDashboard();
}
