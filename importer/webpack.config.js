const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle-webpack.js',
        path: path.resolve(__dirname, 'output')
    },
    plugins: [
        new UglifyJSPlugin()
    ]
};
