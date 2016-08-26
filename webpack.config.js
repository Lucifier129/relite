var webpack = require('webpack');
var path = require('path');

module.exports = {
    watch: true,
    entry: {
        'counter': ['babel-polyfill', './examples/counter/src'],
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
                presets: ["latest", "stage-0", "react"]
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
            'relite': path.join(__dirname, 'src'),
            'react': 'react-lite',
            'react-dom': 'react-lite',
        }
    }
};
