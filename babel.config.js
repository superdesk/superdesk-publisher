module.exports = {
    env: {
        test: {
            babelrc: false,
            presets: [
              [
                "@babel/env",
                {
                  modules: true
                }
              ],
              "@babel/react"
            ],
            plugins: [
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-proposal-class-properties'
            ]
        }
    }
};
