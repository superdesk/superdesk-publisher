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
            this.scope = {active: '=active', managerController: '=managerController'};
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
                    step: 'details',
                    errorMessage: null,
                    themeDetailsActive: false,
                    site: null,
                    theme: null,
                    ready: false
                };
                scope.newSite = {};
            };

            scope.$watch('active', (o, n) => {
                    scope.toggleWizard();
                }, true);

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
                        scope.managerController._refreshSites()
                            .catch((error) => {
                                publisher.setTenant();
                                publisher.removeSite(scope.wizard.site.code);
                                scope.wizard.busy = false;
                                scope.wizard.errorMessage = 'You either misspelled domain name or there is no publisher instance under this address';
                            });
                        publisher.getOrganizationThemes().then((response) => {
                            scope.wizard.organizationThemes = response._embedded._items;
                            angular.forEach(scope.wizard.organizationThemes, (theme) => {
                                let previewSetting = theme.config.filter((setting) => setting.preview_url);

                                if (previewSetting.length) {
                                    theme.preview_url = previewSetting[0].preview_url;
                                }
                            });
                            scope.wizard.busy = false;
                            WizardHandler.wizard('siteWizard').next();
                        })
                        .catch((err) => {
                            throw new Error(err);
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
             * @name sdWizard#openThemeDetails
             * @param {Object} theme - selected theme
             * @description Opens theme details in site wizard
             */
            scope.openThemeDetails = (theme) => {
                scope.wizard.themeDetailsActive = true;
                scope.wizard.theme = theme;
            }

            /**
             * @ngdoc method
             * @name sdWizard#installTheme
             * @param {Object} theme - selected theme
             * @description Installs selected theme
             */
            scope.installTheme = (theme) => {
                scope.wizard.step = 'installation';
                publisher.setTenant(scope.wizard.site);
                publisher.installTenantTheme({theme_install: {name: theme.name}})
                    .then(() => {
                        scope.wizard.step = 'finish';
                    });
            }

            /**
             * @ngdoc method
             * @name sdWizard#activateTheme
             * @description Activates selected theme
             */
            scope.activateTheme = () => {
                publisher.manageSite({tenant: {themeName: scope.wizard.theme.name}}, scope.wizard.site.code)
                    .then(() => {
                        scope.wizard.themeDetailsActive = false;
                        scope.wizard.ready = true;
                        scope.wizard.theme.active = true;
                    });
            }

            /**
             * @ngdoc method
             * @name sdWizard#uploadTheme
             * @param {Array} files - selected files
             * @description Uploads theme
             */
            scope.uploadTheme = (files) => {
                scope.wizard.uploadError = false;

                if (files && files.length) {
                    let themeFile = files[0];
                    if (!themeFile.$error) {
                        scope.wizard.uploading = true;
                        publisher.uploadOrganizationTheme({'theme_upload[file]': themeFile})
                            .then((response) => {
                                publisher.getOrganizationThemes().then((response) => {
                                    scope.wizard.organizationThemes = response._embedded._items;
                                    angular.forEach(scope.wizard.organizationThemes, (theme) => {
                                        let previewSetting = theme.config.filter((setting) => setting.preview_url);

                                        if (previewSetting.length) {
                                            theme.preview_url = previewSetting[0].preview_url;
                                        }
                                    });
                                    scope.wizard.uploading = false;
                                })
                                .catch((err) => {
                                    throw new Error(err);
                                });
                            })
                            .catch((err) => {
                                scope.wizard.uploadError = true;
                                scope.wizard.uploading = false;
                            });
                    }
                }
            }

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



