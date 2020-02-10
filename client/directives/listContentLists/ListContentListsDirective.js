/**
 * @ngdoc directive
 * @module superdesk.apps.web_publisher
 * @name sdListContentLists
 * @requires publisher
 * @description Directive list content lists by tenant in dashboard
 */
ListContentListsDirective.$inject = ['publisher'];
export function ListContentListsDirective(publisher) {
  class ListContentLists {
    constructor() {
      this.scope = {
        site: '=site'
      };

      this.template = require('./view.html');
    }

    link(scope) {
      scope.contentLists = [];
      scope.limit = 5;
      this._queryItems(scope);
    }

    /**
     * @ngdoc method
     * @name sdListArticles#_queryItems
     * @private
     * @param {Object} scope
     * @description Loads items for selected list
     */
    _queryItems(scope) {
      publisher.setTenant(scope.site);
      scope.loading = true;
      publisher.queryLists({ limit: 5 }).then((lists) => {
        scope.contentLists = lists;
        scope.loading = false;
      });
      publisher.setTenant();
    }
  }

  return new ListContentLists();
}
