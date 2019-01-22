/**
 * @ngdoc service
 * @module superdesk.apps.web_publisher
 * @name publisherHelpers
 * @description Publisher helpers service
 */

export function PublisherHelpersFactory() {
    class PublisherHelpers {

        /**
         * @ngdoc method
         * @name PublisherHelpers#getRenditionUrl
         * @param {Object} article
         * @param {String} type
         * @returns {String}
         * @description Returns image rendition url
         */
        getRenditionUrl(article, type = 'thumbnail') {
            let base = article.tenant.subdomain ? '//' + article.tenant.subdomain + '.' + article.tenant.domainName : '//' + article.tenant.domainName;
            let mediaEl = article.media.find(el => el.id === article.featureMedia.id);
            let rendition = mediaEl.renditions.find(el => el.name === type);

            return base + '/media/' + rendition.image.assetId + '.' + rendition.image.fileExtension;
        };

    }

    return new PublisherHelpers();
}
