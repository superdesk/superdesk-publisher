import _ from "lodash";

const helpers = (() => {
  const getUpdatedValues = (a, b) => {
    let updatedKeys = _.reduce(
      a,
      (result, value, key) =>
        _.isEqual(value, b[key]) ? result : result.concat(key),
      []
    );
    return _.pick(a, updatedKeys);
  };

  const getRenditionUrl = (article, type = "thumbnail") => {
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
  };

  const countPageViews = (articles = []) => {
    let count = 0;

    articles.forEach(art => {
      count += parseInt(art.article_statistics.page_views_number);
    });

    return count;
  };

  const countComments = (articles = []) => {
    let count = 0;

    articles.forEach(art => {
      count += parseInt(art.comments_count);
    });

    return count;
  };

  return {
    getUpdatedValues: getUpdatedValues,
    getRenditionUrl: getRenditionUrl,
    countPageViews: countPageViews,
    countComments: countComments
  };
})();

export default helpers;
