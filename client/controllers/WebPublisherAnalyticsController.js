/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherAnalyticsController
 * @requires publisher
 * @requires modal
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherAnalyticsController holds a set of functions used for web publisher analytics
 */
WebPublisherAnalyticsController.$inject = ['$scope', 'publisher', 'modal', '$route'];
export function WebPublisherAnalyticsController($scope, publisher, modal, $route) {
    class WebPublisherAnalytics {
        constructor() {
            $scope.loading = true;

            publisher.setToken()
                .then(publisher.querySites)
                .then((sites) => {
                    if (sites.length < 2) this.closedContentNav = true;

                    this.sites = sites;
                    $scope.loading = false;
                    // set first tenant automatically
                    this.selectedTenant = null;
                    if ($route.current.params._tenant) {
                        let site = _.find(this.sites, site => {
                            return site.code === $route.current.params._tenant;
                        });
                        if (site) this.setTenant(site);
                    } else if (sites[0]) {
                        this.setTenant(sites[0]);
                    }
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherAnalyticsController#setTenant
         * @param {Object} site
         * @description Sets tenant
         */
        setTenant(site) {
            publisher.setTenant(site);
            this.selectedTenant = site;
            this.tenantArticles = {
                page: 0,
                params: {},
                loading: false
            };
            this.loadMoreTenantArticles();
        }

        /**
         * @ngdoc method
         * @name WebPublisherAnalyticsController#loadMoreTenantArticles
         * @description loads more items
         */
        loadMoreTenantArticles() {
            if (this.tenantArticles.loading || this.tenantArticles.page >= this.tenantArticles.totalPages) {
                return;
            }

            this.tenantArticles.params.page = this.tenantArticles.page + 1;
            this._queryArticles();
        };

        /**
         * @ngdoc method
         * @name WebPublisherAnalyticsController#_queryArticles
         * @private
         * @description Loads articles
         */
        _queryArticles() {
            this.tenantArticles.loading = true;
            this.tenantArticles.params.limit = 20;
            this.tenantArticles.params['sorting[publishedAt]'] = 'desc';
            this.tenantArticles.params.status = 'published';

            publisher.queryTenantArticles(this.tenantArticles.params).then((response) => {
                this.tenantArticles.loading = false;
                this.tenantArticles.page = response.page;
                this.tenantArticles.totalPages = response.pages;
                this.tenantArticles.items = response.page > 1 ?
                    this.tenantArticles.items.concat(response._embedded._items) :
                    response._embedded._items;
            });
        }
    }

    return new WebPublisherAnalytics();
}
