import 'ng-infinite-scroll';
import 'ng-file-upload';
import './client/styles/web-publisher.scss';

import 'angular-drag-and-drop-lists/angular-drag-and-drop-lists';

import {WebPublisherManagerController} from './client/controllers';
import {WebPublisherMonitoringController} from './client/controllers';
import {WebPublisherSettingsController} from './client/controllers';
import {WebPublisherContentListsController} from './client/controllers';
import * as services from './client/services';
import * as directive from './client/directives';

import {TargetedPublishing} from './client/extensions';

cacheIncludedTemplates.$inject = ['$templateCache'];
function cacheIncludedTemplates($templateCache) {
    $templateCache.put('sidenav-items.html', require('./client/views/sidenav-items.html'));

    $templateCache.put('filter-pane.html', require('./client/views/monitoring/filter-pane.html'));
    $templateCache.put('filter-labels.html', require('./client/views/monitoring/filter-labels.html'));
    $templateCache.put('index-content.html', require('./client/views/monitoring/index-content.html'));
    $templateCache.put('publishing-pane.html', require('./client/views/monitoring/publishing-pane.html'));
    $templateCache.put('publish-pane-listitem.html', require('./client/views/monitoring/publish-pane-listitem.html'));
    $templateCache.put('preview-pane.html', require('./client/views/monitoring/preview-pane.html'));
    $templateCache.put('sections-treeElement.html', require('./client/views/monitoring/sections-treeElement.html'));
    $templateCache.put('list-item.html', require('./client/views/monitoring/list-item.html'));
    $templateCache.put('article-preview.html', require('./client/views/monitoring/article-preview.html'));
    $templateCache.put('sections-treeElement.html', require('./client/views/monitoring/sections-treeElement.html'));

    $templateCache.put('articles-detail.html', require('./client/directives/articles/articles-detail.html'));
    $templateCache.put('list-articles-card.html', require('./client/directives/listArticles/list-articles-card.html'));
    $templateCache.put('list-articles-detail.html', require('./client/directives/listArticles/list-articles-detail.html'));

    $templateCache.put('content-list-automatic.html', require('./client/views/content-lists/content-list-automatic.html'));
    $templateCache.put('content-list-manual.html', require('./client/views/content-lists/content-list-manual.html'));
    $templateCache.put('content-bucket.html', require('./client/views/content-lists/content-bucket.html'));

    $templateCache.put('routes.html', require('./client/views/manager/manage-site/routes.html'));
    $templateCache.put('routes-tree.html', require('./client/views/routes-tree.html'));
    $templateCache.put('navigation.html', require('./client/views/manager/manage-site/navigation.html'));
    $templateCache.put('navigation-menu-tree.html', require('./client/views/manager/manage-site/navigation-menu-tree.html'));
    $templateCache.put('navigation-tree-renderer.html', require('./client/views/manager/manage-site/navigation-tree-renderer.html'));
    $templateCache.put('theme-settings.html', require('./client/views/manager/manage-site/theme-settings.html'));

    $templateCache.put('tenant.html', require('./client/views/manager/tenant.html'));
    $templateCache.put('themeManager-details.html', require('./client/directives/themeManager/themeManager-details.html'));
    $templateCache.put('info-carousel.html', require('./client/views/manager/info-carousel/info-carousel.html'));
    $templateCache.put('manage-site.html', require('./client/views/manager/manage-site/manage-site.html'));

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
        .activity('/web_publisher/monitoring', {
            label: gettext('Publisher'),
            description: gettext('Publisher'),
            priority: 100,
            category: superdesk.MENU_MAIN,
            adminTools: false,
            controller: WebPublisherMonitoringController,
            controllerAs: 'webPublisherMonitoring',
            template: require('./client/views/monitoring/index.html'),
            sideTemplateUrl: 'sidenav-items.html'
        })
        .activity('/web_publisher/manager', {
            label: gettext('Publisher'),
            description: gettext('Publisher'),
            controller: WebPublisherManagerController,
            controllerAs: 'webPublisher',
            template: require('./client/views/manager/index.html'),
            sideTemplateUrl: 'sidenav-items.html'
        })
        .activity('/web_publisher/content_lists', {
            label: gettext('Publisher'),
            description: gettext('Publisher'),
            controller: WebPublisherContentListsController,
            controllerAs: 'webPublisherContentLists',
            template: require('./client/views/content-lists/index.html'),
            sideTemplateUrl: 'sidenav-items.html'
        })
        .activity('/web_publisher/settings', {
            label: gettext('Settings'),
            description: gettext('Settings'),
            controller: WebPublisherSettingsController,
            controllerAs: 'webPublisherSettings',
            template: require('./client/views/settings/index.html'),
            sideTemplateUrl: 'sidenav-items.html'
        });
}]);
