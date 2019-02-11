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

            if (!rendition) rendition = mediaEl.renditions.find(el => el.name === 'original');

            return base + '/media/' + rendition.image.assetId + '.' + rendition.image.fileExtension;
        };

        /**
         * @ngdoc method
         * @name PublisherHelpers#countPageViews
         * @param {Array} articles
         * @description Counts total page views
         */
        countPageViews(articles = []) {
            let count = 0;

            articles.forEach(art => {
                count += parseInt(art.articleStatistics.pageViewsNumber);
            })

            return count;
        }

        /**
         * @ngdoc method
         * @name PublisherHelpers#countComments
         * @param {Array} articles
         * @description Counts total comments
         */
        countComments(articles = []) {
            let count = 0;

            articles.forEach(art => {
                count += parseInt(art.commentsCount);
            })

            return count;
        }

    }

    return new PublisherHelpers();
}
