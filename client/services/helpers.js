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

  const getRenditionUrl = (renditions, type = "thumbnail") => {
    if (!renditions) {
      return null;
    }

    let rendition = renditions.find(el => el.name === type);

    if (!rendition) rendition = renditions.find(el => el.name === "original");

    if (rendition.href) return rendition.href;

    if (rendition._links && rendition._links.public_url)
      return rendition._links.public_url.href;

    return null;
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
