/**
 * @ngdoc service
 * @module superdesk.apps.web_publisher
 * @name publisher
 * @requires pubapi
 * @description Publisher service
 */
PublisherFactory.$inject = ["pubapi"];
export function PublisherFactory(pubapi) {
  class Publisher {
    /**
     * @ngdoc method
     * @name publisher#setToken
     * @returns {Promise}
     * @description Sets token
     */
    setToken() {
      return pubapi.setToken();
    }

    /**
     * @ngdoc method
     * @name publisher#getToken
     * @returns {String}
     * @description Gets token
     */
    getToken() {
      return pubapi._token;
    }

    /**
     * @ngdoc method
     * @name publisher#setTenant
     * @param {String} site
     * @returns {Object}
     * @description Change the tenant we are using the api for
     */
    setTenant(site) {
      pubapi.setTenant(site);
      return this;
    }

    /**
     * @ngdoc method
     * @name publisher#checkIfPublisher
     * @param {String} url
     * @returns {Bolean}
     * @description Checks if there is publisher under given url
     */
    checkIfPublisher(url) {
      return pubapi.checkIfPublisher(url);
    }

    /**
     * @ngdoc method
     * @name publisher#manageSite
     * @param {Object} site - site which is edited
     * @param {String} code - code of site which is edited
     * @returns {Promise}
     * @description Add or edit site
     */
    manageSite(site, code) {
      return pubapi.save("tenants", site, code);
    }

    /**
     * @ngdoc method
     * @name publisher#removeSite
     * @param {String} code - code of site which is deleted
     * @param {Object} params
     * @returns {Promise}
     * @description Delete site
     */
    removeSite(code, params) {
      return pubapi.remove("tenants", code, params);
    }

    /**
     * @ngdoc method
     * @name publisher#querySites
     * @param {Bool} withRoutes - should include routes
     * @param {Bool} withContentLists - should include content lists
     * @returns {Promise}
     * @description List all sites in publisher
     */
    querySites(withRoutes = false, withContentLists = false) {
      let params = {
        limit: 1000,
        "sorting[name]": "asc"
      };

      if (withContentLists) params.withContentLists = true;
      if (withRoutes) params.withRoutes = true;

      return pubapi.query("tenants", params);
    }

    /**
     * @ngdoc method
     * @name publisher#manageRoute
     * @param {Object} route - route which is edited
     * @param {String} id - id of route which is edited
     * @returns {Promise}
     * @description Add or edit route
     */
    manageRoute(route, id) {
      return pubapi.save("content/routes", route, id);
    }

    /**
     * @ngdoc method
     * @name publisher#removeRoute
     * @param {String} id - id of route which is deleted
     * @returns {Promise}
     * @description Delete route
     */
    removeRoute(id) {
      return pubapi.remove("content/routes", id);
    }

    /**
     * @ngdoc method
     * @name publisher#queryRoutes
     * @param {Object} type - which routes to query (collection or content)
     * @returns {Promise}
     * @description List all routes for defined type
     */
    queryRoutes(type) {
      let params = type ? type : {};

      params["sorting[position]"] = "asc";
      params.limit = 1000;
      return pubapi.query("content/routes", params);
    }

    /**
     * @ngdoc method
     * @name publisher#getMenu
     * @param {String} id - id of menu to get
     * @returns {Promise}
     * @description Get a single menu by id
     */
    getMenu(id) {
      return pubapi.get("menus", id);
    }

    /**
     * @ngdoc method
     * @name publisher#manageMenu
     * @param {Object} menu - menu which is edited
     * @param {String} id - id of menu which is edited
     * @returns {Promise}
     * @description Create or update a menu
     */
    manageMenu(menu, id) {
      return pubapi.save("menus", menu, id);
    }

    /**
     * @ngdoc method
     * @name publisher#removeMenu
     * @param {String} id - id of menu which is deleted
     * @returns {Promise}
     * @description Remove a menu in the system.
     */
    removeMenu(id) {
      return pubapi.remove("menus", id);
    }

    /**
     * @ngdoc method
     * @name publisher#reorderMenu
     * @param {Object} menu - menu which is moved
     * @param {String} id - id of menu which is moved
     * @returns {Promise}
     * @description Move menu to different position
     */
    reorderMenu(menu, id) {
      return pubapi.patch("menus/" + id + "/move", menu);
    }

    /**
     * @ngdoc method
     * @name publisher#reorderRoute
     * @param {Object} route - route which is moved
     * @param {String} id - id of route which is moved
     * @returns {Promise}
     * @description Move menu to different position
     */
    reorderRoute(route, id) {
      return pubapi.save("content/routes", route, id);
    }

    /**
     * @ngdoc method
     * @name publisher#queryMenus
     * @returns {Promise}
     * @description List all menus
     */
    queryMenus() {
      return pubapi.query("menus");
    }

    /**
     * @ngdoc method
     * @name publisher#getThemeSettings
     * @returns {Promise}
     * @description List theme settings
     */
    getThemeSettings() {
      return pubapi.get("theme/settings");
    }

    /**
     * @ngdoc method
     * @name publisher#manageList
     * @param {Object} list - list which is edited
     * @param {String} id - id of list which is edited
     * @returns {Promise}
     * @description Create or update a content list
     */
    manageList(list, id) {
      return pubapi.save("content/lists", list, id);
    }

    /**
     * @ngdoc method
     * @name publisher#removeList
     * @param {String} id - id of list which is deleted
     * @returns {Promise}
     * @description Remove a content list
     */
    removeList(id) {
      return pubapi.remove("content/lists", id);
    }

    /**
     * @ngdoc method
     * @name publisher#queryLists
     * @param {Object} params - additional params to query
     * @returns {Promise}
     * @description List all content lists
     */
    queryLists(params) {
      let newParams = { ...params };

      if (!newParams.limit) {
        newParams.limit = 99999;
      }
      return pubapi.query("content/lists", newParams);
    }

    /**
     * @ngdoc method
     * @name publisher#queryListArticles
     * @param {String} id - id of content list
     * @returns {Promise}
     * @description List all articles for selected content list
     */
    queryListArticles(id) {
      return pubapi.query("content/lists/" + id + "/items", { limit: 9999 });
    }

    /**
     * @ngdoc method
     * @name publisher#queryListArticlesWithDetails
     * @param {String} id - id of content list
     * @param {Object} params
     * @returns {Promise}
     * @description List all articles for selected content list
     */
    queryListArticlesWithDetails(id, params) {
      return pubapi.queryWithDetails("content/lists/" + id + "/items", params);
    }

    /**
     * @ngdoc method
     * @name publisher#pinArticle
     * @param {String} listId - id of content list
     * @param {String} articleId - id of article
     * @param {Object} article - article which is edited
     * @returns {Promise}
     * @description Pin article in list of articles
     */
    pinArticle(listId, articleId, article) {
      return pubapi.save(
        "content/lists/" + listId + "/items",
        article,
        articleId
      );
    }

    /**
     * @ngdoc method
     * @name publisher#pinArticle
     * @param {String} listId - id of content list
     * @param {String} articleId - id of article
     * @param {Object} article - article which is edited
     * @returns {Promise}
     * @description Pin article in list of articles
     */
    saveManualList(list, listId) {
      return pubapi.patch("content/lists/" + listId + "/items", list);
    }

    /**
     * @ngdoc method
     * @name publisher#queryTenantArticles
     * @param {String} articleStatus - params passed to API (limit, status, route)
     * @returns {Promise}
     * @description List all articles for selected tenant
     */
    queryTenantArticles(articleStatus) {
      return pubapi.queryWithDetails("content/articles", articleStatus);
    }

    /**
     * @ngdoc method
     * @name publisher#getArticle
     * @param {String} articleId - id of package
     * @returns {Promise}
     * @description gets article
     */
    getArticle(articleId) {
      return pubapi.get("content/articles", articleId);
    }

    /**
     * @ngdoc method
     * @name publisher#queryMonitoringArticles
     * @param {String} articleStatus - status of articles (new, published, unpublished, canceled)
     * @returns {Promise}
     * @description List all articles for monitoring view
     */
    queryMonitoringArticles(articleStatus) {
      return pubapi.queryWithDetails("packages", articleStatus);
    }

    /**
     * @ngdoc method
     * @name publisher#getPackage
     * @param {String} packageId - id of package
     * @returns {Promise}
     * @description List all articles for monitoring view
     */
    getPackage(packageId, withRoutes = false, withContentLists = false) {
      let params = {};

      if (withContentLists) params.withContentLists = true;
      if (withRoutes) params.withRoutes = true;

      return pubapi.get("packages", packageId, params);
    }

    /**
     * @ngdoc method
     * @name publisher#queryRelatedArticlesStatus
     * @param {Number} articleId
     * @returns {Promise}
     * @description List availability of related articles to given article/package
     */
    queryRelatedArticlesStatus(articleId) {
      return pubapi.get("packages/" + articleId + "/related");
    }

    /**
     * @ngdoc method
     * @name publisher#removeArticle
     * @param {Object} update - contains status of article
     * @param {String} articleId - id of article
     * @returns {Promise}
     * @description Remove article from incoming list
     */
    removeArticle(update, articleId) {
      return pubapi.patch("packages/" + articleId, update);
    }

    /**
     * @ngdoc method
     * @name publisher#publishArticle
     * @param {Object} destinations - contains array of destionations where to publish article
     * @param {String} articleId - id of article
     * @returns {Promise}
     * @description Publish article to different tenants
     */
    publishArticle(destinations, articleId) {
      return pubapi.save("packages/" + articleId + "/publish", destinations);
    }

    /**
     * @ngdoc method
     * @name publisher#unPublishArticle
     * @param {String} tenants - containts array of tenants from wchic to unpublish article
     * @param {String} articleId - id of article
     * @returns {Promise}
     * @description Unpublish article from different tenants
     */
    unPublishArticle(tenants, articleId) {
      return pubapi.save("packages/" + articleId + "/unpublish", tenants);
    }

    /**
     * @ngdoc method
     * @name publisher#getSettings
     * @returns {Promise}
     * @description Gets Publisher settings
     */
    getSettings() {
      return pubapi.get("settings");
    }

    /**
     * @ngdoc method
     * @name publisher#saveSettings
     * @returns {Promise}
     * @description Saves Publisher settings
     */
    saveSettings(settings) {
      return pubapi.patch("settings/bulk", settings);
    }

    /**
     * @ngdoc method
     * @name publisher#queryOrganizationRules
     * @returns {Promise}
     * @description Loads Organization Rules
     */
    queryOrganizationRules(params) {
      return pubapi.query("organization/rules", params);
    }

    /**
   * @ngdoc method
   * @name publisher#getAnalyticsReports
   * @returns {Promise}
   * @description List all webhooks
   */
    getAnalyticsReports(params) {
      return pubapi.queryWithDetails("export/analytics", params);
    }

    /**
     * @ngdoc method
     * @name publisher#queryTenantRules
     * @returns {Promise}
     * @description Loads Tenant Rules
     */
    queryTenantRules(params) {
      return pubapi.query("rules", params);
    }

    /**
     * @ngdoc method
     * @name publisher#removeOrganizationRule
     * @param {Number} ruleId - id of rule which is deleted
     * @returns {Promise}
     * @description Delete organization rule
     */
    removeOrganizationRule(ruleId) {
      return pubapi.remove("organization/rules", ruleId);
    }

    /**
     * @ngdoc method
     * @name publisher#manageOrganizationRule
     * @param {Object} rule - rule which is edited
     * @param {String} id - id of rule which is edited
     * @returns {Promise}
     * @description Add or edit organization rule
     */
    manageOrganizationRule(rule, id) {
      return pubapi.save("organization/rules", rule, id);
    }

    /**
     * @ngdoc method
     * @name publisher#removeTenantRule
     * @param {Number} ruleId - id of rule which is deleted
     * @returns {Promise}
     * @description Delete tenant rule
     */
    removeTenantRule(ruleId) {
      return pubapi.remove("rules", ruleId);
    }

    /**
     * @ngdoc method
     * @name publisher#manageTenantRule
     * @param {Object} rule - rule which is edited
     * @param {String} id - id of rule which is edited
     * @returns {Promise}
     * @description Add or edit tenant rule
     */
    manageTenantRule(rule, id) {
      return pubapi.save("rules", rule, id);
    }

    /**
     * @ngdoc method
     * @name publisher#getOrganizationThemes
     * @returns {Promise}
     * @description Gets available themes
     */
    getOrganizationThemes() {
      return pubapi.get("organization/themes");
    }

    /**
     * @ngdoc method
     * @name publisher#uploadOrganizationTheme
     * @param {Object} themeUpload - object with file
     * @returns {Promise}
     * @description Uploads organization theme
     */
    uploadOrganizationTheme(themeUpload) {
      return pubapi.upload("organization/themes", themeUpload);
    }

    /**
     * @ngdoc method
     * @name publisher# uploadMetaImage
     * @param {Object}  imageUpload - object with file
     * @param {String}  slug - article slug
     * @returns {Promise}
     * @description Uploads meta data image
     */
    uploadMetaImage(imageUpload, slug) {
      return pubapi.upload("upload/seo_image", imageUpload, slug);
    }

    /**
     * @ngdoc method
     * @name publisher# uploadThemeLogo
     * @param {Object}  logoUpload - object with file
     * @param {String}  type - type of logo (theme_logo, theme_logo_second etc)
     * @returns {Promise}
     * @description Uploads theme logo
     */
    uploadThemeLogo(logoUpload, type) {
      return pubapi.upload("theme/logo_upload", logoUpload, type);
    }

    /**
     * @ngdoc method
     * @name publisher#installTenantTheme
     * @param {Object} themeInstall - object with params to save
     * @returns {Promise}
     * @description Installs theme on given tenant
     */
    installTenantTheme(themeInstall) {
      return pubapi.save("themes", themeInstall);
    }

    /**
     * @ngdoc method
     * @name publisher#settingsRevert
     * @param {String} scope - scope
     * @returns {Promise}
     * @description Reverts settings by scope
     */
    settingsRevert(scope) {
      return pubapi.post("settings/revert", scope);
    }

    /**
     * @ngdoc method
     * @name publisher#getWebhooks
     * @returns {Promise}
     * @description List all webhooks
     */
    getWebhooks() {
      let params = {
        limit: 9999
      };

      return pubapi.query("webhooks", params);
    }

    /**
    * @ngdoc method
    * @name publisher#manageWebhook
    * @param {Object} webhook - webhook which is edited
    * @param {String} id - id of webhook which is edited
    * @returns {Promise}
    * @description Add or edit tenant rule
    */
    manageWebhook(webhook, id) {
      return pubapi.save("webhooks", webhook, id);
    }

    /**
     * @ngdoc method
     * @name publisher#removeWebhook
     * @param {String} id - id of webhook which is deleted
     * @param {Object} params
     * @returns {Promise}
     * @description Delete webhook
     */
    removeWebhook(id, params) {
      return pubapi.remove("webhooks", id, params);
    }

    /**
     * @ngdoc method
     * @name publisher#manageOrganizationRule
     * @param {Object} data - meta data which is edited
     * @param {String} slug - article slug
     * @returns {Promise}
     * @description Save article meta data
     */
    saveArticleMetaData(data, slug) {
      return pubapi.save("content/articles", { seo_metadata: data }, slug);
    }

    /**
     * @ngdoc method
     * @name publisher#generateAnalyticsReport
     * @param {Object} filters
     * @returns {Promise}
     * @description Save article meta data
     */
    generateAnalyticsReport(filters) {
      return pubapi.save("export/analytics", filters);
    }
  }

  return new Publisher();
}
