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
    getRenditionUrl(article, type = "thumbnail") {
      let base = article.tenant.subdomain
        ? "//" + article.tenant.subdomain + "." + article.tenant.domain_name
        : "//" + article.tenant.domain_name;

      if (!article.feature_media.renditions) {
        return base + article.feature_media._links.download.href;
      }

      let rendition = article.feature_media.renditions.find(
        el => el.name === type
      );

      if (!rendition)
        rendition = article.feature_media.renditions.find(
          el => el.name === "original"
        );

      if (!rendition) {
        return base + article.feature_media._links.download.href;
      }

      return (
        base +
        "/media/" +
        rendition.image.asset_id +
        "." +
        rendition.image.file_extension
      );
    }

    /**
     * @ngdoc method
     * @name PublisherHelpers#countPageViews
     * @param {Array} articles
     * @description Counts total page views
     */
    countPageViews(articles = []) {
      let count = 0;

      articles.forEach(art => {
        if(art.article_statistics && art.article_statistics.page_views_number) {
          count += parseInt(art.article_statistics.page_views_number);
        }
      });

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
        if(art.comments_count) {
          count += parseInt(art.comments_count);
        }
      });

      return count;
    }
  }

  return new PublisherHelpers();
}
