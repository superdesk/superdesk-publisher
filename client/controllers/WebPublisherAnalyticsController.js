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
            this.advancedFilters = {};

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

                    this._queryRoutes();
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
            this._queryRoutes();
        }

        /**
         * @ngdoc method
         * @name WebPublisherAnalyticsController#filter
         * @description Triggers article reload
         */
        filter() {
            this.tenantArticles = {};
            this._queryArticles();
        }

        /**
         * @ngdoc method
         * @name WebPublisherAnalyticsController#setDay
         * @param {String} dayName
         * @description Sets published before and published after to match given day
         */
        setDay(dayName = 'today') {
            let day = new moment();

            if (dayName === 'yesterday') {
                day = day.add(-1, 'day');
            }

            let dayString = day.format('YYYY-MM-DD');
            this.advancedFilters.published_before = dayString;
            this.advancedFilters.published_after = dayString;
        }

        /**
         * @ngdoc method
         * @name WebPublisherAnalyticsController#isDay
         * @param {String} dayName
         * @description Checks if published before and published after match given day
         */
        isDay(dayName = 'today') {
            if (this.advancedFilters.published_before && this.advancedFilters.published_before
                && this.advancedFilters.published_before === this.advancedFilters.published_after) {

                let day = new moment();

                if (dayName === 'today' && this.advancedFilters.published_before === day.format('YYYY-MM-DD')) {
                    return true;
                }

                if (dayName === 'yesterday' && this.advancedFilters.published_before === day.add(-1, 'day').format('YYYY-MM-DD')) {
                    return true;
                }
            }


            return false;
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
            this.tenantArticles.params = {};
            this.tenantArticles.params.limit = 20;
            this.tenantArticles.params['sorting[published_at]'] = 'desc';
            this.tenantArticles.params.status = 'published';

            if (this.advancedFilters.author && this.advancedFilters.author.length) {
                this.tenantArticles.params['author[]'] = this.advancedFilters.author;
            }

            if (this.advancedFilters.routes && this.advancedFilters.routes.length) {
                let routes = [];

                angular.forEach(this.advancedFilters.routes, (routeObj, key) => {
                    routes.push(routeObj.id);
                });

                this.tenantArticles.params['route[]'] = routes;
            }

            this.tenantArticles.params.published_before = this.advancedFilters.published_before;
            this.tenantArticles.params.published_after = this.advancedFilters.published_after;

            publisher.queryTenantArticles(this.tenantArticles.params).then((response) => {
                this.tenantArticles.loading = false;
                this.tenantArticles.page = response.page;
                this.tenantArticles.totalPages = response.pages;
                this.tenantArticles.items = response.page > 1 ?
                    this.tenantArticles.items.concat(response._embedded._items) :
                    response._embedded._items;
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherAnalyticsController#_queryRoutes
         * @private
         * @description Loads routes
         */
        _queryRoutes() {
            publisher.queryRoutes({type: 'collection'}).then((routes) => {
                this.routes = routes;
            });
        }



    }

    return new WebPublisherAnalytics();
}
