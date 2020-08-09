const path = require('path');
const webpack = require('webpack'); //to access built-in plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    plugins: [
        new CleanWebpackPlugin(),
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     THREE: "three"
        // }),
        new HtmlWebpackPlugin({
            title: 'Tunnel',
            meta: {
                "viewport": 'width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0',
                "og:title": { property: "og:title", content: "Tunnel (2019)" },
                "og:description": { property: "og:description", content: "A three.js-experiment by weiserhei" },
                "og:image": { property: "og:image", content: "https://weiserhei.github.io/tunnel/ogimage.jpg" },
                "og:url": { property: "og:url", content: "https://weiserhei.github.io/tunnel/dist/" },
            },
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: { name: 'vendor', chunks: 'all' }
    },
    // resolve: {
    //     alias: {
    //       Classes: path.resolve(__dirname, 'src/js/classes/'),
    //     }
    // },
    module: {
        rules: [
            {
                // shim because SPE 1.0.6 is not a module
                // delete SPEs dependency on threejs in package-lock.json 
                // or it will fallback and doesnt work!
                test: require.resolve("shader-particle-engine"),
                use: ['imports-loader?THREE=three', 'exports-loader?SPE']
            },
            // {
            // 	test: /\.(obj|mtl)$/,
            // 	use: { loader: 'file-loader', options: { outputPath: 'objs' } }
            // },
            {
                test: /\.(ogg|mp3|wav)$/,
                use: { loader: 'file-loader', options: { outputPath: 'media' } }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    { 
                        loader: 'file-loader',
                        options: { outputPath: 'img' } // where to place images referenced in CSS and modules
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { outputPath: 'fonts' }
                    }
                ]
            }
        ]
    }
};