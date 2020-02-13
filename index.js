import "ng-infinite-scroll";
import "ng-file-upload";
import "./client/styles/_publisher.scss";
import "angular-in-viewport";
import "angular-drag-and-drop-lists-spiria/angular-drag-and-drop-lists";

import * as controllers from "./client/controllers";
import * as services from "./client/services";
import * as directive from "./client/directives";

import Publishing from "./client/extensions/Publishing";

cacheIncludedTemplates.$inject = ["$templateCache"];
function cacheIncludedTemplates($templateCache) {
  $templateCache.put(
    "tenant.html",
    require("./client/views/dashboard/tenant.html")
  );
  $templateCache.put(
    "sidebar-content.html",
    require("./client/views/sidebar-content.html")
  );
  $templateCache.put(
    "themeManager-details.html",
    require("./client/directives/themeManager/themeManager-details.html")
  );
  $templateCache.put(
    "settings/rules/index.html",
    require("./client/views/settings/rules/index.html")
  );
  $templateCache.put(
    "settings/rules/rule-item.html",
    require("./client/views/settings/rules/rule-item.html")
  );
  $templateCache.put(
    "settings/rules/rule-preview.html",
    require("./client/views/settings/rules/rule-preview.html")
  );
  $templateCache.put(
    "settings/rules/rule-add.html",
    require("./client/views/settings/rules/rule-add.html")
  );
  $templateCache.put(
    "settings/rules/rule-add-organization.html",
    require("./client/views/settings/rules/rule-add-organization.html")
  );
  $templateCache.put(
    "settings/rules/rule-add-tenant.html",
    require("./client/views/settings/rules/rule-add-tenant.html")
  );

  $templateCache.put(
    "settings/website-management/manage.html",
    require("./client/views/settings/website-management/manage.html")
  );
  $templateCache.put(
    "settings/website-management/manage-nav.html",
    require("./client/views/settings/website-management/manage-nav.html")
  );
  $templateCache.put(
    "settings/website-management/tenant-list.html",
    require("./client/views/settings/website-management/tenant-list.html")
  );
  $templateCache.put(
    "settings/website-management/info-carousel/info-carousel.html",
    require("./client/views/settings/website-management/info-carousel/info-carousel.html")
  );
  $templateCache.put(
    "settings/website-management/partials/tenant.html",
    require("./client/views/settings/website-management/partials/tenant.html")
  );
  $templateCache.put(
    "settings/website-management/manage-general.html",
    require("./client/views/settings/website-management/manage-general.html")
  );
  $templateCache.put(
    "settings/website-management/manage-routes.html",
    require("./client/views/settings/website-management/manage-routes.html")
  );
  $templateCache.put(
    "settings/website-management/partials/routes-tree.html",
    require("./client/views/settings/website-management/partials/routes-tree.html")
  );
  $templateCache.put(
    "settings/website-management/manage-navigation.html",
    require("./client/views/settings/website-management/manage-navigation.html")
  );
  $templateCache.put(
    "settings/website-management/manage-navigation-menu.html",
    require("./client/views/settings/website-management/manage-navigation-menu.html")
  );
  $templateCache.put(
    "settings/website-management/partials/navigation-tree-renderer.html",
    require("./client/views/settings/website-management/partials/navigation-tree-renderer.html")
  );
  $templateCache.put(
    "settings/website-management/manage-theme-settings.html",
    require("./client/views/settings/website-management/manage-theme-settings.html")
  );

  $templateCache.put(
    "settings/website-management/webhooks/index.html",
    require("./client/views/settings/website-management/webhooks/index.html")
  );
  $templateCache.put(
    "settings/website-management/webhooks/webhook-item.html",
    require("./client/views/settings/website-management/webhooks/webhook-item.html")
  );
  $templateCache.put(
    "settings/website-management/webhooks/webhook-add.html",
    require("./client/views/settings/website-management/webhooks/webhook-add.html")
  );

  $templateCache.put(
    "settings/website-management/route-form.html",
    require("./client/views/settings/website-management/route-form.html")
  );
  $templateCache.put(
    "settings/website-management/redirects/form.html",
    require("./client/views/settings/website-management/redirects/form.html")
  );
  $templateCache.put(
    "settings/website-management/redirects/index.html",
    require("./client/views/settings/website-management/redirects/index.html")
  );

  $templateCache.put(
    "settings/website-management/redirects/item.html",
    require("./client/views/settings/website-management/redirects/item.html")
  );
}



/**
 * @ngdoc module
 * @module superdesk.apps.web_publisher
 * @name superdesk.apps.web_publisher
 * @packageName superdesk.apps
 * @description Superdesk web publisher module.
 */
export default angular
  .module("superdesk-publisher", [
    "dndLists",
    "infinite-scroll",
    "ngFileUpload",
    "in-viewport"
  ])
  .directive("sdSiteWizard", directive.SiteWizardDirective)
  .directive("sdThemeManager", directive.ThemeManagerDirective)
  .directive("sdListContentLists", directive.ListContentListsDirective)
  .factory("publisher", services.PublisherFactory)
  .factory("pubapi", services.PubAPIFactory)
  .config([
    "superdeskProvider",
    "workspaceMenuProvider",
    function (superdesk, workspaceMenuProvider) {
      superdesk
        .activity("/publisher", {
          // privileges: { publisher_dashboard: 1 },
          label: gettext("Publisher"),
          description: gettext("Publisher"),
          controller: controllers.WebPublisherDashboardController,
          controllerAs: "webPublisher",
          template: require("./client/views/dashboard/index.html"),
          sideTemplateUrl: "scripts/apps/workspace/views/workspace-sidenav.html"
        })
        .activity("/publisher/output-control", {
          label: gettext("Publisher"),
          description: gettext("Publisher"),
          controller: controllers.WebPublisherOutputController,
          controllerAs: "webPublisherOutput",
          template: require("./client/views/output/index.html"),
          sideTemplateUrl: "scripts/apps/workspace/views/workspace-sidenav.html"
        })
        .activity("/publisher/content_lists", {
          label: gettext("Publisher"),
          description: gettext("Publisher"),
          controller: controllers.WebPublisherContentListsController,
          controllerAs: "webPublisherContentLists",
          template: require("./client/views/content-lists/index.html"),
          sideTemplateUrl: "scripts/apps/workspace/views/workspace-sidenav.html"
        })
        .activity("/publisher/content_lists/:_tenant", {
          label: gettext("Publisher"),
          description: gettext("Publisher"),
          controller: controllers.WebPublisherContentListsController,
          controllerAs: "webPublisherContentLists",
          template: require("./client/views/content-lists/index.html"),
          sideTemplateUrl: "scripts/apps/workspace/views/workspace-sidenav.html"
        })
        .activity("/publisher/content_lists/:_tenant/:_list", {
          label: gettext("Publisher"),
          description: gettext("Publisher"),
          controller: controllers.WebPublisherContentListsController,
          controllerAs: "webPublisherContentLists",
          template: require("./client/views/content-lists/index.html"),
          sideTemplateUrl: "scripts/apps/workspace/views/workspace-sidenav.html"
        })
        .activity("/publisher/analytics", {
          label: gettext("Publisher"),
          description: gettext("Publisher"),
          controllerAs: "webPublisherAnalytics",
          controller: controllers.WebPublisherAnalyticsController,
          template: require("./client/views/analytics/index.html"),
          sideTemplateUrl: "scripts/apps/workspace/views/workspace-sidenav.html"
        })
        .activity("/publisher/analytics/:_tenant", {
          label: gettext("Publisher"),
          description: gettext("Publisher"),
          controllerAs: "webPublisherAnalytics",
          controller: controllers.WebPublisherAnalyticsController,
          template: require("./client/views/analytics/index.html"),
          sideTemplateUrl: "scripts/apps/workspace/views/workspace-sidenav.html"
        })
        .activity("/publisher/settings", {
          label: gettext("Publisher Settings"),
          category: superdesk.MENU_MAIN,
          adminTools: true,
          description: gettext("Settings"),
          controller: controllers.WebPublisherSettingsController,
          controllerAs: "webPublisherSettings",
          template: require("./client/views/settings/index.html")
        });

      workspaceMenuProvider.item({
        // if: 'privileges.publisher_dashboard',
        href: "/publisher",
        label: gettext("Publisher"),
        icon: "publisher",
        shortcut: "alt+w",
        order: 1100,
        group: "Planning"
      });
    }
  ])

  .run([
    "extensionPoints",
    "session",
    "config",
    "$templateCache",
    "urls",
    "api",
    (extensionPoints, session, config, $templateCache, urls, api) => {
      cacheIncludedTemplates($templateCache);
      extensionPoints.register(
        "authoring:publish",
        Publishing,
        { session: session, config: config, urls: urls, api: api },
        ["item"]
      );
    }
  ]);
