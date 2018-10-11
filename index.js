import 'ng-infinite-scroll';
import 'ng-file-upload';
import './client/styles/_publisher.scss';

import 'angular-drag-and-drop-lists/angular-drag-and-drop-lists';

import * as controllers from './client/controllers';
import * as services from './client/services';
import * as directive from './client/directives';

import {TargetedPublishing} from './client/extensions';

cacheIncludedTemplates.$inject = ['$templateCache'];
function cacheIncludedTemplates($templateCache) {
    $templateCache.put('sidebar-content.html', require('./client/views/sidebar-content.html'));

    $templateCache.put('filter-pane.html', require('./client/views/output/filter-pane.html'));
    $templateCache.put('publishing-pane.html', require('./client/views/output/publishing-pane.html'));
    $templateCache.put('publish-pane-listitem.html', require('./client/views/output/publish-pane-listitem.html'));
    $templateCache.put('preview-pane.html', require('./client/views/output/preview-pane.html'));
    $templateCache.put('article-preview.html', require('./client/views/output/article-preview.html'));

    $templateCache.put('articles-detail.html', require('./client/directives/articles/articles-detail.html'));
    $templateCache.put('list-articles-card.html', require('./client/directives/listArticles/list-articles-card.html'));
    $templateCache.put('list-articles-detail.html', require('./client/directives/listArticles/list-articles-detail.html'));

    $templateCache.put('content-list-automatic.html', require('./client/views/content-lists/content-list-automatic.html'));
    $templateCache.put('content-list-manual.html', require('./client/views/content-lists/content-list-manual.html'));
    $templateCache.put('content-lists-list.html', require('./client/views/content-lists/content-lists-list.html'));
    $templateCache.put('content-bucket.html', require('./client/views/content-lists/content-bucket.html'));
    $templateCache.put('list-box.html', require('./client/views/content-lists/list-box.html'));

    $templateCache.put('general.html', require('./client/views/dashboard/manage-site/general.html'));
    $templateCache.put('routes.html', require('./client/views/dashboard/manage-site/routes.html'));
    $templateCache.put('routes-tree.html', require('./client/views/dashboard/manage-site/routes-tree.html'));
    $templateCache.put('navigation.html', require('./client/views/dashboard/manage-site/navigation.html'));
    $templateCache.put('navigation-menu-tree.html', require('./client/views/dashboard/manage-site/navigation-menu-tree.html'));
    $templateCache.put('navigation-tree-renderer.html', require('./client/views/dashboard/manage-site/navigation-tree-renderer.html'));
    $templateCache.put('theme-settings.html', require('./client/views/dashboard/manage-site/theme-settings.html'));

    $templateCache.put('themeManager-details.html', require('./client/directives/themeManager/themeManager-details.html'));
    $templateCache.put('manage-site.html', require('./client/views/dashboard/manage-site/manage-site.html'));

    $templateCache.put('tenant.html', require('./client/views/dashboard/tenant.html'));
    $templateCache.put('info-carousel.html', require('./client/views/dashboard/info-carousel/info-carousel.html'));

    $templateCache.put('settings/rules.html', require('./client/views/settings/rules.html'));
    $templateCache.put('settings/rule-item.html', require('./client/views/settings/rule-item.html'));
    $templateCache.put('settings/rule-preview.html', require('./client/views/settings/rule-preview.html'));
    $templateCache.put('settings/rule-add.html', require('./client/views/settings/rule-add.html'));
    $templateCache.put('settings/rule-add-organization.html', require('./client/views/settings/rule-add-organization.html'));
    $templateCache.put('settings/rule-add-tenant.html', require('./client/views/settings/rule-add-tenant.html'));
}

/**
 * @ngdoc module
 * @module superdesk.apps.web_publisher
 * @name superdesk.apps.web_publisher
 * @packageName superdesk.apps
 * @description Superdesk web publisher module.
 */
export default angular.module('superdesk-publisher', [
    'dndLists',
    'infinite-scroll',
    'ngFileUpload'
])

.directive('sdSiteRoutes', directive.SiteRoutesDirective)
.directive('sdPublishRoutes', directive.PublishRoutesDirective)
.directive('sdListArticles', directive.ListArticlesDirective)
.directive('sdListContentLists', directive.ListContentListsDirective)
.directive('sdCardInputFocus', directive.CardInputFocusDirective)
.directive('sdGroupArticle', directive.GroupArticleDirective)
.directive('sdArticles', directive.ArticlesDirective)
.directive('sdSiteWizard', directive.SiteWizardDirective)
.directive('sdThemeManager', directive.ThemeManagerDirective)
.factory('publisher', services.PublisherFactory)
.factory('pubapi', services.PubAPIFactory)

.run(['extensionPoints', 'session', 'config', '$templateCache', (extensionPoints, session, config,  $templateCache) => {
        cacheIncludedTemplates($templateCache);
        extensionPoints.register('authoring:publish', TargetedPublishing, {session: session, config: config}, ['item']);
    }])

.config(['superdeskProvider', function(superdesk) {
    superdesk
        .activity('/publisher/dashboard', {
            label: gettext('Publisher'),
            description: gettext('Publisher'),
            category: superdesk.MENU_MAIN,
            adminTools: false,
            controller: controllers.WebPublisherDashboardController,
            controllerAs: 'webPublisher',
            template: require('./client/views/dashboard/index.html'),
            sideTemplateUrl: 'scripts/apps/workspace/views/workspace-sidenav.html',
        })
        .activity('/publisher/output-control', {
            label: gettext('Publisher'),
            description: gettext('Publisher'),
            controller: controllers.WebPublisherOutputController,
            controllerAs: 'webPublisherOutput',
            template: require('./client/views/output/index.html'),
            sideTemplateUrl: 'scripts/apps/workspace/views/workspace-sidenav.html',
        })
        .activity('/publisher/content_lists', {
            label: gettext('Publisher'),
            description: gettext('Publisher'),
            controller: controllers.WebPublisherContentListsController,
            controllerAs: 'webPublisherContentLists',
            template: require('./client/views/content-lists/index.html'),
            sideTemplateUrl: 'scripts/apps/workspace/views/workspace-sidenav.html',
        })
        .activity('/publisher/content_lists/:_tenant', {
            label: gettext('Publisher'),
            description: gettext('Publisher'),
            controller: controllers.WebPublisherContentListsController,
            controllerAs: 'webPublisherContentLists',
            template: require('./client/views/content-lists/index.html'),
            sideTemplateUrl: 'scripts/apps/workspace/views/workspace-sidenav.html',
        })
        .activity('/publisher/content_lists/:_tenant/:_list', {
            label: gettext('Publisher'),
            description: gettext('Publisher'),
            controller: controllers.WebPublisherContentListsController,
            controllerAs: 'webPublisherContentLists',
            template: require('./client/views/content-lists/index.html'),
            sideTemplateUrl: 'scripts/apps/workspace/views/workspace-sidenav.html',
        })
        .activity('/publisher/settings', {
            label: gettext('Settings'),
            description: gettext('Settings'),
            controller: controllers.WebPublisherSettingsController,
            controllerAs: 'webPublisherSettings',
            template: require('./client/views/settings/index.html'),
            sideTemplateUrl: 'scripts/apps/workspace/views/workspace-sidenav.html',
        });
}]);
