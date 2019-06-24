module.exports = {
    env: {
        test: {
            babelrc: false,
            presets: [
              [
                "@babel/env",
                {
                  modules: true,
                  browsers: ["last 2 Chrome versions"]
                }
              ],
              "@babel/react"
            ],
            plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties',
                '@babel/transform-runtime'
            ]
        }
    }
};
