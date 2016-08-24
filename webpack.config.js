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
                stage: 0
            },
            exclude: /node_modules/
        }],
        postLoaders: [{
            test: /controller\.jsx?$/,
            loader: 'bundle-loader',
            query: {
                lazy: true,
                name: './[2]/dest/[folder]',
                regExp: /(.*)examples[\/\\](.*)[\/\\]src(.*)$/.source,
            },
            exclude: /node_modules/,
        }]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            // names: ["app", "subPageA"]
            // (choose the chunks, or omit for all chunks)

            children: true,
            // (select all children of chosen chunks)

            // minChunks: 3,
            // (3 children must share the module before it's moved)
        })
    ],
    resolve: {
        extensions: ['', '.js'],
        root: __dirname,
        alias: {
            'create-app': path.join(__dirname, 'src'),
            'react': 'react-lite',
            'react-dom': 'react-lite',
        }
    }
};
