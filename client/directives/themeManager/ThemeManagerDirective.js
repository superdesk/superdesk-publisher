/**
 * @ngdoc directive
 * @module superdesk.apps.web_publisher
 * @name sdThemeManager
 * @requires publisher
 * @description Directive to handle themes in publisher manager
 */
ThemeManagerDirective.$inject = ['publisher'];
export function ThemeManagerDirective(publisher) {
    class ThemeManagerDirective {
        constructor() {
            this.scope = {site: '=site', activatedCallback: '&', grid: '@grid'};
            this.template = require('./index.html');
        }

        link(scope) {
            this._loadThemes(scope);
            scope.step = 'details';

            /**
             * @ngdoc method
             * @name sdThemeManager#openThemeDetails
             * @param {Object} theme - selected theme
             * @description Opens theme details
             */
            scope.openThemeDetails = (theme) => {
                scope.themeDetailsActive = true;
                scope.theme = theme;
            }

            /**
             * @ngdoc method
             * @name sdThemeManager#closeThemeDetails
             * @description Closes theme details
             */
            scope.closeThemeDetails = () => {
                scope.themeDetailsActive = false;
            }

            /**
             * @ngdoc method
             * @name sdThemeManager#installTheme
             * @param {Object} theme - selected theme
             * @description Installs selected theme
             */
            scope.installTheme = (theme) => {
                scope.busy = true;
                publisher.setTenant(scope.site);
                publisher.installTenantTheme({theme_install: {name: theme.name, processGeneratedData: theme.processGeneratedData}})
                    .then(() => {
                        scope.busy = false;
                        scope.step = 'finish';
                    })
                    .catch((err) => {
                        scope.busy = false;
                    });
            }

            /**
             * @ngdoc method
             * @name sdThemeManager#activateTheme
             * @description Activates selected theme
             */
            scope.activateTheme = () => {
                scope.busy = true;
                publisher.manageSite({tenant: {themeName: scope.theme.name}}, scope.site.code)
                    .then(() => {
                        scope.themeDetailsActive = false;
                        scope.step = 'details';
                        scope.busy = false;
                        scope.activatedCallback();
                        scope.site.themeName = scope.theme.name;
                    })
                    .catch(err => {
                        scope.busy = false;
                    });
            }

            /**
             * @ngdoc method
             * @name sdThemeManager#uploadTheme
             * @param {Array} files - selected files
             * @description Uploads theme
             */
            scope.uploadTheme = (files) => {
                scope.uploadError = false;

                if (files && files.length) {
                    let themeFile = files[0];
                    if (!themeFile.$error) {
                        scope.uploading = true;
                        publisher.uploadOrganizationTheme({'theme_upload[file]': themeFile})
                            .then((response) => {
                                this._loadThemes(scope).then(() => {
                                    scope.uploading = false;
                                })
                                .catch((err) => {
                                    throw new Error(err);
                                });
                            })
                            .catch((err) => {
                                scope.uploadError = err.data.errors.errors[0] ? err.data.errors.errors[0] : true;
                                scope.uploading = false;
                            });
                    }
                }
            }
        }

        /**
         * @ngdoc method
         * @name sdThemeManager#_loadThemes
         * @private
         * @param {Object} scope
         * @description Loads organization themes
         */
        _loadThemes(scope) {
            scope.busy = true;
            return publisher.getOrganizationThemes().then((response) => {
                scope.busy = false;
                scope.organizationThemes = response._embedded._items;
                angular.forEach(scope.organizationThemes, (theme) => {
                    let previewSetting = theme.config.filter((setting) => setting.preview_url);

                    if (previewSetting.length) {
                        theme.preview_url = previewSetting[0].preview_url;
                    }
                });
            });
        }

    }

    return new ThemeManagerDirective();
}



