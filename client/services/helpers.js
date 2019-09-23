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

    if (!article.media) {
      return base + article.feature_media._links.download.href;
    }

    let mediaEl = article.media.find(el => el.id === article.feature_media.id);
    let rendition = mediaEl.renditions.find(el => el.name === type);

    if (!rendition)
      rendition = mediaEl.renditions.find(el => el.name === "original");

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

  return {
    getUpdatedValues: getUpdatedValues,
    getRenditionUrl: getRenditionUrl
  };
})();

export default helpers;
