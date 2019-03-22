/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherContentListsController
 * @requires publisher
 * @requires modal
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherContentListsController holds a set of functions used for web publisher content listis
 */
WebPublisherContentListsController.$inject = ['$scope', '$sce', 'publisher', 'publisherHelpers', 'modal', '$timeout', '$route', '$location', 'notify'];
export function WebPublisherContentListsController($scope, $sce, publisher, publisherHelpers, modal, $timeout, $route, $location, notify) {
    class WebPublisherContentLists {
        constructor() {
            $scope.loading = true;

            publisher.setToken()
                .then(publisher.querySites)
                .then((sites) => {
                    if (sites.length < 2) this.closedContentNav = true;
                    this.sites = sites;
                    this.activeView = 'content-lists';
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

            $scope.timeout = $timeout(function(){});

            $scope.$watch('newList.filters.term', function(newValue, oldValue) {
                if( oldValue !== newValue) {
                    $timeout.cancel($scope.timeout);
                    $scope.timeout = $timeout(function(){
                        $scope.webPublisherContentLists.filterArticles();
                    }, 1000);
                }
            });

            this.selectedArticle = null;
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#getThumbnail
         * @param {Object} article - article content object
         * @description Sets the active view name to the given value
         */
        getThumbnail(article) {
            return publisherHelpers.getRenditionUrl(article, 'thumbnail');
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#openPreview
         * @param {Object} article
         * @description Open article preview pane
         */
        openPreview(article) {
            let art = article;

            if (article.content) art = article.content;
            this.previewOpen = true;
            this.selectedArticle = art;
            this.bodyHtml = $sce.trustAsHtml(art.body);
        }

         /**
         * @ngdoc method
         * @name WebPublisherContentListsController#closePreview
         * @description Close article preview pane
         */
        closePreview() {
            this.previewOpen = false;
            if (!this.publishOpen) this.selectedArticle = null;
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#getViewImage
         * @param {Object} article - article content object
         * @description Sets the active view name to the given value
         */
        getViewImage(article) {
            return publisherHelpers.getRenditionUrl(article, 'viewImage');
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#countPageViews
         * @param {Array} articles
         * @description Counts total page views
         */
        countPageViews(articles = []) {
            return publisherHelpers.countPageViews(articles);
        }

        /**
         * @ngdoc method
         * @name WebPublisherOutputController#countComments
         * @param {Array} articles
         * @description Counts total comments
         */
        countComments(articles = []) {
            return publisherHelpers.countComments(articles);
        }


        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#changeTab
         * @param {String} newViewName - name of the active view
         * @param {Bool} refresh - refresh lists flag
         * @description Sets the active view name to the given value
         */
        changeView(newViewName, refresh = true) {
            this.activeView = newViewName;
            this.filterOpen = newViewName === 'content-list-automatic' ? true : false;

            if (newViewName === 'content-lists') {
                this.listChangeFlag = false;
                if (refresh) {
                    $location.path('/publisher/content_lists', false);
                    this._refreshLists();
                }
            }
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#setTenant
         * @param {Object} site
         * @description Sets tenant
         */
        setTenant(site) {
            publisher.setTenant(site);
            this.selectedTenant = site;
            this.activeView = 'content-lists';
            this._refreshLists().then(() => {
                if ($route.current.params._list) {
                    let list = _.find($scope.lists, list => list.id === parseInt($route.current.params._list) );

                    if (list) this.openListCriteria(list);
                }
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#createListCard
         * @param {String} listType - type of content list
         * @description Creates a new unsaved content list card
         */
        createListCard(listType) {
            this.changeView('content-lists', false);
            // update filtering
            if(this.listType && this.listType != listType) {
                this.listType = '';
            }
            this.selectedList = {};
            $scope.newList = {type: listType, cacheLifeTime: 0};
            $scope.lists.push($scope.newList);
            this.listAdd = true;
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#editListCard
         * @param {Object} list - content list card which is edited
         * @description Edit content list card
         */
        editListCard(list) {
            this.selectedList = list;
            $scope.newList = angular.copy(list);
            this.listAdd = true;
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#cancelEditListCard
         * @description Canceling update of content list card
         */
        cancelEditListCard() {
            $scope.newList = angular.copy(this.selectedList);
            this.listAdd = false;
            if (!this.selectedList.id) {
                $scope.lists.pop();
            }
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#editListCardSettings
         * @param {Object} list - list for editing
         * @description Opens modal window for editing settings
         */
        editListCardSettings(list) {
            this.selectedList = list;
            $scope.newList = angular.copy(list);
            this.settingsModal = true;
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#cancelListCardSettings
         * @description Cancels editing settings for list
         */
        cancelListCardSettings() {
            this.selectedList = {};
            $scope.newList = {};
            this.settingsModal = false;
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#saveList
         * @description Creates content list
         */
        saveList() {
            delete $scope.newList.visible;
            let updatedKeys = this._updatedKeys($scope.newList, this.selectedList);

            $scope.loading = true;
            publisher.manageList({content_list: _.pick($scope.newList, updatedKeys)}, this.selectedList.id)
                .then(this._refreshLists.bind(this))
                .catch(err => {
                    notify.error('Something went wrong. Try again.');
                    $scope.loading = false;
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#saveManualList
         * @description Clears and saves state of manual content list
         */
        saveManualList() {
            $scope.loading = true;

            publisher.saveManualList(
                {content_list: {items: $scope.newList.updatedItems, updated_at: $scope.newList.updatedAt}},
                $scope.newList.id
                )
                .then((savedList) => {
                    $scope.newList.updatedAt = savedList.updatedAt;
                    $scope.newList.updatedItems = [];
                    this._queryList();
                    this.listChangeFlag = false;
                })
                .catch(err => {
                    if(err.status === 409) {
                        notify.error('Cannot save. List has been already modified by another user');
                        this.reloadSelectedList();
                        this.listChangeFlag = false;
                    } else {
                        notify.error('Something went wrong. Try again.');
                        $scope.loading = false;
                    }
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#deleteList
         * @param {String} id - id of content list which is deleted
         * @description Deleting content list
         */
        deleteList(id) {
            modal.confirm(gettext('Please confirm you want to delete list.'))
                .then(() => {
                    publisher.removeList(id).then(this._refreshLists.bind(this));
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#openListCriteria
         * @param {Object} list - list for editing
         * @description Opens list criteria page
         */
        openListCriteria(list) {
            this.selectedList = list;
            $scope.newList = angular.copy(list);
            this.metadataList = [];
            this.selectedRoutes = [];
            $scope.routes = null;

            if (list.type === 'manual' && this.tenantArticles && this.tenantArticles.items) {
                this.tenantArticles = {
                    page: 0,
                    params: {}
                };
                this.loadMoreTenantArticles();
            } else {
                this.tenantArticles = {
                    page: 0,
                    params: {}
                };
            }

            if (!$scope.newList.filters) {
                $scope.newList.filters = {};
            }

            if (list.type === 'automatic') {
                this.filterOpen = true;
            }

            if (list.type === 'manual') {
                this._queryList();
            }

            if ($scope.newList.filters.metadata) {
                angular.forEach($scope.newList.filters.metadata, (value, key) => {
                    this.metadataList.push({metaName: key, metaValue: value});
                });
            }

            publisher.queryRoutes({type: 'collection'}).then((routes) => {
                $scope.routes = routes;
                if ($scope.newList.filters.route && $scope.newList.filters.route.length > 0) {
                    routes.forEach((item) => {
                        if ($scope.newList.filters.route.indexOf(item.id + '') !== -1) {
                            this.selectedRoutes.push(item);
                        }
                    });
                }
            });

            this.changeView(list.type === 'automatic' ? 'content-list-automatic' : 'content-list-manual');
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#saveListCriteria
         * @description Update criteria for content list
         */
        saveListCriteria() {
            var updatedFilters = _.pickBy($scope.newList.filters, _.identity);

            updatedFilters.metadata = {};
            this.metadataList.forEach((item) => {
                if (item.metaName) {
                    updatedFilters.metadata[item.metaName] = item.metaValue;
                }
            });

            delete updatedFilters.route;
            if (this.selectedRoutes.length > 0) {
                updatedFilters.route = [];
                this.selectedRoutes.forEach((item) => {
                    updatedFilters.route.push(item.id);
                });
            }
            $scope.loading = true;

            /**
             * @ngdoc event
             * @name WebPublisherContentListsController#refreshListArticles
             * @eventType broadcast on $scope
             * @param {Object} $scope.newList - list which will refresf articles
             * @description event is thrown when criteria is updated
             */
            publisher.manageList({content_list: {filters: updatedFilters}}, this.selectedList.id)
                .then((response) => {
                    let index = $scope.lists.findIndex(el => el.id === response.id );
                    if (index > -1) {
                        $scope.lists[index] = response;
                    }
                    $scope.loading = false;
                    $scope.$broadcast('refreshListArticles', $scope.newList)
                })
                .catch(err => {
                    if(err.status === 409) {
                        notify.error('Cannot save. List has been already modified by another user');
                        this.reloadSelectedList();
                        this.listChangeFlag = false;
                    } else {
                        notify.error('Something went wrong. Try again.');
                        $scope.loading = false;
                    }
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#reloadSelectedList
         * @description reloads all lists, resets currently edited list
         */
        reloadSelectedList() {
            this._refreshLists()
                .then(() => {
                    let currentList = $scope.lists.find(list => list.id === $scope.newList.id);

                    if (currentList) this.openListCriteria(currentList);
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#filterArticles
         * @description
         */
        filterArticles() {
            let filters = _.pickBy($scope.newList.filters, _.identity);

            this.metadataList.forEach((item) => {
                if (item.metaName && item.metaValue) {
                    if (!filters['metadata[' + item.metaName + ']']) {
                        filters['metadata[' + item.metaName + ']'] = [];
                    }

                    filters['metadata[' + item.metaName + ']'].push(item.metaValue);
                }
            });

            delete filters.route;
            if (this.selectedRoutes.length > 0) {
                filters.route = [];
                this.selectedRoutes.forEach((item) => {
                    filters.route.push(item.id);
                });
            }

            this.tenantArticles.params = filters;
            this._queryArticles();
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#addMetadata
         * @description Adds metadata in criteria filters list
         */
        addMetadata() {
            this.metadataList.push({metaName: '', metaValue: ''});
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#removeMetadata
         * @param {Number} itemIdx - index of the item to remove
         * @description Removes metadata from criteria filters list
         */
        removeMetadata(itemIdx) {
            this.metadataList.splice(itemIdx, 1);
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#loadMoreTenantArticles
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
         * @name WebPublisherContentListsController#removeFromList
         * @param {Int} index
         * @description Removes article from list
         */
        removeFromList(index) {
            let deletedItem;
            let selectedItemId;
            let updatedItem;

            if (!$scope.newList.updatedItems) {
                $scope.newList.updatedItems = [];
            }

            deletedItem = $scope.newList.items.splice(index, 1);
            selectedItemId = deletedItem[0].content ? deletedItem[0].content.id : deletedItem[0].id;
            updatedItem = _.find($scope.newList.updatedItems, {content_id: selectedItemId});
            if (!updatedItem) {
                $scope.newList.updatedItems.push({content_id: selectedItemId, action: 'delete'});
            } else if (updatedItem.action === 'move') {
                // removes old one and adds delete action
                $scope.newList.updatedItems.splice($scope.newList.updatedItems.indexOf(updatedItem), 1);
                $scope.newList.updatedItems.push({content_id: selectedItemId, action: 'delete'});
            } else {
                $scope.newList.updatedItems.splice($scope.newList.updatedItems.indexOf(updatedItem), 1);
            }
            this._markDuplicates($scope.newList.items);
            this.listChangeFlag = true;
        };

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#onDrop
         * @param {Object} list - list of article items
         * @param {Array} item - dropped items
         * @param {Int} index - index of list where items were dropped
         * @returns {Object}
         * @description Handles drop event
         */
        onDrop(list, item, index) {
            this.listChangeFlag = true;

            if (!list.updatedItems) {
                list.updatedItems = [];
            }

            let selectedItemId = item.content ? item.content.id : item.id;
            let itemAction = _.find(list.items,
                item => (item.id === selectedItemId && !item.content) || (item.content && item.content.id === selectedItemId)) ? 'move' : 'add';

            list.updatedItems.push({content_id: selectedItemId, action: itemAction, position: index});

            if (itemAction === 'add') {
                $timeout(() => {
                    this.updatePositions(list);
                }, 500);
            }
            return item;
        };

         /**
         * @ngdoc method
         * @name WebPublisherContentListsController#onMoved
         * @param {Object} list - list object
         * @param {Int} index - index of list where items were dropped
         * @description Handles move event
         */
        onMoved(list, index) {
            list.items.splice(index, 1);
            this.updatePositions(list);
        };

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#updatePositions
         * @param {Object} list - list object
         * @description updates position of articles in array of changes
         */
        updatePositions(list) {
            for (let i = 0; i < list.updatedItems.length; i++) {
                let itemInList = _.find(list.items, {content: {id: list.updatedItems[i].content_id}}) ||
                        _.find(list.items, {id: list.updatedItems[i].content_id});

                list.updatedItems[i].position = list.items.indexOf(itemInList);
            }
        };

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#_editMode
         * @private
         * @param {Object} card - card for which to check mode
         * @param {Object} selected - selected card(for edit)
         * @param {Boolean} addFlag - is card added
         * @returns {Boolean}
         * @description Checking if card is in edit mode
         */
        _editMode(card, selected, addFlag) {
            return !card.id || selected && card.id === selected.id && addFlag;
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#_updatedKeys
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
         * @name WebPublisherContentListsController#_refreshLists
         * @private
         * @description Loads list of content lists
         */
        _refreshLists() {
            this.listAdd = false;
            this.listPaneOpen = false;
            this.settingsModal = false;
            $scope.loading = true;
            return publisher.queryLists().then((lists) => {
                $scope.loading = false;
                $scope.lists = lists;
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherContentListsController#_queryArticles
         * @private
         * @description Loads articles
         */
        _queryArticles() {
            this.tenantArticles.loading = true;
            this.tenantArticles.params.limit = 20;
            this.tenantArticles.params['sorting[updatedAt]'] = 'desc';
            this.tenantArticles.params.status = 'published';

            publisher.queryTenantArticles(this.tenantArticles.params).then((response) => {
                response._embedded._items.forEach(el => {
                    el.type = 'tenant';
                });
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
         * @name WebPublisherContentListsController#_queryList
         * @private
         * @description Loads items for selected list
         */
        _queryList() {
            $scope.loading = true;
            publisher.queryListArticles($scope.newList.id).then((articles) => {
                $scope.loading = false;
                $scope.newList.items = articles;
                $scope.newList.items.forEach(el => {
                    el.type = 'list';
                });
                this._markDuplicates($scope.newList.items);
            });
        }

         /**
         * @ngdoc method
         * @name WebPublisherContentListsController#_markDuplicates
         * @private
         * @param {Array} array
         * @description marks duplicated items in array
         */
        _markDuplicates(array) {
            $timeout(() => {
                array.forEach(el => {
                    let elId =  el.content ? el.content.id : el.id;
                    let result = array.filter(element => {
                        let elementId = element.content ? element.content.id : element.id;
                        return elId === elementId;
                    });
                    el.duplicate = result.length > 1 ? true : false;
                })
            }, 500);
        }

    }

    return new WebPublisherContentLists();
}
