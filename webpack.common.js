const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
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
                "og:url": { property: "og:url", content: "https://weiserhei.github.io/tunnel/" },
            },
        })
    ],
    entry: './src/js/index.js',
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
                // use third party package because its hardcoded dependency on three r87
                // import three as THREE and export SPE
                test: require.resolve("shader-particle-engine"),
                use: [
                    'imports-loader?imports[]=namespace|three|THREE',
                    'exports-loader?exports=default|SPE'
                ]
            },
            // verbose declaration of the line above
            // {
            //     test: require.resolve("shader-particle-engine"),
            //     loader: 'imports-loader',
            //     options: {
            //         type: "module",
            //         imports: [
            //             'namespace three THREE'
            //         ]
            //     }
            // },
            // {
            //     test: require.resolve("shader-particle-engine"),
            //     loader: 'exports-loader',
            //     options: {
            //         exports: 'default SPE'
            //     }
            // },
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
