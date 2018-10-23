/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherOutputController
 * @requires publisher
 * @requires modal
 * @requires authoringWorkspace
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherOutputController holds a set of functions used for web publisher monitoring
 */
WebPublisherOutputController.$inject = ['$scope', '$sce', 'modal', 'publisher', 'authoringWorkspace', '$window', 'notify', '$interval', 'config'];
export function WebPublisherOutputController($scope, $sce, modal, publisher, authoringWorkspace, $window, notify, $interval, config) {
    class WebPublisherOutput {
        constructor() {
            this.filterButtonAllActive = true;
            this.filterOpen = $window.localStorage.getItem('swpOutputFilterOpen') ? JSON.parse($window.localStorage.getItem('swpOutputFilterOpen' )) : false;
            this.routes = [];
            this.advancedFilters = {};

            publisher.setToken().then(publisher.querySites)
                .then((sites) => {
                    this.sites = sites;
                    // loading routes for filter pane
                    angular.forEach(sites, (siteObj, key) => {
                        publisher.setTenant(siteObj);
                        publisher.queryRoutes({type: 'collection'}).then((routes) => {
                            siteObj.routes = routes;
                            angular.forEach(routes, (route, key) => {
                                route.name = siteObj.name + '/' + route.name;
                            });
                            this.routes = this.routes.concat(routes);
                        });
                    });

                    this.websocketOpen();

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
                        $scope.$broadcast('refreshArticlesList', this.advancedFilters);
                    }, true);
                });

            $scope.$on('$destroy', () => {
                this.websocketClose();
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#websocketOpen
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
         * @name WebPublisherOutputController#websocketBindEvents
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
         * @name WebPublisherOutputController#websocketClose
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
         * @name WebPublisherOutputController#toggleFilterPane
         * @description Toggles filter pane
         */
        toggleFilterPane() {
            this.filterOpen = !this.filterOpen;
            $window.localStorage.setItem('swpOutputFilterOpen', this.filterOpen);
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#editArticle
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
         * @name WebPublisherOutputController#removeArticle
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
         * @name WebPublisherOutputController#openPreview
         * @param {Object} article
         * @description Open article preview pane
         */
        openPreview(article) {
            this.previewOpen = true;
            this.selectedArticle = article;
            this.bodyHtml = $sce.trustAsHtml(article.body_html);
        }

         /**
         * @ngdoc method
         * @name WebPublisherOutputController#closePreview
         * @description Close article preview pane
         */
        closePreview() {
            this.previewOpen = false;
            if (!this.publishOpen) this.selectedArticle = null;
        }


        publishingAddDestination(site) {
            const tenant = _.find(this.sites, t => t.code === site.code);

            _.remove(this.publishingAvailableSites, el => el.code === tenant.code);

            let temp = new Object;

            temp[tenant.code] = {
                tenant: tenant,
                route: null,
                isPublishedFbia: false,
                paywallSecured: false,
                status: "new",
                isOpen: true
            };

            this.newDestinations = {...temp, ...this.newDestinations};
        }

        publishingRemoveDestination(destination) {
            delete this.newDestinations[destination.tenant.code];
            this.publishingAvailableSites.push({code: destination.tenant.code, name: destination.tenant.name});
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#openPublish
         * @param {Object} article
         * @param {String} action
         * @description Open publish pane for publish/unpulbish
         */
        openPublish(article, action) {
            this.publishedDestinations = {};
            this.publishFilter = 'all';
            this.publishOpen = true;
            this.unpublishSelectAll = false;
            this.activePublishPane = action;
            this.selectedArticle = article;
            this.publishingAvailableSites = [];

            angular.forEach(this.sites, (site, key) => {
                this.publishingAvailableSites.push({code: site.code, name: site.name});
            });

            angular.forEach(article.articles, (item) => {
                if (item.route){

                    _.remove(this.publishingAvailableSites, el => el.code === item.tenant.code);

                    this.publishedDestinations[item.tenant.code] =
                    {
                        tenant: item.tenant,
                        route: item.route,
                        isPublishedFbia: item.isPublishedFbia,
                        status: item.status,
                        updatedAt: item.updatedAt,
                        paywallSecured: item.paywallSecured
                    };

                    if (item.status == 'published') {
                        let tenantUrl = item.tenant.subdomain ? item.tenant.subdomain + '.'  + item.tenant.domainName : item.tenant.domainName;
                        this.publishedDestinations[item.tenant.code].liveUrl = 'http://' + tenantUrl + item._links.online.href;
                    }
                }
            });
            this.newDestinations = angular.copy(this.publishedDestinations);
        }

         /**
         * @ngdoc method
         * @name WebPublisherOutputController#closePublish
         * @description Close article publish pane
         */
        closePublish() {
            this.publishOpen = false;
            if (!this.previewOpen) this.selectedArticle = null;
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#publishArticle
         * @description Publish article to all selected routes
         */
        publishArticle() {
            angular.forEach(this.newDestinations, (item) => {
                if (item.status == 'new') {
                    item.forcePublishing = true;
                }
            });

            let destinations = [];
            let updatedKeys = this._updatedKeys(this.newDestinations, this.publishedDestinations);

            angular.forEach(updatedKeys, (item) => {
                destinations.push({
                    tenant: item,
                    route: this.newDestinations[item].route && this.newDestinations[item].route.id ? this.newDestinations[item].route.id : null,
                    isPublishedFbia: this.newDestinations[item] && this.newDestinations[item].isPublishedFbia === true,
                    published: this.newDestinations[item].route && this.newDestinations[item].route.id ? true : false,
                    paywallSecured: this.newDestinations[item] && this.newDestinations[item].paywallSecured === true
                });
            });

            if (destinations.length) {
                publisher.publishArticle(
                    {publish: {destinations: destinations}}, this.selectedArticle.id)
                    .then(() => {
                        this.closePublish();
                        this.closePreview();
                        $scope.$broadcast('refreshArticlesList');
                    })
                    .catch((err) => {
                        notify.error('Publishing failed!');
                    });
            }
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#unPublishArticle
         * @description Unapublish article from all selected tenants
         */
        unPublishArticle() {
            let tenants = [];
            let updatedKeys = this._updatedKeys(this.newDestinations, this.publishedDestinations);

            angular.forEach(updatedKeys, (item) => {
                if (this.newDestinations[item].unpublish === true) {
                    tenants.push(item);
                }
            });

            publisher.unPublishArticle(
                {unpublish: {tenants: tenants}}, this.selectedArticle.id)
                .then(() => {
                    this.closePublish();
                    this.closePreview();
                    $scope.$broadcast('refreshArticlesList');
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#viewMonitoringHome
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
         * @name WebPublisherOutputController#openArticlePreview
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
         * @name WebPublisherOutputController#setArticlePreviewMode
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
         * @name WebPublisherOutputController#_updatedKeys
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
    return new WebPublisherOutput();
}
