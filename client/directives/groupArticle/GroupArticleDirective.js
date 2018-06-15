/**
 * @ngdoc directive
 * @module superdesk.apps.web_publisher
 * @name sdGroupArticle
 * @requires publisher
 * @description Directive list articles by group in monitoring
 */
GroupArticleDirective.$inject = ['publisher'];
export function GroupArticleDirective(publisher) {
    class GroupArticle {
        constructor() {
            this.scope = {
                rootType: '@',
                site: '=site',
                route: '=route',
                webPublisherMonitoring: '=webPublisherMonitoring',
                initialFilters: '=filters'
            };

            this.template = require('./view.html');
        }

        link(scope) {
            scope.articlesList = [];
            scope.articlesLimit = 20;
            scope.filters = scope.initialFilters ? scope.initialFilters : {};
            scope.loadedFilters = !!scope.initialFilters;

            scope.buildTenantParams = () => {
                let tenant = [];

                if (scope.site) {
                    tenant.push(scope.site.code);
                }

                if (!tenant.length && scope.filters.sites && !_.isEmpty(scope.filters.sites)) {
                    angular.forEach(scope.filters.sites, (site, key) => {
                        if (site.status) {
                            tenant.push(key);
                        }
                    });
                }

                return tenant;
            };

            scope.buildRouteParams = () => {
                let route = [];

                if (scope.route) {
                    route.push(scope.route.id);
                }

                if (!route.length && scope.filters.sites) {
                    angular.forEach(scope.filters.sites, (siteObj, tenantCode) => {
                        if ((!scope.site || scope.site.code === tenantCode) && siteObj.routes) {
                            angular.forEach(siteObj.routes, (routeObj, key) => {
                                if (routeObj.status) {
                                    route.push(key);
                                }
                            });
                        }
                    });
                }

                return route;
            };

            scope.buildUniversalParams = () => {
                let universalParams = {};

                if (scope.filters.author && scope.filters.author.length) {
                    universalParams['author[]'] = scope.filters.author;
                }

                if (scope.filters.source && scope.filters.source.length) {
                    universalParams['source[]'] = scope.filters.source;
                }

                if (scope.filters.term && scope.filters.term.length) {
                    universalParams.term = scope.filters.term;
                }

                return universalParams;
            };

            scope.buildQueryParams = (reset) => {
                let page = reset || !scope.totalArticles ? 1 : scope.totalArticles.page + 1;
                let queryParams = {
                    page: page,
                    limit: scope.articlesLimit,
                    'status[]': [],
                    'sorting[updatedAt]': 'desc'
                };

                let route = scope.buildRouteParams();
                let tenant = scope.buildTenantParams();
                let universal = scope.buildUniversalParams();

                queryParams = Object.assign(queryParams, universal);

                // building query params for both cases
                if (scope.rootType && scope.rootType === 'incoming') {
                    queryParams['status[]'] = ['new'];
                } else {
                    queryParams['status[]'] = ['published', 'unpublished'];
                    queryParams['tenant[]'] = tenant.length ? tenant : undefined;
                    queryParams['route[]'] = route.length ? route : undefined;
                    queryParams.publishedBefore = scope.filters.publishedBefore;
                    queryParams.publishedAfter = scope.filters.publishedAfter;
                }

                return queryParams;
            };

            scope.loadArticles = (reset) => {
                if (scope.loadingArticles) {
                    return;
                }

                if (reset) {
                    scope.articlesList = [];
                }

                let queryParams = scope.buildQueryParams(reset);

                if (!reset && scope.totalArticles && queryParams.page > scope.totalArticles.pages) {
                    return;
                }

                scope.loadingArticles = true;

                publisher.queryMonitoringArticles(queryParams).then((articles) => {
                    scope.totalArticles = articles;
                    scope.articlesList = scope.articlesList.concat(articles._embedded._items);
                    scope.loadingArticles = false;
                });
            };

            scope.$on('newPackage', (e, item, state) => {
               if (!this._isNewPackageInteresting(item, scope)) {
                   return false;
               }
               item.animate = true;
               if (state === 'update') {
                    //update
                    let elIndex = scope.articlesList.findIndex(el => el.guid === item.guid);
                    if (elIndex != -1) {
                        scope.articlesList[elIndex] = item;
                        scope.$apply();
                    }
               } else {
                    //new article
                    scope.articlesList = [item].concat(scope.articlesList);
                    if (scope.articlesList.length % scope.articlesLimit === 0) {
                        scope.articlesList.splice(-1,1)
                    }
                    scope.totalArticles.total += 1;
                    scope.totalArticles.pages = Math.ceil(scope.totalArticles.total/scope.articlesLimit);
               }

            });

            scope.$on('refreshArticlesList', (e, updatedDestinations, oldDestinationsRoutes, filters) => {
                if (filters) {
                    scope.filters = filters;
                    scope.loadedFilters = true;
                }

                if (filters || scope.rootType ||
                    scope.site && _.find(updatedDestinations, {tenant: scope.site.code}) ||
                    scope.route && _.find(updatedDestinations, {route: scope.route.id}) ||
                    scope.route && _.find(oldDestinationsRoutes, {route: scope.route.id})) {
                    scope.loadArticles(true);
                }
            });
        }

        _isNewPackageInteresting(item, scope) {


            if ( scope.rootType &&
                (scope.rootType == 'incoming' && item.status == 'published' ||
                scope.rootType == 'published' && item.status == 'new') ) {
                return false;
            }
            // if site is defined check if matches tenants from incoming package
            if (scope.site && scope.site.code ) {
                let siteFlag = null;
                item.articles.forEach((article) => {
                    siteFlag = article.status != 'new' && article.tenant.code === scope.site.code ? true : false;
                });

                if (siteFlag === false) return false;
            }
            // if site and route is defined check if matches routes from incoming package
            if (scope.route && scope.route.id ) {
                let routeFlag = null;
                item.articles.forEach((article) => {
                    routeFlag = article.route.id === scope.route.id ? true : false;
                });

                if (routeFlag === false) return false;
            }
            // return true if everything passes checks
            return true;
        };
    }

    return new GroupArticle();
}
