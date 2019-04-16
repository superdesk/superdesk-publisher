/**
 * @ngdoc directive
 * @module superdesk.apps.web_publisher
 * @name sdArticles
 * @requires publisher
 * @description Directive to handle listing articles in web
 */
ArticlesDirective.$inject = ['publisher'];
export function ArticlesDirective(publisher) {
    class Articles {
        constructor() {
            this.scope = {scrollContainer: '=scrollcontainer'};
            this.template = '<ng-include src="articles-detail.html"/>';
        }

        link(scope) {
            scope.params = {
                limit: 20,
                status: 'published',
                page: 1,
                'sorting[created_at]': 'desc'
            };

            scope.list = {
                items: [],
                totalPages: 1,
                page: 0
            };

            /**
             * @ngdoc method
             * @name sdArticles#loadMore
             * @description loads more items
             */
            scope.loadMore = () => {
                if (scope.loading || scope.list.page >= scope.list.totalPages) {
                    return;
                }

                scope.params.page = scope.list.page + 1;
                this._queryItems(scope);
            };

            scope.$on('refreshArticles', (e, filters) => {
                scope.params = filters;
                scope.params.page = 1;
                scope.params.includeSubRoutes = true;
                this._queryItems(scope);
            });
                this._queryItems(scope);
        }

        /**
         * @ngdoc method
         * @name sdArticles#_queryItems
         * @private
         * @param {Object} scope
         * @description Loads items
         */
        _queryItems(scope) {
            scope.loading = true;
            publisher.queryTenantArticles(scope.params).then((response) => {
                scope.loading = false;
                scope.list.page = response.page;
                scope.list.totalPages = response.pages;
                scope.list.items = response.page > 1 ?
                    scope.list.items.concat(response._embedded._items) :
                    response._embedded._items;
            });
        }
    }

    return new Articles();
}
