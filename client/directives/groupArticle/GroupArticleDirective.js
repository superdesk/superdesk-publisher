/**
 * @ngdoc directive
 * @module superdesk.apps.web_publisher
 * @name sdGroupArticle
 * @requires publisher
 * @description Directive list articles by group in monitoring
 */
GroupArticleDirective.$inject = ["publisher", "publisherHelpers"];
export function GroupArticleDirective(publisher, publisherHelpers) {
  class GroupArticle {
    constructor() {
      this.scope = {
        rootType: "@",
        webPublisherOutput: "=webPublisherOutput",
        initialFilters: "=filters",
        site: "=site",
        type: "=type"
      };

      this.template = require("./view.html");
    }

    link(scope) {
      scope.loadingArticles = false;
      scope.listenerAttached = false;
      scope.articlesList = [];
      scope.articlesLimit = 20;
      scope.filters = scope.initialFilters ? scope.initialFilters : {};
      scope.loadedFilters = !!scope.filters;
      publisher.setToken().then(() => {
        scope.loadArticles(true);

        scope.$watch("rootType", () => {
          scope.loadArticles(true);
        });

        scope.$watch("site", () => {
          scope.loadArticles(true);
        });
      });

      scope.$watch(
        () => scope.webPublisherOutput.selectedArticle,
        (newVal, oldVal) => {
          if (newVal && !scope.listenerAttached) {
            window.addEventListener("keydown", scope.keyPressedHandler);
            scope.listenerAttached = true;
          } else if (!newVal && scope.listenerAttached) {
            window.removeEventListener("keydown", scope.keyPressedHandler);
            scope.listenerAttached = false;
          }
        },
        true
      );

      scope.$on("$destroy", () => {
        window.removeEventListener("keydown", scope.keyPressedHandler);
      });

      scope.hasGalleries = items => {
        let isFlag = false;
        angular.forEach(items, i => {
          if (i.type === "media") isFlag = true;
        });

        return isFlag;
      };

      scope.keyPressedHandler = e => {
        let articleIndex = scope.articlesList.findIndex(
          el => el.id === scope.webPublisherOutput.selectedArticle.id
        );
        e = e || window.event;

        if (articleIndex < 0 || (e.keyCode !== "38" && e.keyCode !== "40"))
          return;

        if (e.keyCode == "38") {
          articleIndex = articleIndex - 1;
        } else if (e.keyCode == "40") {
          articleIndex = articleIndex + 1;
        }
        if (scope.articlesList[articleIndex]) {
          scope.webPublisherOutput.openPreview(
            scope.articlesList[articleIndex]
          );
        }
      };

      scope.buildTenantParams = () => {
        let tenant = [];

        if (scope.site) {
          tenant.push(scope.site.code);
        }

        return tenant;
      };

      scope.buildRouteParams = () => {
        let route = [];

        if (scope.filters.routes) {
          angular.forEach(scope.filters.routes, (routeObj, key) => {
            route.push(routeObj.id);
          });
        }
        return route;
      };

      scope.buildUniversalParams = () => {
        let universalParams = {};

        if (scope.filters.author && scope.filters.author.length) {
          universalParams["author[]"] = scope.filters.author;
        }

        if (scope.filters.source && scope.filters.source.length) {
          universalParams["source[]"] = scope.filters.source;
        }

        if (scope.filters.term && scope.filters.term.length) {
          universalParams.term = scope.filters.term;
        }

        return universalParams;
      };

      scope.buildQueryParams = reset => {
        let page =
          reset || !scope.totalArticles ? 1 : scope.totalArticles.page + 1;
        let queryParams = {
          page: page,
          limit: scope.articlesLimit,
          "status[]": []
        };

        let route = scope.buildRouteParams();
        let tenant = scope.buildTenantParams();
        let universal = scope.buildUniversalParams();

        queryParams = Object.assign(queryParams, universal);

        // building query params for both cases
        if (scope.rootType && scope.rootType === "incoming") {
          queryParams["status[]"] = ["new"];
          queryParams["sorting[created_at]"] = "desc";
        } else {
          queryParams["status[]"] = ["published", "unpublished"];
          queryParams["tenant[]"] = tenant.length ? tenant : undefined;
          queryParams["route[]"] = route.length ? route : undefined;
          queryParams.published_before = scope.filters.publishedBefore;
          queryParams.published_after = scope.filters.publishedAfter;
          queryParams["sorting[published_at]"] = "desc";
        }
        return queryParams;
      };

      scope.$on("newPackage", (e, item, state) => {
        if (scope.rootType === "incoming" && item.status === "published") {
          scope.removeArticle(item.id);
        }

        if (scope.rootType === "incoming" && item.status === "new") {
          scope.addUpdateArticle(item, state);
        }

        if (
          scope.rootType === "published" &&
          !scope.site &&
          (item.status === "published" || item.status === "unpublished")
        ) {
          scope.addUpdateArticle(item, state);
        }

        if (
          scope.site &&
          (item.status === "published" || item.status === "unpublished")
        ) {
          angular.forEach(item.articles, article => {
            if (article.tenant.code === scope.site.code) {
              scope.addUpdateArticle(item, state);
            }
          });
        }
      });

      scope.$on("removeFromArticlesList", (e, itemId) => {
        scope.removeArticle(itemId);
      });

      scope.$on("refreshArticlesList", (e, filters) => {
        if (filters) {
          scope.filters = filters;
          scope.loadedFilters = true;
        }
        if (filters || scope.rootType) {
          scope.loadArticles(true);
        }
      });

      scope.removeArticle = itemId => {
        if (!itemId || scope.rootType === "published") return;

        let index = scope.articlesList.findIndex(el => el.id === itemId);

        if (index > -1) {
          scope.articlesList.splice(index, 1);
          if (scope.type !== "swimlane") {
            scope.totalArticles.total -= 1;
            scope.totalArticles.pages = Math.ceil(
              scope.totalArticles.total / scope.articlesLimit
            );
            scope.webPublisherOutput.articlesCount[scope.rootType] =
              scope.totalArticles.total;
          }
          scope.$apply();
        }
      };

      scope.addUpdateArticle = (item, state) => {
        item.animate = true;
        if (state === "update") {
          //update
          let elIndex = scope.articlesList.findIndex(
            el => el.guid === item.guid
          );
          if (elIndex !== -1) {
            scope.articlesList[elIndex] = item;
          }
        } else {
          //new article
          scope.articlesList = [item].concat(scope.articlesList);
          if (scope.articlesList.length % scope.articlesLimit === 0) {
            scope.articlesList.splice(-1, 1);
          }
          if (scope.type !== "swimlane") {
            scope.totalArticles.total += 1;
            scope.totalArticles.pages = Math.ceil(
              scope.totalArticles.total / scope.articlesLimit
            );
            scope.webPublisherOutput.articlesCount[scope.rootType] =
              scope.totalArticles.total;
          }
        }

        scope.$apply();
      };

      scope.loadArticles = reset => {
        if (scope.loadingArticles) {
          return;
        }

        if (reset) {
          scope.articlesList = [];
        }

        let queryParams = scope.buildQueryParams(reset);

        if (
          !reset &&
          scope.totalArticles &&
          queryParams.page > scope.totalArticles.pages
        ) {
          return;
        }

        scope.loadingArticles = true;
        scope.webPublisherOutput.loadingArticles = true;

        publisher
          .queryMonitoringArticles(queryParams)
          .then(articles => {
            scope.totalArticles = articles;
            let newArticles = articles._embedded._items;

            if (scope.rootType === "published") {
              angular.forEach(newArticles, item => {
                item.comments_count = publisherHelpers.countComments(
                  item.articles
                );
                item.pageviewsCount = publisherHelpers.countPageViews(
                  item.articles
                );
                angular.forEach(item.articles, item => {
                  if (item.route && item.status == "published") {
                    let tenantUrl = item.tenant.subdomain
                      ? item.tenant.subdomain + "." + item.tenant.domain_name
                      : item.tenant.domain_name;
                    item.live_url =
                      "http://" + tenantUrl + item._links.online.href;
                  }
                });
              });
            }
            scope.articlesList = scope.articlesList.concat(
              articles._embedded._items
            );
            scope.loadingArticles = false;
            scope.webPublisherOutput.loadingArticles = false;

            if (scope.type !== "swimlane") {
              scope.webPublisherOutput.articlesCount[scope.rootType] =
                scope.totalArticles.total;
            }
          })
          .catch(err => {
            scope.loadingArticles = false;
            scope.webPublisherOutput.loadingArticles = false;
          });
      };
    }
  }

  return new GroupArticle();
}
