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
WebPublisherOutputController.$inject = ['$scope', '$sce', 'modal', 'publisher', 'publisherHelpers', 'authoringWorkspace', '$window', 'notify', '$interval', 'config'];
export function WebPublisherOutputController($scope, $sce, modal, publisher, publisherHelpers, authoringWorkspace, $window, notify, $interval, config) {
    class WebPublisherOutput {
        constructor() {
            this.filterButtonAllActive = true;
            this.filterOpen = $window.localStorage.getItem('swpOutputFilterOpen') ? JSON.parse($window.localStorage.getItem('swpOutputFilterOpen' )) : false;
            this.routes = [];
            this.advancedFilters = {};
            this.listType = $window.localStorage.getItem('swpOutputListType') ? $window.localStorage.getItem('swpOutputListType') : 'incoming';
            // flag to make sure that setToken was fired. Used to control directives that do requests on their own.
            this.loading = true;
            this.articlesCount = {incoming: 0, published: 0};

            publisher.setToken().then(publisher.querySites)
                .then((sites) => {
                    this.loading = false;
                    this.sites = sites;
                    // loading routes and content lists
                    angular.forEach(sites, (siteObj, key) => {
                        publisher.setTenant(siteObj);
                        publisher.queryRoutes({type: 'collection'}).then((routes) => {
                            siteObj.routes = routes;
                            angular.forEach(routes, (route, key) => {
                                route.name = siteObj.name + '/' + route.name;
                            });
                            this.routes = this.routes.concat(routes);
                        });
                        publisher.queryLists().then((lists) => {
                            siteObj.content_lists = lists;
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

            $scope.$watch(() => this.listType, (newVal, oldVal) => {
                $window.localStorage.setItem('swpOutputListType', newVal);
                this.closePreview();
                this.closePublish();
            }, true);

            $scope.$watch(authoringWorkspace.getState, (state) => {
                this.editorOpen = state && state.item ? true : false;
                if (this.editorOpen) {
                    this.closePreview();
                    this.closePublish();
                }
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

            let protocol = (pubConfig.wsProtocol && pubConfig.wsProtocol.length > 0) ? `${pubConfig.wsProtocol}` : 'wss';
            let domain = pubConfig.wsDomain;
            let port = pubConfig.wsPort ? `:${pubConfig.wsPort}` : '';
            let path = pubConfig.wsPath ? pubConfig.wsPath : '';

            this.ws = new WebSocket(`${protocol}://${domain}${port}${path}?token=`
                                    + publisher.getToken());
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
         * @name WebPublisherOutputController#correctArticle
         * @param {Object} article
         * @description Open article in new tab for correction
         */
        correctArticle(article) {
            let item = {};

            item._id = article.guid;
            authoringWorkspace.edit(item, 'correct');
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#removeArticle
         * @param {Object} article
         * @description Remove article from incoming list
         */
        removeArticle(article) {
            modal.confirm(gettext('Please confirm you want to remove article from incoming list.'))
                .then(() => publisher.removeArticle({pub_status: 'canceled'}, article.id)
                .then(() => $scope.$broadcast('removeFromArticlesList', article.id)));
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

            if (this.publishOpen) {
                if (this.editorOpen) {
                    this.closePublish();
                } else {
                    this.openPublish(this.selectedArticle);
                }
            }
            this.bodyHtml = $sce.trustAsHtml(article.body_html);
            if (!$scope.$$phase) $scope.$digest();
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

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#getViewImage
         * @param {Object} article - article content object
         * @description Sets the active view name to the given value
         */
        getViewImage(article) {
            return publisherHelpers.getRenditionUrl(article, 'viewImage');
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#getRouteNameById
         * @param {Int} routeId
         * @param {String} tenantCode
         * @description returns route name with given id
         */
        getRouteNameById(routeId, tenantCode) {
            if (!routeId) return '';

            const tenant = _.find(this.sites, t => t.code === tenantCode);
            let route = tenant.routes.find(el => el.id === routeId);

            if (route && route.name.indexOf('/')) {
                return route.name.substring(route.name.indexOf('/') + 1);
            }
            return route ? route.name : '';
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#shouldItemMarkedUnpublished
         * @param {Object} destination
         * @description returns true if item should be marked as unpublished (red border etc)
         */
        shouldItemMarkedUnpublished(destination) {
            if (destination.status !== 'unpublished') return false;

            // checking if route changed
            return this.publishedDestinations[destination.tenant.code].route.id === this.newDestinations[destination.tenant.code].route.id;
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#publishingAddDestination
         * @param {Object} site
         * @description Adds destination
         */
        publishingAddDestination(site) {
            const tenant = _.find(this.sites, t => t.code === site.code);

            _.remove(this.publishingAvailableSites, el => el.code === tenant.code);

            let temp = new Object;

            temp[tenant.code] = {
                tenant: tenant,
                route: null,
                is_published_fbia: false,
                paywall_secured: false,
                status: "new",
                content_lists: [],
                isOpen: true
            };
            this.newDestinations = {...temp, ...this.newDestinations};
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#publishingRemoveDestination
         * @param {Object} destination
         * @description Removes destination
         */
        publishingRemoveDestination(destination) {
            delete this.newDestinations[destination.tenant.code];
            this.publishingAvailableSites.push({code: destination.tenant.code, name: destination.tenant.name});
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#contentListPositionRange
         * @param {Number} listId
         * @param {Array} lists - tenant content lists
         * @description Content list set order helper. Creates an array to ng-repeat through
         */
        contentListPositionRange(listId, lists) {
            let list = lists.find(l => l.id === listId);
            let max = 0;
            let arr = [];

            if (list) max = list.content_list_items_count;
            for (let i = 0; i <= max; i++) {
                arr.push(i);
            }
            return arr;
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#getContentListName
         * @param {Object} list
         * @param {Array} lists - tenant content lists
         * @description Content list set order helper. Creates an array to ng-repeat through
         */
        getContentListName(list, lists) {
            if (list.name) return list.name;

            let theList = lists.find(l => l.id === list.id);
            return theList ? theList.name : '';
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#openPublish
         * @param {Object} article
         * @param {String} action
         * @description Open publish pane for publish/unpulbish
         */
        openPublish(article, action = 'publish') {
            this.publishedDestinations = {};
            this.publishOpen = true;
            this.unpublishSelectAll = false;
            this.activePublishPane = action;
            this.selectedArticle = article;
            this.publishFilter = 'all';
            this.publishingAvailableSites = [];
            this.relatedArticles = [];
            this.relatedArticlesLoading = true;

            publisher.queryRelatedArticlesStatus(article.id)
                .then(response => {
                    this.relatedArticles = response.relatedArticleItems;
                    this.relatedArticlesLoading = false;
                });

            if (this.editorOpen) {
                this.closePreview();
            }

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
                        is_published_fbia: item.is_published_fbia,
                        status: item.status,
                        updated_at: item.updated_at,
                        paywall_secured: item.paywall_secured,
                        content_lists: item.content_lists
                    };

                    if (item.status == 'published') {
                        let tenantUrl = item.tenant.subdomain ? item.tenant.subdomain + '.'  + item.tenant.domain_name : item.tenant.domain_name;
                        this.publishedDestinations[item.tenant.code].live_url = 'http://' + tenantUrl + item._links.online.href;
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
            // forcing predefined destinations pass through _updatedKeys filtering
            angular.forEach(this.newDestinations, (item) => {
                if (item.status === 'new') {
                    item.forcePublishing = true;
                }
            });

            let destinations = [];
            let updatedKeys = this._updatedKeys(this.newDestinations, this.publishedDestinations);

            angular.forEach(updatedKeys, (item) => {

                let destination = {
                    tenant: item,
                    route: this.newDestinations[item].route && this.newDestinations[item].route.id ? this.newDestinations[item].route.id : null,
                    is_published_fbia: this.newDestinations[item] && this.newDestinations[item].is_published_fbia === true,
                    published: this.newDestinations[item].route && this.newDestinations[item].route.id ? true : false,
                    paywall_secured: this.newDestinations[item] && this.newDestinations[item].paywall_secured === true
                };

                if (this.newDestinations[item].status === 'new' && this.newDestinations[item].content_lists.length) {
                    destination.content_lists = this.newDestinations[item].content_lists;
                }

                destinations.push(destination);
            });

            if (destinations.length) {
                publisher.publishArticle(
                    {destinations: destinations}, this.selectedArticle.id)
                    .then(() => {
                        $scope.$broadcast('removeFromArticlesList', this.selectedArticle.id);
                        this.closePublish();
                        this.closePreview();
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
                {tenants: tenants}, this.selectedArticle.id)
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
            + site.domain_name : site.domain_name;

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

        // ----- social media/seo

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#toggleSmOverlay
         * @param {String} type - type of data (Facebook, Twitter, SEO)
         * @description Toggles social media editor
         */
        toggleSmOverlay(type) {
            this.smOverlayOpen = !this.smOverlayOpen;
            if (this.smOverlayOpen) this.smOverlayType = type;
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

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#_isEmpty
         * @param {Object} item
         * @returns {Boolean}
         * @description checks if item is empty
         */
        _isEmpty(item) {
            return _.isEmpty(item);
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#_isAnythingToUnpublish
         * @returns {Boolean}
         * @description checks if there are any published destinations left
         */
        _isAnythingToUnpublish() {
            let destinations = _.pickBy(this.newDestinations, (value, key) => value.unpublish);
            return _.isEmpty(destinations);
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#_isTenantWithinTenants
         * @param {String} tenantCode
         * @param {Array} tenantsList
         * @returns {Boolean}
         * @description checks if tenant is available in tenantsList
         */
        _isTenantWithinTenants(tenantCode, tenantsList) {
            let index = tenantsList.findIndex(t => t.code === tenantCode);
            return index > -1;
        }
    }
    return new WebPublisherOutput();
}
