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
            this.selectedRule = {};
            $scope.loading = true;
            publisher.setToken()
                .then(publisher.querySites)
                .then((sites) => {
                    this.sites = sites;
                    // loading routes
                    angular.forEach(this.sites, (siteObj, key) => {
                        publisher.setTenant(siteObj);
                        publisher.queryRoutes({type: 'collection'}).then((routes) => {
                            siteObj.routes = routes;
                        });
                    });
                    this._refreshRules();
                });
        }

        /**
         * @ngdoc method
         * @name WebPublisherSettingsController#changeTab
         * @param {String} newTabName - name of the new active tab
         * @description Sets the active tab name to the given value
         */
        changeTab(newTabName) {
            this.activeTab = newTabName;
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
                        this.availableTenants.push(tenant.code);
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
