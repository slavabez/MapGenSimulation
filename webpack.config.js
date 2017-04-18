const path = require('path');

module.exports = {

    entry: './src/index.ts',

    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'bundle.js'
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            /*{
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                },
            },*/
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/,
                use: ['file-loader?name=[name].[ext]']
            },
            {
                test: /\.ts?$/,
                loader: "ts-loader"
            }
        ]
    },

    devServer: {
        contentBase: path.resolve(__dirname, './src')
    }
};