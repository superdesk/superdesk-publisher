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
         * @name PublisherHelpers#getThumbnail
         * @param {Object} article
         * @returns {String}
         * @description Returns template url dependent on type
         */
        getThumbnail(article) {
            let base = article.tenant.subdomain ? '//' + article.tenant.subdomain + '.' + article.tenant.domainName : '//' + article.tenant.domainName;
            let mediaEl = article.media.find(el => el.id === article.featureMedia.id);
            let rendition = mediaEl.renditions.find(el => el.name === 'thumbnail');

            return base + '/media/' + rendition.image.assetId + '.' + rendition.image.fileExtension;
        };

    }

    return new PublisherHelpers();
}
