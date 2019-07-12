import _ from "lodash";

const helpers = (() => {
  const getUpdatedValues = (a, b) => {
    return _.reduce(
      a,
      function(result, value, key) {
        return _.isEqual(value, b[key])
          ? result
          : result.concat({ [key]: value });
      },
      []
    );
  };

  return {
    getUpdatedValues: getUpdatedValues
  };
})();

export default helpers;
