/**
 * @ngdoc directive
 * @module superdesk.apps.web_publisher
 * @name sdSiteWizard
 * @requires publisher
 * @description Directive to handle creating tenants in publisher manager
 */
SiteWizardDirective.$inject = ['publisher', 'WizardHandler'];
export function SiteWizardDirective(publisher, WizardHandler) {
    class SiteWizardDirective {
        constructor() {
            this.scope = {active: '=active', managerController: '=managerController', outputChannelType: '=outputChannelType'};
            this.template = require('./wizard.html');
        }

        link(scope) {
            /**
             * @ngdoc method
             * @name sdWizard#toggleWizard
             * @description Toggles site creation wizard
             */
            scope.toggleWizard = () => {
                scope.wizard = {
                    busy: false,
                    errorMessage: null,
                    site: null,
                    ready: false
                };
                scope.newSite = {};

                if (scope.outputChannelType) {
                    scope.newSite.outputChannel = {
                        type: scope.outputChannelType.toLowerCase(),
                        config: {
                            url: '',
                            authorization_key: ''
                        }
                    };
                }
            };

            scope.$watch('active', (o, n) => {
                    scope.toggleWizard();
                }, true);

            /**
             * @ngdoc method
             * @name sdWizard#themeActivatedCallback
             * @description Fires when theme got activated in theme manager directive
             */
            scope.themeActivatedCallback = () => {
                scope.wizard.ready = true;
            };

            /**
             * @ngdoc method
             * @name sdWizard#saveSite
             * @description Saves new tenant and continues to theme install step in site wizard
             */
            scope.saveSite = () => {
                scope.wizard.busy = true;
                publisher.manageSite({tenant: scope.newSite})
                    .then((site) => {
                        scope.wizard.errorMessage = false;
                        scope.wizard.site = site;
                        publisher.setTenant(site);
                        // by doing this we check if tenant responds to requests
                        scope.managerController._refreshSites().then(() => {
                            scope.wizard.busy = false;
                            if (scope.wizard.site.outputChannel) {
                                scope.managerController.toggleSiteWizard();
                            } else {
                                WizardHandler.wizard('siteWizard').next();
                            }
                        })
                        .catch((error) => {
                            publisher.setTenant();
                            publisher.removeSite(scope.wizard.site.code);
                            scope.wizard.busy = false;
                            scope.wizard.errorMessage = 'You either misspelled domain name or there is no publisher instance under this address';
                        });
                    })
                    .catch((error) => {
                        scope.wizard.busy = false;
                        if (error.status === 409) {
                            scope.wizard.errorMessage = 'Site already exists';
                        } else {
                            scope.wizard.errorMessage = 'Error. Try again later.';
                        }
                    });
            };

            /**
             * @ngdoc method
             * @name sdWizard#configureSite
             * @description Clears site wizard data and redirects user to site configuration
             */
            scope.configureSite = () => {
                let site = scope.wizard.site;
                scope.managerController.toggleSiteWizard();
                scope.managerController.editSite(site);
            }
        }
    }

    return new SiteWizardDirective();
}



