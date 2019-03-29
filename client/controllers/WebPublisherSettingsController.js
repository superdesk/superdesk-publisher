/**
 * @ngdoc controller
 * @module superdesk.apps.web_publisher
 * @name WebPublisherSettingsController
 * @requires publisher
 * @requires https://docs.angularjs.org/api/ng/type/$rootScope.Scope $scope
 * @description WebPublisherSettingsController holds a set of functions used for web publisher settings
 */
WebPublisherSettingsController.$inject = ['$scope', 'publisher', 'modal', 'vocabularies', '$sce'];
export function WebPublisherSettingsController($scope, publisher, modal, vocabularies, $sce) {
    class WebPublisherSettings {
        constructor() {
            this.TEMPLATES_DIR = 'scripts/apps/web-publisher/views';
            $scope.mainLoading = true;
            this.siteWizardActive = false;

            publisher.setToken()
                .then(publisher.querySites)
                .then((sites) => {
                    this.sites = sites;
                    $scope.mainLoading = false;
                    // loading routes
                    angular.forEach(this.sites, (siteObj, key) => {
                        publisher.setTenant(siteObj);
                        publisher.queryRoutes({type: 'collection'}).then((routes) => {
                            siteObj.routes = routes;
                        });
                    });
                    // rules panel is default
                    this.changePanel('tenant');
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#changePanel
         * @param {String} newPanelName - name of the new active panel
         * @description Sets the active panel name to the given value
         */
        changePanel(newPanelName) {
            this.activePanel = newPanelName;
            this._prepareData(newPanelName);
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_prepareData
         * @private
         * @param {String} panelName - name of selected panel
         * @description Prepares data dependent on selected panel
         */
        _prepareData(panelName) {
            switch (panelName) {
            case 'rules':
                this.selectedRule = {};
                this._refreshRules();
                break;
            case 'tenant':
                this.openSiteEdit = false;
                this._loadThemes().then(this._refreshSites);
                break;
            }
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#toggleSiteWizard
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
         * @name WebPublisherSettingsController#changeManageTab
         * @param {String} newTabName - name of the new active tab
         * @description Sets the active tab name to the given value
         */
        changeManageTab(newTabName) {
            this.manageTab = newTabName;

            switch (newTabName) {
                case 'routes':
                    this.changeRouteFilter('');
                    this._refreshRoutes();
                    break;
                case 'navigation':
                    this._refreshMenus();
                    break;
                case 'theme-settings':
                    // reseting logo replacement flags
                    this.replace_theme_logo = false;
                    this.replace_theme_logo_second = false;
                    this.replace_theme_logo_third = false;
                    break;
                case 'webhooks':
                    this.selectedWebhook = {};
                    this._refreshWebhooks();
                    break;
                }
        }

        // -------------------------------- WEBHOOKS

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#toggleCreateWebhook
         * @param {Boolean} paneOpen - should pane be open
         * @description Opens window for creating new webhook
         */
        toggleCreateWebhook(paneOpen) {
            this.selectedWebhook = {};
            $scope.newWebhook = {enabled: true};
            this.webhookPaneOpen = paneOpen;
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#editWebhook
         * @param {Object} webhook - webhook which is edited
         * @description Opens window for editing webhook
         */
        editWebhook(webhook) {
            this.selectedWebhook = webhook;
            $scope.newWebhook = angular.copy(webhook);
            this.webhookPaneOpen = true;
            this.webhookForm.$setPristine();
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#saveWebhook
         * @description Saving webhook
         */
        saveWebhook() {
            let newWebhook= $scope.newWebhook;
            let updatedKeys = this._updatedKeys(newWebhook, this.selectedWebhook);
            $scope.loading = true;

            publisher.manageWebhook({webhook: _.pick(newWebhook, updatedKeys)}, this.selectedWebhook.id)
                .then((webhook) => {
                    this.webhookPaneOpen = false;
                    this.selectedWebhook = {};
                    this._refreshWebhooks();
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#deleteWebhook
         * @param {String} id - id of webhook which is deleted
         * @description Deleting webhook
         */
        deleteWebhook(id) {
            modal.confirm(gettext('Please confirm you want to delete webhook.'))
                .then(() => publisher.removeWebhook(id).then(() => { this._refreshWebhooks() }))
                .catch(err => {
                    let message = err.data.message ? err.data.message : 'Something went wrong. Try again.';
                    modal.confirm(message);
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_refreshWebhooks
         * @description Loads webhooks
         */
        _refreshWebhooks() {
            $scope.loading = true;
            publisher.getWebhooks()
                .then((webhooks) => {
                    this.webhooks = webhooks;
                    $scope.loading = false;
                });
        }

        // -------------------------------- ROUTES

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#toogleCreateRoute
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
         * @name WebPublisherSettingsController#editRoute
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
         * @name WebPublisherSettingsController#saveRoute
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
         * @name WebPublisherSettingsController#deleteRoute
         * @param {String} id - id of route which is deleted
         * @description Deleting route
         */
        deleteRoute(id) {
            modal.confirm(gettext('Please confirm you want to delete route.'))
                .then(() => publisher.removeRoute(id).then(() => { this._refreshRoutes() }))
                .catch(err => {
                    let message = err.data.message ? err.data.message : 'Something went wrong. Try again.';
                    modal.confirm(message);
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#changeRouteFilter
         * @param {String} type - type of routes
         * @description Sets type for routes
         */
        changeRouteFilter(type) {
            this.routeType = type;
            this._refreshRoutes();
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#reorderRoute
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
         * @name WebPublisherSettingsController#_refreshRoutes
         * @private
         * @description Loads list of routes
         */
        _refreshRoutes() {
            $scope.loading = true;
            publisher.queryRoutes().then((routes) => {
                $scope.loading = false;
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

        // ---------------------------------- NAVIGATION

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#createMenuCard
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
         * @name WebPublisherSettingsController#editMenuCard
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
         * @name WebPublisherSettingsController#cancelEditMenuCard
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
         * @name WebPublisherSettingsController#saveMenu
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
         * @name WebPublisherSettingsController#deleteMenu
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
         * @name WebPublisherSettingsController#editMenuTree
         * @param {Object} menu - root menu object for the tree
         * @description Opens the menu tree edit page.
         */
        editMenuTree(menu) {
            $scope.menu = menu;
            $scope.menusInTree = this._flattenTree(menu);
            publisher.queryRoutes().then((routes) => {
                $scope.routes = routes;
            });
            this.changeManageTab('navigation-menu');
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_flattenTree
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
         * @name WebPublisherSettingsController#toogleCreateMenu
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
         * @name WebPublisherSettingsController#editMenu
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
         * @name WebPublisherSettingsController#navigationMenuSetUri
         * @description Sets proper uri/slug for selected route
         */
        navigationMenuSetUri() {
            if ($scope.newMenu.route) {
                let route = $scope.routes.find(route => route.id === $scope.newMenu.route);

                $scope.newMenu.uri = route.staticPrefix;
            }
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#removeMenu
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
         * @name WebPublisherSettingsController#reorderMenu
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
         * @name WebPublisherSettingsController#_refreshCurrentMenu
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
         * @name WebPublisherSettingsController#_refreshMenus
         * @private
         * @description Loads list of menus
         */
        _refreshMenus() {
            $scope.loading = true;
            this.menuAdd = false;
            this.menuPaneOpen = false;
            publisher.queryMenus().then((menus) => {
                $scope.loading = false;
                $scope.menus = menus;
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_editMode
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


        // ---------------------------------- SITE

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#editSite
         * @param {Object} site - site which is edited
         * @param {String} tab - name of active tab
         * @description Opens modal window for editing site
         */
        editSite(site, tab = 'general') {
            this.selectedSite = site;
            $scope.newSite = angular.copy(site);
            this.openSiteEdit = true;
            publisher.setTenant(site);
            this.changeManageTab(tab);
            this._refreshThemeSettings();
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#cancelEditSite
         * @description Canceles changes to site
         */
        cancelEditSite() {
            $scope.newSite = angular.copy(this.selectedSite);
            this.siteForm.$setPristine();
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#toggleEditSite
         * @description Toggles modal window for editing site
         */
        toggleEditSite() {
            this.openSiteEdit = !this.openSiteEdit;
            this.selectedSite = {};
            $scope.newSite = {};
            publisher.setTenant();
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#saveSite
         * @description Saving site
         */
        saveSite() {
            let updatedKeys = this._updatedKeys(filteredNewSite, this.selectedSite);
            this.loading = true;
            publisher.manageSite({tenant: _.pick($scope.newSite, updatedKeys)}, this.selectedSite.code)
                .then((site) => {
                    this.siteForm.$setPristine();
                    this.selectedSite = site;
                    this.loading = false;
                    publisher.setTenant(site);
                    this._refreshSites();
                }).catch(err => {
                    $scope.newSite = angular.copy(this.selectedSite);
                    this.loading = false;
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#deleteSite
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
         * @name WebPublisherSettingsController#themeActivatedCallback
         * @description Fires when theme got activated in theme manager directive
         */
        themeActivatedCallback() {
            this._refreshThemeSettings();
        };

         /**
         * @ngdoc method
         * @name WebPublisherSettingsController#themeSettingsRevert
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
         * @name WebPublisherSettingsController#cancelEditThemeSettings
         * @description Reverts theme settings to default values
         */
        cancelEditThemeSettings() {
            $scope.newThemeSettings = angular.copy(this.themeSettings);
            this.themeSettingsForm.$setPristine();
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#saveThemeSettings
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
         * @name WebPublisherSettingsController#uploadThemeLogo
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
         * @name WebPublisherSettingsController#toggleCreateRule
         * @param {String} type - organization/tenant
         * @description Opens window for creating new rule
         */
        toggleCreateRule(type) {
            this.selectedRule = {};
            $scope.newRule = {
                type: type,
                destinations: [],
                expressions: [{}]
            };

            this.rulePaneOpen = type ? true : false;
            if (this.rulePaneOpen) this._prepareExpressionBuilder();
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#getTenantNameByCode
         * @param {String} code - tenant code
         * @description gets tenant name by its code
         */
        getTenantNameByCode(code) {
            let tenant = this.sites.find((site) => {
                return site.code == code;
            });

            return tenant ? tenant.name : null;
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#getTenantOutputChannelNameByCode
         * @param {String} code - tenant code
         * @description gets tenant name by its code
         */
        getTenantOutputChannelNameByCode(code) {
            let tenant = this.sites.find((site) => {
                return site.code == code;
            });

            return tenant && tenant.outputChannel ? tenant.outputChannel.type : null;
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#getTenantUrlByCode
         * @param {String} code - tenant code
         * @description gets tenant url by its code
         */
        getTenantUrlByCode(code) {
            let tenant = this.sites.find(function(site) {
                return site.code == code;
            });

            return tenant ? tenant.subdomain + '.' + tenant.domainName : null;
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#getRouteNameByTenantAndId
         * @param {String} tenantCode - tenant code
         * @param {Number} routeId - route id
         * @description gets route name by tenant and route id
         */
        getRouteNameByTenantAndId(tenantCode, routeId) {
            let tenant = this.sites.find(function(site) {
                return site.code == tenantCode;
            });

            let route = tenant.routes.find(function(route) {
                return route.id == routeId;
            });

            return route.name;
        }

         /**
         * @ngdoc method
         * @name WebPublisherSettingsController#makeExpressionReadable
         * @param {String} expression - expression
         * @description makes rule expression readable
         */
        makeExpressionReadable(expression) {
            let language = '<span class="label label--yellow2">Language</span>';

            let readable = expression
                .replace(new RegExp('true == true', 'gmu'), 'catch all')
                .replace(new RegExp('(article|package).(getLanguage|getLocale)\\(\\)', 'gmu'), 'Language')
                .replace(new RegExp('(article.getPackage\\(\\)|package).getSource\\(\\)', 'gmu'), 'Source')
                .replace(new RegExp('(article.getPackage\\(\\)|package).getPriority\\(\\)', 'gmu'), 'Priority')
                .replace(new RegExp('(article.getPackage\\(\\)|package).getUrgency\\(\\)', 'gmu'), 'Urgency')
                .replace(new RegExp('(article|package).getAuthorsNames\\(\\)', 'gmu'), 'Authors')
                .replace(new RegExp('(article.getPackage\\(\\)|package).getServicesNames\\(\\)', 'gmu'), 'Categories')
                .replace(/(package|article\.getPackage\(\))\.getExtra\(\)\[\'([\S]*)\'\]/gi, '$2')
                .replace(new RegExp('==', 'gmu'), 'is')
                .replace(new RegExp('\s(matches|in)\s', 'gmu'), ' is ')
                .replace(new RegExp('\/', 'gmu'), '')
                .replace(new RegExp('\"', 'gmu'), '')
                .replace(new RegExp('!=', 'gmu'), 'not');

            return readable.split(' and ');
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#addRuleDestination
         * @param {Object} destination - destination object
         * @description Adds destination for new rule
         */
        addRuleDestination(destination) {
            if (destination) {
                $scope.newRule.destinations.push(destination);
            }else{
                $scope.newRule.destinations.push({});
            }
            this.ruleForm.$setDirty();
        }

         /**
         * @ngdoc method
         * @name WebPublisherSettingsController#removeRuleDestination
         * @param {Number} index - index of the item to remove
         * @description Deleting rule destination
         */
        removeRuleDestination(index) {
            $scope.newRule.destinations.splice(index, 1);
            this.ruleForm.$setDirty();
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#addRuleExpression
         * @description Adds expression for new rule
         */
        addRuleExpression() {
            $scope.newRule.expressions.push({});
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#removeRuleExpression
         * @param {Number} index - index of the item to remove
         * @description Deleting rule expression
         */
        removeRuleExpression(index) {
            $scope.newRule.expressions.splice(index, 1);
        }

         /**
         * @ngdoc method
         * @name WebPublisherSettingsController#togglePreviewRule
         * @param {Object} rule - rule which is previewed
         * @description Toggles preview pane for selected rule
         */
        togglePreviewRule(rule, code) {
            if (rule) {
                this.selectedRule = rule;
                this.selectedRule.tenantCode = code;
                this.rulePreviewOpen = true;
            } else {
                this.selectedRule = {};
                this.rulePreviewOpen = false;
            }
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#deleteRule
         * @param {Number} ruleId - id of rule
         * @param {String} tenantCode - tenant code
         * @description Deletes rule
         */
        deleteRule(ruleId, tenantCode) {
            event.stopPropagation();
            modal.confirm(gettext('Please confirm you want to delete rule.'))
                .then(() => {
                    if (tenantCode) {
                        let tenant = this.sites.find(function(site) {
                            return site.code == tenantCode;
                        });

                        publisher.setTenant(tenant);
                        publisher.removeTenantRule(ruleId).then(() => {
                            this._refreshRules();
                        });
                    } else {
                        publisher.removeOrganizationRule(ruleId).then(() => {
                            this._refreshRules();
                        });
                    }
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#editRule
         * @param {Object} rule - rule
         * @param {Object} tenantCode - tenant code
         * @description Edit rule
         */
        editRule(rule, tenantCode) {
            this.selectedRule = angular.copy(rule);
            $scope.newRule = angular.copy(rule)
            $scope.newRule.type = $scope.newRule.configuration.destinations ? 'organization' : 'tenant';
            $scope.newRule.action = {};

            if (tenantCode && $scope.newRule.type === 'tenant') {
                // tenant rule
                $scope.newRule.action.tenant = this.sites.find(function(site) {
                    return site.code == tenantCode;
                });
                if ($scope.newRule.configuration.route) {
                    $scope.newRule.action.route = parseInt($scope.newRule.configuration.route);
                }
                $scope.newRule.action.published = $scope.newRule.configuration.published ? true : false;
                $scope.newRule.action.fbia = $scope.newRule.configuration.fbia ? true : false;
                $scope.newRule.action.paywallSecured = $scope.newRule.configuration.paywallSecured ? true : false;
            } else {
                 // organization rule
                 $scope.newRule.destinations = [];

                _.each($scope.newRule.configuration.destinations, destination => {
                    let tenant = this.sites.find(function(site) {
                        return site.code == destination.tenant;
                    });
                    $scope.newRule.destinations.push(tenant);
                });
            }
            this.rulePaneOpen = true;
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#buildRule
         * @returns {Object}
         * @description Building rule from selected parameters
         */
        buildRule() {
            let newRule = {
                name: $scope.newRule.name,
                description: $scope.newRule.description,
                priority: '1',
                expression: '',
                configuration: []
            };

            if ($scope.newRule.type == 'organization') {
                newRule.configuration.push(
                    {
                        key: 'destinations',
                        value: []
                    }
                );

                _.each($scope.newRule.destinations, destination => {
                    let configuration = {
                        tenant: destination.code
                    };

                    newRule.configuration[0].value.push(configuration);
                });
            } else {
                // tenant rule
                publisher.setTenant($scope.newRule.action.tenant);

                if ($scope.newRule.action.route) {
                    newRule.configuration.push({key: 'route', value: $scope.newRule.action.route});
                }
                if ($scope.newRule.action.published ) {
                    newRule.configuration.push({key: 'published', value: true});
                }

                if ($scope.newRule.action.fbia ) {
                    newRule.configuration.push({key: 'fbia', value: true});
                }

                if ($scope.newRule.action.paywallSecured ) {
                    newRule.configuration.push({key: 'paywallSecured', value: true});
                }
            }
            if ($scope.newRule.catchAll) {
                newRule.expression = 'true == true';
            } else {
                _.each($scope.newRule.expressions, (expression, index) => {
                    if (index > 0) {
                        newRule.expression += ' and ';
                    }

                    if (expression.option.type === 'number') {
                        newRule.expression += expression.option.value + ' ' + expression.operator + ' ' + expression.value;
                    } else if (expression.option.type === 'in') {
                        newRule.expression += '"' + expression.value + '" ' + expression.operator + ' ' + expression.option.value;
                    } else {
                        newRule.expression += expression.option.value + ' ' + expression.operator + ' "' + expression.value + '"';
                    }
                });
            }
            return _(newRule).omitBy(_.isNil).omitBy(_.isEmpty).value();
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#saveRule
         * @description Saving rule
         */
        saveRule() {
            let newRule = this.buildRule();
            // not necessary at the moment but will be usefull for editing rule in future
            let updatedKeys = this._updatedKeys(newRule, this.selectedRule);

            if ($scope.newRule.type == 'organization') {
                publisher.manageOrganizationRule({rule: _.pick(newRule, updatedKeys)}, this.selectedRule.id)
                    .then((rule) => {
                        this.rulePaneOpen = false;
                        this.selectedRule = {};
                        this._refreshRules();
                    });
            } else {
                publisher.setTenant($scope.newRule.action.tenant);
                publisher.manageTenantRule({rule: _.pick(newRule, updatedKeys)}, this.selectedRule.id)
                    .then((rule) => {
                        this.rulePaneOpen = false;
                        this.selectedRule = {};
                        this._refreshRules();
                    });
            }

        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#toggleInfoCarousel
         * @description Toggles info carousel
         */
        toggleInfoCarousel() {
            this.infoCarouselActive = !this.infoCarouselActive;
        }

        /**
         * @ngdoc filter
         * @name WebPublisherSettingsController#sitesFilter
         * @param {Object} site - site from ng-repeat
         * @returns {Boolean}
         * @description Filters already selected sites
         */

        sitesFilter(site) {
            return $scope.newRule.destinations.find(destination => destination.code === site.code) ? false : true;
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#isObjEmpty
         * @param {Object} value
         * @returns {Boolean}
         * @description Checks if object is empty
         */
        isObjEmpty(value) {
            return angular.equals({}, value);
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_loadThemes
         * @private
         * @description Loads list of all themes
         */

        _loadThemes() {
            $scope.loading = true;
            return publisher.getOrganizationThemes().then((response) => {
                $scope.loading = false;
                $scope.organizationThemes = response._embedded._items;
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_refreshSites
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
         * @name WebPublisherSettingsController#_refreshThemeSettings
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

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_refreshRules
         * @description Loads Organization and Tenant Rules
         */
        _refreshRules() {
            $scope.loading = true;
            this._loadOrganizationRules()
                .then(() => {
                    this._loadTenantsRules();
                    $scope.loading = false;
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_loadOrganizationRules
         * @description Loads Organization Rules
         */
        _loadOrganizationRules() {
            return publisher.queryOrganizationRules({limit: 99999})
                .then((rules) => {
                    this.organizationRules = rules;
                    return rules;
                });
        }

         /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_loadTenantsRules
         * @description Loads Tenants Rules
         */
        _loadTenantsRules() {
            this.tenantsRules = {};
            // tenants configured with organization rules
            this.availableTenants = [];
            _.each(this.organizationRules, rule => {
                _.each(rule.configuration.destinations, dest => {
                    let tenant = this.sites.find(function(site) {
                        return site.code == dest.tenant;
                      });

                    if (tenant) {
                        publisher.setTenant(tenant);
                        this.availableTenants.push(tenant);
                        this._loadTenantRules().then((rules) => {
                            this.tenantsRules[tenant.code] = rules;
                        });
                    }
                });
            });
        }



         /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_loadTenantRules
         * @description Loads Tenant Rules
         */
        _loadTenantRules() {
            return publisher.queryTenantRules({limit: 99999})
                .then((rules) => {
                    return rules;
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_prepareExpressionBuilder
         * @description Prepares expression builder config
         */
        _prepareExpressionBuilder() {
            let customRuleFunctionName = 'package.getExtra()';

            this.expressionBuilder = {
                operators: {
                    string: [
                        {name: '=', value: '=='},
                        {name: '!=', value: '!='}
                    ],
                    number: [
                        {name: '=', value: '=='},
                        {name: '!=', value: '!='},
                        {name: '<', value: '<'},
                        {name: '>', value: '>'},
                        {name: '<=', value: '<='},
                        {name: '>=', value: '>='}
                    ],
                    in: [
                        {name: '=', value: 'in'},
                    ],
                    custom: [
                        {name: '=', value: '=='},
                        {name: '!=', value: '!='}
                    ]
                }
            };

            if($scope.newRule.type == 'organization') {
                this.expressionBuilder.options = [
                    {name: 'Language', value: 'package.getLanguage()', type: 'string'},
                    {name: 'Category', value: 'package.getServicesNames()', type: 'in'},
                    {name: 'Author', value: 'package.getAuthorsNames()', type: 'in'},
                    {name: 'Ingest Source', value: 'package.getSource()', type: 'string'},
                    {name: 'Priority', value: 'package.getPriority()', type: 'number'},
                    {name: 'Urgency', value: 'package.getUrgency()', type: 'number'},
                ];
            } else {
                // article
                customRuleFunctionName = 'article.getPackage().getExtra()';

                this.expressionBuilder.options = [
                    {name: 'Language', value: 'article.getLocale()', type: 'string'},
                    {name: 'Category', value: 'article.getPackage().getServicesNames()', type: 'in'},
                    {name: 'Author', value: 'article.getAuthorsNames()', type: 'in'},
                    {name: 'Ingest Source', value: 'article.getPackage().getSource()', type: 'string'},
                    {name: 'Priority', value: 'article.getPackage().getPriority()', type: 'number'},
                    {name: 'Urgency', value: 'article.getPackage().getUrgency()', type: 'number'}
                ];
            }

            vocabularies.getAllActiveVocabularies().then((result) => {
                result.forEach((vocabulary) => {
                    if (vocabulary._id === 'categories') {
                        this.expressionBuilder.categories = vocabulary.items;
                    }
                    if (vocabulary.field_type === 'text') {
                        this.expressionBuilder.options.push({
                            name:  vocabulary.display_name,
                            value: customRuleFunctionName + '[\'' + vocabulary.display_name + '\']',
                            type: 'custom'
                        });
                    }
                });
            });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#_updatedKeys
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

    return new WebPublisherSettings();
}
