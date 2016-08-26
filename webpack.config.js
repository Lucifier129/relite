var webpack = require('webpack');
var path = require('path');

module.exports = {
    watch: true,
    entry: {
        'simple-spa': './examples/simple-spa/src',
        'test-history': './examples/test-history/src',
    },
    output: {
        publicPath: '/examples/',
        path: './examples/',
        filename: '[name]/dest/index.js',
        chunkFilename: '[name].js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            query: {
                presets: ["latest"]
            },
            exclude: /node_modules/
        }]
    },
    plugins: [
    ],
    resolve: {
        extensions: ['', '.js'],
        root: __dirname,
        alias: {
            'create-app': path.join(__dirname, 'src'),
            // 'react': 'react-lite',
            // 'react-dom': 'react-lite',
        }
    }
};
