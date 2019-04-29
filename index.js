import 'ng-infinite-scroll';
import 'ng-file-upload';
import './client/styles/_publisher.scss';
import 'angular-in-viewport';
import 'angular-drag-and-drop-lists-spiria/angular-drag-and-drop-lists';

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
    $templateCache.put('output/swimlane.html', require('./client/views/output/swimlane.html'));

    $templateCache.put('list-articles-card.html', require('./client/directives/listArticles/list-articles-card.html'));
    $templateCache.put('list-articles-detail.html', require('./client/directives/listArticles/list-articles-detail.html'));

    $templateCache.put('content-list-automatic.html', require('./client/views/content-lists/content-list-automatic.html'));
    $templateCache.put('content-list-manual.html', require('./client/views/content-lists/content-list-manual.html'));
    $templateCache.put('content-lists-list.html', require('./client/views/content-lists/content-lists-list.html'));
    $templateCache.put('list-box.html', require('./client/views/content-lists/list-box.html'));
    $templateCache.put('content-lists/preview-pane.html', require('./client/views/content-lists/preview-pane.html'));

    $templateCache.put('themeManager-details.html', require('./client/directives/themeManager/themeManager-details.html'));
    $templateCache.put('tenant.html', require('./client/views/dashboard/tenant.html'));

    $templateCache.put('settings/rules/index.html', require('./client/views/settings/rules/index.html'));
    $templateCache.put('settings/rules/rule-item.html', require('./client/views/settings/rules/rule-item.html'));
    $templateCache.put('settings/rules/rule-preview.html', require('./client/views/settings/rules/rule-preview.html'));
    $templateCache.put('settings/rules/rule-add.html', require('./client/views/settings/rules/rule-add.html'));
    $templateCache.put('settings/rules/rule-add-organization.html', require('./client/views/settings/rules/rule-add-organization.html'));
    $templateCache.put('settings/rules/rule-add-tenant.html', require('./client/views/settings/rules/rule-add-tenant.html'));

    $templateCache.put('settings/website-management/manage.html', require('./client/views/settings/website-management/manage.html'));
    $templateCache.put('settings/website-management/manage-nav.html', require('./client/views/settings/website-management/manage-nav.html'));
    $templateCache.put('settings/website-management/tenant-list.html', require('./client/views/settings/website-management/tenant-list.html'));
    $templateCache.put('settings/website-management/info-carousel/info-carousel.html', require('./client/views/settings/website-management/info-carousel/info-carousel.html'));
    $templateCache.put('settings/website-management/partials/tenant.html', require('./client/views/settings/website-management/partials/tenant.html'));
    $templateCache.put('settings/website-management/manage-general.html', require('./client/views/settings/website-management/manage-general.html'));
    $templateCache.put('settings/website-management/manage-routes.html', require('./client/views/settings/website-management/manage-routes.html'));
    $templateCache.put('settings/website-management/partials/routes-tree.html', require('./client/views/settings/website-management/partials/routes-tree.html'));
    $templateCache.put('settings/website-management/manage-navigation.html', require('./client/views/settings/website-management/manage-navigation.html'));
    $templateCache.put('settings/website-management/manage-navigation-menu.html', require('./client/views/settings/website-management/manage-navigation-menu.html'));
    $templateCache.put('settings/website-management/partials/navigation-tree-renderer.html', require('./client/views/settings/website-management/partials/navigation-tree-renderer.html'));
    $templateCache.put('settings/website-management/manage-theme-settings.html', require('./client/views/settings/website-management/manage-theme-settings.html'));

    $templateCache.put('settings/website-management/webhooks/index.html', require('./client/views/settings/website-management/webhooks/index.html'));
    $templateCache.put('settings/website-management/webhooks/webhook-item.html', require('./client/views/settings/website-management/webhooks/webhook-item.html'));
    $templateCache.put('settings/website-management/webhooks/webhook-add.html', require('./client/views/settings/website-management/webhooks/webhook-add.html'));

    $templateCache.put('analytics/filter-pane.html', require('./client/views/analytics/filter-pane.html'));
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
    'ngFileUpload',
    'in-viewport'
])

.directive('sdPublishRoutes', directive.PublishRoutesDirective)
.directive('sdListArticles', directive.ListArticlesDirective)
.directive('sdListContentLists', directive.ListContentListsDirective)
.directive('sdCardInputFocus', directive.CardInputFocusDirective)
.directive('sdGroupArticle', directive.GroupArticleDirective)
.directive('sdArticles', directive.ArticlesDirective)
.directive('sdSiteWizard', directive.SiteWizardDirective)
.directive('sdThemeManager', directive.ThemeManagerDirective)
.directive('sdGallery', directive.GalleryDirective)
.factory('publisher', services.PublisherFactory)
.factory('pubapi', services.PubAPIFactory)
.factory('publisherHelpers', services.PublisherHelpersFactory)

.run(['extensionPoints', 'session', 'config', '$templateCache', 'urls', 'api', (extensionPoints, session, config, $templateCache, urls, api) => {
        cacheIncludedTemplates($templateCache);
        extensionPoints.register('authoring:publish', TargetedPublishing, {session: session, config: config, urls: urls, api: api}, ['item']);
    }])

.config(['superdeskProvider', 'workspaceMenuProvider', function(superdesk, workspaceMenuProvider) {
    superdesk
        .activity('/publisher/dashboard', {
            label: gettext('Publisher'),
            description: gettext('Publisher'),
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
        .activity('/publisher/analytics', {
            label: gettext('Publisher'),
            description: gettext('Publisher'),
            controller: controllers.WebPublisherAnalyticsController,
            controllerAs: 'webPublisherAnalytics',
            template: require('./client/views/analytics/index.html'),
            sideTemplateUrl: 'scripts/apps/workspace/views/workspace-sidenav.html',
        })
        .activity('/publisher/analytics/:_tenant', {
            label: gettext('Publisher'),
            description: gettext('Publisher'),
            controller: controllers.WebPublisherAnalyticsController,
            controllerAs: 'webPublisherAnalytics',
            template: require('./client/views/analytics/index.html'),
            sideTemplateUrl: 'scripts/apps/workspace/views/workspace-sidenav.html',
        })
        .activity('/publisher/settings', {
            label: gettext('Publisher Settings'),
            category: superdesk.MENU_MAIN,
            adminTools: true,
            description: gettext('Settings'),
            controller: controllers.WebPublisherSettingsController,
            controllerAs: 'webPublisherSettings',
            template: require('./client/views/settings/index.html')
        });

        workspaceMenuProvider.item({
            href: '/publisher/dashboard',
            label: gettext('Publisher'),
            icon: 'publisher',
            order: 1100,
            group: 'Planning'
        });
}]);
