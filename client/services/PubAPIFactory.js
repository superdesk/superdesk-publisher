/**
 * @ngdoc service
 * @module superdesk.apps.web_publisher
 * @name pubapi
 *
 * @requires config
 * @requires https://docs.angularjs.org/api/ng/service/$http $http
 * @requires https://docs.angularjs.org/api/ng/service/$q $q
 *
 * @description Publisher API service
 */
PubAPIFactory.$inject = ['config', '$http', '$q', 'session', '$location', 'Upload'];
export function PubAPIFactory(config, $http, $q, session, $location, Upload) {
    class PubAPI {
        constructor() {
            let pubConfig = config.publisher || {};

            this._base = pubConfig.base || '';
            this._protocol = pubConfig.protocol || $location.protocol();
            this._domain = pubConfig.domain || '';
            this._tenant = pubConfig.tenant || '';
            this.setTenant();
        }

        /**
         * @ngdoc method
         * @name pubapi#setToken
         * @returns {Promise}
         * @description Sets token
         */
        setToken() {
            return this.save('auth/superdesk', { session_id: session.sessionId, token: session.token })
                .then((response) => {
                    this._token = response.token.api_key;
                    return response;
                });
        }

        /**
         * @ngdoc method
         * @name pubapi#setTenant
         * @param {String} site
         * @description Change the tenant we are using the api for
         */
        setTenant(site) {
            let subdomain = this._tenant ? `${this._tenant}.` : '';
            let domainName = this._domain;

            if (site) {
                if (site.subdomain) {
                    subdomain = `${site.subdomain}.`;
                }
                if (site.domain_name) {
                    domainName = site.domain_name;
                }
            }

            this._server = `${this._protocol}://${subdomain}${domainName}`;
        }

        /**
         * @ngdoc method
         * @name pubapi#checkIfPublisher
         * @param {String} url data
         * @returns {Bolean}
         * @description Checks if there is publisher under given url
         */
        checkIfPublisher(url) {
            let config = {
                url: `${this._protocol}://` + url + `/${this._base}/`,
                method: 'GET'
            };

            return $http(config)
                .then((response) => {
                    return response.headers('X-Superdesk-Publisher') ? true : false;
                })
                .catch((response) => {
                    return response.headers('X-Superdesk-Publisher') ? true : false;
                });
        }

        /**
         * @ngdoc method
         * @name pubapi#query
         * @param {String} resource
         * @param {Object} params
         * @returns {Promise}
         * @description Query resource
         */
        query(resource, params) {
            return this.req({
                url: this.resourceURL(resource),
                method: 'GET',
                params: params
            }).then((response) => response._embedded._items);
        }

        /**
         * @ngdoc method
         * @name pubapi#query
         * @param {String} resource
         * @param {Object} params
         * @returns {Promise}
         * @description Query resource
         */
        queryWithDetails(resource, params) {
            return this.req({
                url: this.resourceURL(resource),
                method: 'GET',
                params: params
            });
        }

        /**
         * @ngdoc method
         * @name pubapi#get
         * @param {String} resource
         * @param {Number} id
         * @param {Object} params
         * @returns {Promise}
         * @description GET a given resource by id.
         */
        get(resource, id, params) {
            return this.req({
                url: this.resourceURL(resource, id),
                method: 'GET',
                params: params
            });
        }

        /**
        * @ngdoc method
        * @name pubapi#post
        * @param {String} resource
        * @param {String} id
        * @returns {Promise}
        * @description POST a given resource by id.
        */
        post(resource, id) {
            return this.req({
                url: this.resourceURL(resource, id),
                method: 'POST'
            });
        }

        /**
         * @ngdoc method
         * @name pubapi#save
         * @param {String} resource
         * @param {Object} item - item which is saved
         * @param {String} id - id of item which is saved
         * @returns {Promise}
         * @description Save an item
         */
        save(resource, item, id) {
            return this.req({
                url: this.resourceURL(resource, id),
                method: id ? 'PATCH' : 'POST',
                data: item,
                add_format: 'json'
            }).then((response) => {
                if (item) {
                    angular.extend(item, response);
                }

                return response;
            });
        }

        /**
         * @ngdoc method
         * @name pubapi#publish
         * @param {String} resource
         * @param {Object} item - item which is saved
         * @returns {Promise}
         * @description Publish an item
         */
        publish(resource, item) {
            return this.req({
                url: this.resourceURLWithoutID(resource),
                method: 'POST',
                data: item,
                add_format: 'json'
            }).then((response) => {
                if (item) {
                    angular.extend(item, response);
                }

                return response;
            });
        }

        /**
         * @ngdoc method
         * @name pubapi#patch
         * @param {String} resource
         * @param {Object} item - item which is saved
         * @returns {Promise}
         * @description patches an item
         */
        patch(resource, item) {
            return this.req({
                url: this.resourceURL(resource),
                method: 'PATCH',
                data: item
            }).then((response) => {
                angular.extend(item, response);
                return response;
            });
        }

        /**
         * @ngdoc method
         * @name pubapi#put
         * @param {String} resource
         * @param {String} id - id of item which is updated
         * @param {Object} item - item which is saved
         * @returns {Promise}
         * @description patches an item
         */
        put(resource, id, item) {
            return this.req({
                url: this.resourceURL(resource, id),
                method: 'PUT',
                data: item
            }).then((response) => {
                angular.extend(item, response);
                return response;
            });
        }

        /**
         * @ngdoc method
         * @name pubapi#remove
         * @param {String} resource
         * @param {String} id - id of item which is deleted
         * @param {Object} params
         * @returns {Promise}
         * @description Remove an item
         */
        remove(resource, id, params) {
            return this.req({
                url: this.resourceURL(resource, id),
                method: 'DELETE',
                params: params
            });
        }

        /**
         * @ngdoc method
         * @name pubapi#resourceURL
         * @param {String} resource
         * @param {String} id
         * @returns {String}
         * @description Get resource url
         */
        resourceURL(resource, id = '') {
            return `${this._server}/${this._base}/${resource}/${id}`;
        }
        /**
         * @ngdoc method
         * @name pubapi#resourceURLWithoutID
         * @param {String} resource
         * @param {String} id
         * @returns {String}
         * @description Get resource url
         */
        resourceURLWithoutID(resource) {
            return `${this._server}/${this._base}/${resource}`;
        }

        /**
        * @ngdoc method
        * @name pubapi#req
        * @param {Object} config
        * @returns {Promise}
        * @description API Request - Adds basic error reporting
        */
        req(config) {
            config.headers = { Authorization: 'Basic ' + this._token };
            return $http(config).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.data;
                }

                if (response.status === 401 || response.status === 403) {
                    window.location.reload();
                }

                console.error('publisher api error', response);
                return $q.reject(response);
            });
        }

        /**
        * @ngdoc method
        * @name pubapi#upload
        * @param {String} resource
        * @param {Object} dataObject
        * @param {String} id
        * @returns {Promise}
        * @description upload data.
        */
        upload(resource, dataObject, id) {
            return Upload.upload({
                url: this.resourceURL(resource, id),
                data: dataObject
            })
        }

    }

    return new PubAPI();
}
