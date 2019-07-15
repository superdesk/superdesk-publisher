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

  return {
    getUpdatedValues: getUpdatedValues
  };
})();

export default helpers;
