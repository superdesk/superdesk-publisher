/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherMonitoringController
 * @requires publisher
 * @requires modal
 * @requires authoringWorkspace
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherMonitoringController holds a set of functions used for web publisher monitoring
 */
WebPublisherMonitoringController.$inject = ['$scope', '$sce', 'modal', 'publisher', 'authoringWorkspace', '$window', 'notify', '$interval', 'config'];
export function WebPublisherMonitoringController($scope, $sce, modal, publisher, authoringWorkspace, $window, notify, $interval, config) {
    class WebPublisherMonitoring {
        constructor() {
            this.filterButtonAllActive = true;
            this.filterOpen = $window.localStorage.getItem('swpMonitoringFilterOpen') ? JSON.parse($window.localStorage.getItem('swpMonitoringFilterOpen' )) : false;

            publisher.setToken()
                .then(publisher.querySites)
                .then((sites) => {
                    this.sites = sites;
                    // loading routes for filter pane
                    angular.forEach(this.sites, (siteObj, key) => {
                        publisher.setTenant(siteObj);
                        publisher.queryRoutes({type: 'collection'}).then((routes) => {
                            siteObj.routes = routes;
                        });
                    });

                    this._setFilters();
                    this.websocketOpen();
                });

            $scope.$on('$destroy', () => {
                this.websocketClose();
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#websocketOpen
         * @description connects to websocket
         */
        websocketOpen() {
            let pubConfig = config.publisher || {};

            let domain = pubConfig.wsDomain ? pubConfig.wsDomain : `${pubConfig.tenant}.${pubConfig.domain}`;
            let port = pubConfig.wsPort ? `:${pubConfig.wsPort}` : '';
            let path = pubConfig.wsPath ? pubConfig.wsPath : '';

            this.ws = new WebSocket(`wss://${domain}${port}${path}?token=` + publisher.getToken());
            this.websocketBindEvents();
        };

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#websocketBindEvents
         * @description binds websocket events
         */
        websocketBindEvents() {
            this.ws.onclose = () => {
                $interval.cancel(this.wsTimer);
                this.wsTimer = $interval(() => {
                    if (this.ws) {
                        this.websocketOpen();
                    }
                }, 5000, 0, false); // passed invokeApply = false to prevent triggering digest cycle

            };

            this.ws.onopen = (event) => {
                $interval.cancel(this.wsTimer);
            };

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                // hello came
                if (data[0] === 0 ) {
                    // topic subscription
                    this.ws.send('[5, "package_created"]');
                }
                // package came
                if (data[0] === 8 && data[2].package ) {
                    $scope.$broadcast('newPackage', data[2].package, data[2].state);
                }
            }

        };

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#websocketClose
         * @description closes connection with websocket
         */
        websocketClose() {
            if (this.ws) {
                this.ws.close();
                this.ws = null;
            }
        };

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#toggleFilterPane
         * @description Toggles filter pane
         */
        toggleFilterPane() {
            this.filterOpen = !this.filterOpen;
            $window.localStorage.setItem('swpMonitoringFilterOpen', this.filterOpen);
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#editArticle
         * @param {Object} article
         * @description Open article in new tab for editing
         */
        editArticle(article) {
            let item = {};

            item._id = article.guid;
            authoringWorkspace.popup(item, 'edit');
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#removeArticle
         * @param {Object} article
         * @description Remove article from incoming list
         */
        removeArticle(article) {
            modal.confirm(gettext('Please confirm you want to remove article from incoming list.'))
                .then(() => publisher.removeArticle({update: {pubStatus: 'canceled'}}, article.id)
                .then(() => $scope.$broadcast('refreshArticlesList')));
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#openPreview
         * @param {Object} event
         * @param {Object} article
         * @description Open article preview pane
         */
        openPreview(e, article) {
            if (e.target.className !== 'icon-dots-vertical') {
                this.publishOpen = false;
                this.previewOpen = true;
                this.selectedArticle = article;
                this.bodyHtml = $sce.trustAsHtml(article.body_html);
            }
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#openPublish
         * @param {Object} article
         * @param {String} action
         * @description Open publish pane for publish/unpulbish
         */
        openPublish(article, action) {
            this.publishedDestinations = {};
            this.publishFilter = 'all';
            this.publishOpen = true;
            this.previewOpen = false;
            this.unpublishSelectAll = false;
            this.activePublishPane = action;
            this.selectedArticle = article;
            angular.forEach(this.sites, (site) => {
                site.routeEditing = false;
            });

            angular.forEach(article.articles, (item) => {
                this.publishedDestinations[item.tenant.code] =
                {
                    tenant: item.tenant,
                    route: item.route,
                    fbia: item.fbia,
                    status: item.status,
                    updatedAt: item.updatedAt,
                    unpublish: false
                };

                if (item.status == 'published') {
                    let tenantUrl = item.tenant.subdomain ? item.tenant.subdomain + '.'  + item.tenant.domainName : item.tenant.domainName;
                    this.publishedDestinations[item.tenant.code].liveUrl = 'http://' + tenantUrl + item._links.online.href;
                }
            });
            this.newDestinations = angular.copy(this.publishedDestinations);
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#publishArticle
         * @description Publish article to all selected routes
         */
        publishArticle() {
            angular.forEach(this.newDestinations, (item) => {
                item.unpublish = false;
                if (item.status == 'new') {
                    item.forcePublishing = true;
                }
            });

            let destinations = [];
            let oldDestinationsRoutes = [];
            let updatedKeys = this._updatedKeys(this.newDestinations, this.publishedDestinations);

            angular.forEach(updatedKeys, (item) => {
                destinations.push({
                    tenant: item,
                    route: this.newDestinations[item].route && this.newDestinations[item].route.id ? this.newDestinations[item].route.id : null,
                    fbia: this.newDestinations[item] && this.newDestinations[item].fbia === true,
                    published: this.newDestinations[item].route && this.newDestinations[item].route.id ? true : false
                });

                if (this.publishedDestinations[item] && this.publishedDestinations[item].route && this.publishedDestinations[item].route.id) {
                    oldDestinationsRoutes.push({
                        route: this.publishedDestinations[item].route.id});
                }
            });
            if (destinations.length) {
                publisher.publishArticle(
                    {publish: {destinations: destinations}}, this.selectedArticle.id)
                    .then(() => {
                        this.publishOpen = false;
                        $scope.$broadcast('refreshArticlesList', destinations, oldDestinationsRoutes);
                    })
                    .catch((err) => {
                        notify.error('Publishing failed!');
                    });
            }
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#unpublishAll
         * @description Select all tenants for unpublish
         */
        unpublishAll() {
            angular.forEach(this.newDestinations, (item) => {
                item.unpublish = this.unpublishSelectAll;
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#unPublishArticle
         * @description Unapublish article from all selected tenants
         */
        unPublishArticle() {
            let tenants = [];
            let oldDestinationsRoutes = [];
            let updatedKeys = this._updatedKeys(this.newDestinations, this.publishedDestinations);

            angular.forEach(updatedKeys, (item) => {
                if (this.newDestinations[item].unpublish === true) {
                    tenants.push(item);
                    oldDestinationsRoutes.push({
                        route: this.publishedDestinations[item].route.id});
                }
            });

            publisher.unPublishArticle(
                {unpublish: {tenants: tenants}}, this.selectedArticle.id)
                .then(() => {
                    this.publishOpen = false;
                    $scope.$broadcast('refreshArticlesList', tenants, oldDestinationsRoutes);
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#viewTenantArticles
         * @description Showing published articles by tenants
         */
        viewTenantArticles() {
            this.tenantArticles = true;
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#viewRouteArticles
         * @param {Object} site
         * @description Showing published articles by routes
         */
        viewRouteArticles(site) {
            this.routeArticles = true;
            $scope.loadArticles = false;
            publisher.setTenant(site);
            publisher.queryRoutes({type: 'collection'}).then((routes) => {
                $scope.loadArticles = true;
                this.routes = routes;
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#viewMonitoringHome
         * @description In monitoring function for backlink
         */
        viewMonitoringHome() {
            if (this.routeArticles) {
                this.routeArticles = null;
                return;
            }

            this.tenantArticles = null;
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#openArticlePreview
         * @param {String} routeId - id of route
         * @param {Object} site
         * @description Opens modal window for previewing article
         */
        openArticlePreview(routeId, site) {
            let token = publisher.getToken();

            let tenantUrl = site.subdomain ? site.subdomain + '.'
            + site.domainName : site.domainName;

            this.previewArticleUrls = {
                regular: '//' + tenantUrl + '/preview/package/' + routeId
                + '/' + this.selectedArticle.id + '?auth_token=' + token,
                amp: '//' + tenantUrl + '/preview/package/' + routeId
                + '/' + this.selectedArticle.id + '?auth_token=' + token + '&amp'
            };

            this.previewArticleSrc = $sce.trustAsResourceUrl(this.previewArticleUrls.regular);
            this.openArticlePreviewModal = true;
            this.setArticlePreviewMode('desktop');
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#setArticlePreviewMode
         * @param {String} mode - article preview mode (desktop, tablet, mobile etc)
         * @description Sets type/mode of article preview
         */
        setArticlePreviewMode(mode) {
            this.articlePreviewMode = mode;
            switch (mode) {
            case 'desktop':
                this.previewArticleSrc = $sce.trustAsResourceUrl(this.previewArticleUrls.regular);
                this.articlePreviewModeReadable = 'Desktop';
                break;
            case 'tablet':
                this.previewArticleSrc = $sce.trustAsResourceUrl(this.previewArticleUrls.regular);
                this.articlePreviewModeReadable = 'Tablet (portrait)';
                break;
            case 'tablet-landscape':
                this.previewArticleSrc = $sce.trustAsResourceUrl(this.previewArticleUrls.regular);
                this.articlePreviewModeReadable = 'Tablet (landscape)';
                break;
            case 'mobile':
                this.previewArticleSrc = $sce.trustAsResourceUrl(this.previewArticleUrls.regular);
                this.articlePreviewModeReadable = 'Mobile (portrait)';
                break;
            case 'mobile-landscape':
                this.previewArticleSrc = $sce.trustAsResourceUrl(this.previewArticleUrls.regular);
                this.articlePreviewModeReadable = 'Mobile (landscape)';
                break;
            case 'amp':
                this.previewArticleSrc = $sce.trustAsResourceUrl(this.previewArticleUrls.amp);
                this.articlePreviewModeReadable = 'AMP (portrait)';
                break;
            case 'amp-landscape':
                this.previewArticleSrc = $sce.trustAsResourceUrl(this.previewArticleUrls.amp);
                this.articlePreviewModeReadable = 'AMP (landscape)';
                break;
            }
        }


        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#filterRemoveDate
         * @param {Number} type - type of date to remove (publishedBefore, publishedAfter)
         * @description Removes date from filters list
         */
        filterRemoveDate(type) {
            delete this.advancedFilters[type];
        }

         /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#filterRemoveRoute
         * @param {String} tenantCode code of tenant
         * @param {String} routeId - id of route
         * @description Removes route from filters list
         */
        filterRemoveRoute(tenantCode, routeId) {
            this.advancedFilters.sites[tenantCode].routes[routeId].status = false;
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#filterRemoveTenant
         * @param {String} tenantCode code of tenant
         * @description Removes tenant from filters list
         */
        filterRemoveTenant(tenantCode) {
            this.advancedFilters.sites[tenantCode].status = false;
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#filterRemoveAuthor
         * @param {Number} index - index of the item to remove
         * @description Removes author from filters list
         */
        filterRemoveAuthor(index) {
            this.advancedFilters.author.splice(index, 1);
        }

         /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#filterAddAuthor
         * @description Adds author in criteria filters list
         */
        filterAddAuthor() {
            if (!this.advancedFilters.author) {
                this.advancedFilters.author = [];
            }

            this.advancedFilters.author.push('');
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#filterRemoveSource
         * @param {Number} index - index of the item to remove
         * @description Removes source from filters list
         */
        filterRemoveSource(index) {
            this.advancedFilters.source.splice(index, 1);
        }

         /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#filterAddSource
         * @description Adds source in criteria filters list
         */
        filterAddSource() {
            if (!this.advancedFilters.source) {
                this.advancedFilters.source = [];
            }

            this.advancedFilters.source.push('');
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#filtersClear
         * @description Clears filters
         */
        filtersClear() {
            this.advancedFilters = {
                sites: {}
            };
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#filtersSave
         * @description Saves user defined filter criteria
         */
        filtersSave() {
            angular.forEach(this.advancedFilters.sites, (site, key) => {
                angular.forEach(site.routes, (route, key) => {
                    if (!route.status) {
                        delete site.routes[key];
                    }
                });
            });

            let filters = angular.copy(this.advancedFilters);

            if (filters.term) {
                delete filters.term;
            }

            let settingsObj = {
                settings: {
                    name: 'filtering_prefrences',
                    value: JSON.stringify(filters)
                }
            };

            publisher.saveSettings(settingsObj);
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#_setFilters
         * @description Sets user defined advanced filters or default values
         */
        _setFilters() {
            this.advancedFilters = {
                sites: {}
            };

            publisher.getSettings()
                .then((settings) => {
                    // !!!!!!!!!!!!! TYPO IN API 'PREFERENCES' !!!!!!!!!!!!!!!
                    let filteringPreferences = JSON.parse(settings.filtering_prefrences.value);

                    if (!_.isEmpty(filteringPreferences)) {
                        this.advancedFilters = filteringPreferences;
                    }
                });

            $scope.$watch(() => this.advancedFilters, (newVal, oldVal) => {
                let updatedKeys = this._updatedKeys(newVal, oldVal);
                let changedValues = newVal[updatedKeys[0]];

                if (Array.isArray(changedValues) &&
                    changedValues.length > 0 &&
                    !changedValues[changedValues.length - 1]) {
                    return;
                }
                /**
                 * @ngdoc event
                 * @name WebPublisherMonitoringController#refreshArticles
                 * @eventType broadcast on $scope
                 * @param {Object} advancedFilters - filters to filter articles
                 * @description event is thrown when advanced filters are changed
                 */
                $scope.$broadcast('refreshArticlesList', undefined, undefined, this.advancedFilters);
            }, true);
        }

        /**
         * @ngdoc method
         * @name WebPublisherMonitoringController#_updatedKeys
         * @private
         * @param {Object} a
         * @param {Object} b
         * @returns {Array}
         * @description Compares 2 objects and returns keys of fields that are updated
         */
        _updatedKeys(a, b) {
            return _.reduce(a, (result, value, key) => _.isEqual(value, b[key]) ? result : result.concat(key), []);
        }
    }
    return new WebPublisherMonitoring();
}
