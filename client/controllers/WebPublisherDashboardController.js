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
            this.siteWizardActive = false;
            $scope.loading = true;

            publisher.setToken().then(() => {
                this._loadThemes().then(this._refreshSites);
            });
            this.livesitePermission = privileges.userHasPrivileges({livesite: 1});
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#changeTab
         * @param {String} newTabName - name of the new active tab
         * @description Sets the active tab name to the given value
         */
        changeTab(newTabName) {
            this.activeTab = newTabName;
            this._loadLists(newTabName);
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#changeRouteFilter
         * @param {String} type - type of routes
         * @description Sets type for routes
         */
        changeRouteFilter(type) {
            this.routeType = type;
            this._refreshRoutes();
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
         * @name WebPublisherDashboardController#toggleEditSite
         * @description Toggles modal window for editing site
         */
        toggleEditSite() {
            this.openSiteModal = !this.openSiteModal;
            if (!this.openSiteModal && this.selectedSite.subdomain) {
                /**
                 * @ngdoc event
                 * @name WebPublisherDashboardController#refreshRoutes
                 * @eventType broadcast on $scope
                 * @param {String} subdomain - subdomain for which to refresh routes
                 * @description event is thrown when modal window is closed and saved site is selected
                 */
                $scope.$broadcast('refreshRoutes', this.selectedSite.subdomain);
            }
            this.selectedSite = {};
            $scope.newSite = {};
            publisher.setTenant();
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
         * @name WebPublisherDashboardController#editSite
         * @param {Object} site - site which is edited
         * @description Opens modal window for editing site
         */
        editSite(site) {
            this.selectedSite = site;
            $scope.newSite = angular.copy(site);
            this.openSiteModal = true;
            publisher.setTenant(site);
            this._refreshThemeSettings();
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#cancelEditSite
         * @description Canceles changes to site
         */
        cancelEditSite() {
            $scope.newSite = angular.copy(this.selectedSite);
            this.siteForm.$setPristine();
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#saveSite
         * @description Saving site
         */
        saveSite() {
            let updatedKeys = this._updatedKeys($scope.newSite, this.selectedSite);

            publisher.manageSite({tenant: _.pick($scope.newSite, updatedKeys)}, this.selectedSite.code)
                .then((site) => {
                    this.siteForm.$setPristine();
                    this.selectedSite = site;
                    publisher.setTenant(site);
                    this._refreshSites();
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#deleteSite
         * @param {String} code - code of site which is deleted
         * @description Deleting site
         */
        deleteSite(code) {
            modal.confirm(gettext('Please confirm you want to delete website.')).then(
                () => publisher.removeSite(code)
                .then(() => {
                    publisher.setTenant();
                    this._refreshSites();
                })
                .catch((err) => {
                    if(err.status === 409) {
                        console.log(409);
                        modal.confirm(gettext(err.data.message + ' Are you sure you want to delete?')).then(
                            () => publisher.removeSite(code, {force: true})
                            .then(() => {
                                publisher.setTenant();
                                this._refreshSites();
                            })
                        )
                    }
                })
            );
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
         * @name WebPublisherDashboardController#toogleCreateRoute
         * @param {Boolean} paneOpen - should pane be open
         * @description Opens window for creating new route
         */
        toogleCreateRoute(paneOpen) {
            this.selectedRoute = {};
            $scope.newRoute = {};
            this.routePaneOpen = paneOpen;
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#editRoute
         * @param {Object} route - route which is edited
         * @description Opens window for editing route
         */
        editRoute(route) {
            this.routeForm.$setPristine();
            this.selectedRoute = route;
            $scope.newRoute = angular.copy(route);
            // we never edit list of children
            delete $scope.newRoute.children;
            this.routePaneOpen = true;
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#saveRoute
         * @description Saving route
         */
        saveRoute() {
            let updatedKeys = this._updatedKeys($scope.newRoute, this.selectedRoute);

            // only for updating, parent is received as object but for update id is needed
            if ($scope.newRoute.parent && $scope.newRoute.parent.id) {
                $scope.newRoute.parent = $scope.newRoute.parent.id;
            }

            publisher.manageRoute({route: _.pick($scope.newRoute, updatedKeys)}, this.selectedRoute.id)
                .then((route) => {
                    this.routePaneOpen = false;
                    this._refreshRoutes();
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#deleteRoute
         * @param {String} id - id of route which is deleted
         * @description Deleting route
         */
        deleteRoute(id) {
            modal.confirm(gettext('Please confirm you want to delete route.')).then(() =>
                publisher.removeRoute(id)
                    .then(this._refreshRoutes))
                    .catch(err => {
                        let message = err.data.message ? err.data.message : 'Something went wrong. Try again.';
                        modal.confirm(message);
                    });
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#createMenuCard
         * @description Creates a new unsaved menu card in navigation.
         */
        createMenuCard() {
            this.selectedMenu = {};
            $scope.newMenu = {};
            $scope.menus.push($scope.newMenu);
            this.menuAdd = true;
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#editMenuCard
         * @param {Object} menu - menu card which is edited
         * @description Edit menu card in navigation.
         */
        editMenuCard(menu) {
            this.selectedMenu = menu;
            $scope.newMenu = angular.copy(menu);
            this.menuAdd = true;
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#cancelEditMenuCard
         * @description Canceling update of menu card
         */
        cancelEditMenuCard() {
            $scope.newMenu = angular.copy(this.selectedMenu);
            this.menuAdd = false;
            if (!this.selectedMenu.id) {
                $scope.menus.pop();
            }
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#saveMenu
         * @param {Function} refreshList - refreshing proper list after save
         * @description Creates menu in navigation or in menu tree
         */
        saveMenu(refreshList) {
            let updatedKeys = this._updatedKeys($scope.newMenu, this.selectedMenu);

            publisher.manageMenu({menu: _.pick($scope.newMenu, updatedKeys)}, this.selectedMenu.id)
                .then(refreshList.bind(this));
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#deleteMenu
         * @param {String} id - id of menu which is deleted
         * @description Deleting menu
         */
        deleteMenu(id) {
            modal.confirm(gettext('Please confirm you want to delete menu.'))
                .then(() => {
                    publisher.removeMenu(id).then(this._refreshMenus.bind(this));
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#editMenuTree
         * @param {Object} menu - root menu object for the tree
         * @description Opens the menu tree edit page.
         */
        editMenuTree(menu) {
            $scope.menu = menu;
            $scope.menusInTree = this._flattenTree(menu);
            publisher.queryRoutes().then((routes) => {
                $scope.routes = routes;
            });
            this.changeTab('navigation-menu');
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#toogleCreateMenu
         * @param {Boolean} paneOpen - should pane be open
         * @description Creates a new menu
         */
        toogleCreateMenu(paneOpen) {
            this.selectedMenu = {};
            $scope.newMenu = {};
            this.menuPaneOpen = paneOpen;
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#editMenu
         * @param {Object} menu - menu which is edited
         * @description Edit menu in tree
         */
        editMenu(menu) {
            this.menuForm.$setPristine();
            this.selectedMenu = menu;
            $scope.newMenu = angular.copy(menu);
            this.menuPaneOpen = true;
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#removeMenu
         * @param {Object} menu - menu object to remove
         * @description Removes this menu from the site.
         */
        removeMenu(menu) {
            modal.confirm(gettext('Please confirm you want to delete menu.'))
                .then(() => {
                    publisher.removeMenu(menu.id).then(this._refreshCurrentMenu.bind(this));
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#reorderMenu
         * @param {Object} list - object where list of menu items is
         * @param {Object} item - object which is moved
         * @param {Number} index - index where item would be moved
         * @description Move menu to different position
         */
        reorderMenu(list, item, index) {
            if (index !== -1) {
                let parentId = list.children[0].parent;
                let removedItem = _.find(list.children, {id: item.id});

                if (removedItem) {
                    removedItem.removed = true;
                }

                list.children = list.children.slice(0, index)
                    .concat(item)
                    .concat(list.children.slice(index))
                    .filter((item) => !item.removed);

                let menuPosition = list.children.indexOf(item);

                if (menuPosition !== item.position || parentId !== item.parent) {
                    list.children[menuPosition].position = menuPosition;

                    publisher.reorderMenu({menu_move: {parent: parentId, position: menuPosition}}, item.id)
                        .then(this._refreshCurrentMenu.bind(this));
                }
            }
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#reorderRoute
         * @param {Object} list - object where list of route items is
         * @param {Object} item - object which is moved
         * @param {Number} index - index where item would be moved
         * @description Move route to different position
         */
        reorderRoute(list, item, index) {
            if (index !== -1) {
                let removedItem = _.find(list.children, {id: item.id});

                if (removedItem) {
                    removedItem.removed = true;
                } else if (item.parent) {
                    // item was a subroute and was moved to other list
                    let parent = _.find(list.children, {id: item.parent});
                    removedItem = _.find(parent.children, {id: item.id});

                    if (removedItem) {
                        removedItem.removed = true;
                        parent.children = parent.children.filter((item) => !item.removed);
                    }
                } else if (!item.parent) {
                    // item was top level and was moved to other list
                    removedItem = _.find($scope.routes.children, {id: item.id});

                    if (removedItem) {
                        removedItem.removed = true;
                        $scope.routes.children = $scope.routes.children.filter((item) => !item.removed);
                    }
                }

                list.children = list.children.slice(0, index)
                    .concat(item)
                    .concat(list.children.slice(index))
                    .filter((item) => !item.removed);


                let parentId = list.children[0].parent;
                let newPosition = list.children.indexOf(item);
                // when new item was placed on position 0
                if (newPosition === 0) {
                    parentId = list.children[list.children.length-1].parent;
                }

                if (newPosition !== item.position || parentId !== item.parent) {
                    list.children[newPosition].position = newPosition;

                    publisher.reorderRoute({route: {parent: parentId, position: newPosition}}, item.id)
                        .then(this._refreshRoutes.bind(this));
                }
            }
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#toggleInfoCarousel
         * @description Toggles info carousel
         */
        toggleInfoCarousel() {
            this.infoCarouselActive = !this.infoCarouselActive;
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#toggleSiteWizard
         * @param {String} outputChannelType - channel type (eg wordpress, drupal)
         * @description Toggles site creation wizard
         */
        toggleSiteWizard(outputChannelType) {
            if(this.siteWizardActive) {
               this._refreshSites();
            }
            this.siteWizardOutputChannelType = outputChannelType ? outputChannelType : null;
            this.siteWizardActive = !this.siteWizardActive;
            publisher.setTenant();
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#themeActivatedCallback
         * @description Fires when theme got activated in theme manager directive
         */
        themeActivatedCallback() {
            this._refreshThemeSettings();
        };

         /**
         * @ngdoc method
         * @name WebPublisherDashboardController#themeSettingsRevert
         * @description Reverts theme settings to default values
         */
        themeSettingsRevert() {
            $scope.loading = true;
            publisher.settingsRevert('theme').then( () => {
                this._refreshThemeSettings().then( () => {
                    $scope.loading = false;
                })
            });
        }

         /**
         * @ngdoc method
         * @name WebPublisherDashboardController#cancelEditThemeSettings
         * @description Reverts theme settings to default values
         */
        cancelEditThemeSettings() {
            $scope.newThemeSettings = angular.copy(this.themeSettings);
            this.themeSettingsForm.$setPristine();
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#saveThemeSettings
         * @description Saving theme settings and logo
         */
        saveThemeSettings() {
            let settingsToSave = _.map($scope.newThemeSettings.settings, (value) => {
                return _.pick(value, ['name', 'value']);
            });
            publisher.saveSettings({settings: {bulk: settingsToSave}})
                .then((settings) => {
                    this.themeSettingsForm.$setPristine();
                });
        }

         /**
         * @ngdoc method
         * @name WebPublisherDashboardController#uploadThemeLogo
         * @param {Array} files - selected files
         * @param {String}  type - type of logo (theme_logo, theme_logo_second etc)
         * @description Uploads new theme logo
         */
        uploadThemeLogo(files, type) {
            $scope.newThemeSettings[type].error = false;

            if (files && files.length) {
                let logoFile = files[0];
                if (!logoFile.$error) {
                    publisher.uploadThemeLogo({'logo': logoFile}, type)
                        .then((response) => {
                           this.themeSettings[type] = response.data;
                           let flagName = 'replace_' + type;
                           this[flagName] = false;
                        })
                        .catch((err) => {
                            $scope.newThemeSettings[type].error = true;
                        });
                }
            }
        }


        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#_editMode
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
         * @name WebPublisherDashboardController#_flattenTree
         * @private
         * @param {Object} tree
         * @returns {Array}
         * @description Returns all children objects from tree
         */
        _flattenTree(tree, flattened = []) {
            flattened.push(tree);

            if (tree.children.length) {
                for (let node of tree.children) {
                    this._flattenTree(node, flattened);
                }
            }

            return flattened;
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#_loadLists
         * @private
         * @param {String} tabName - name of selected tab
         * @description Loads lists dependent on selected tab
         */
        _loadLists(tabName) {
            switch (tabName) {
            case 'routes':
                this.changeRouteFilter('');
                this._refreshRoutes();
                break;
            case 'navigation':
                this._refreshMenus();
                break;
            }
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
                angular.forEach(sites, (site) => {
                    site.theme = $scope.organizationThemes.find(theme => site.themeName == theme.name);
                });

                $scope.sites = sites;
                $scope.loading = false;
                if(!$scope.sites.length) {
                    this.toggleInfoCarousel();
                }
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#_refreshRoutes
         * @private
         * @description Loads list of routes
         */
        _refreshRoutes() {
            publisher.queryRoutes().then((routes) => {
                let filteredRoutes = {children: null};

                if (this.routeType === 'content'){
                    filteredRoutes.children = routes.filter((item) => item.type === 'content');
                }
                else if (this.routeType === 'collection') {
                    filteredRoutes.children = routes.filter((item) => item.type === 'collection').filter((item) => !item.parent);
                } else {
                    filteredRoutes.children = routes.filter((item) => !item.parent);
                }
                $scope.routes = filteredRoutes;
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#_refreshCurrentMenu
         * @private
         * @description Loads child menus for selected menu
         */
        _refreshCurrentMenu() {
            this.menuPaneOpen = false;
            publisher.getMenu($scope.menu.id).then((menu) => {
                $scope.menu = menu;
                $scope.menusInTree = this._flattenTree(menu);
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#_refreshMenus
         * @private
         * @description Loads list of menus
         */
        _refreshMenus() {
            this.menuAdd = false;
            this.menuPaneOpen = false;
            publisher.queryMenus().then((menus) => {
                $scope.menus = menus;
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#_loadThemes
         * @private
         * @description Loads list of all themes
         */

        _loadThemes() {
            return publisher.getOrganizationThemes().then((response) => {
                $scope.organizationThemes = response._embedded._items;
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherDashboardController#_refreshThemeSettings
         * @private
         * @description Loads theme settings
         */
        _refreshThemeSettings() {
            return publisher.getThemeSettings().then((settings) => {
                this.themeSettings = {};
                this.themeSettings.theme_logo = _.find(settings, { 'name': 'theme_logo' });
                this.themeSettings.theme_logo_second = _.find(settings, { 'name': 'theme_logo_second' });
                this.themeSettings.theme_logo_third = _.find(settings, { 'name': 'theme_logo_third' });
                _.remove(settings, (setting) => {
                    return (setting.name.includes('theme_logo')) ? true : false;
                });
                // little hack to make ng-select work properly
                this.themeSettings.settings = settings
                    .map(setting => {
                        if (setting.options) {
                            setting.value = setting.value.toString();
                        }
                        return setting;
                    }
                );
                $scope.newThemeSettings = angular.copy(this.themeSettings);
            });
        }
    }

    return new WebPublisherDashboard();
}
