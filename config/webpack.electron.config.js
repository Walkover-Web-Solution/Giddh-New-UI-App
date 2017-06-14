const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const extractCSS = new ExtractTextPlugin('giddh.min.css')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const glob = require('glob');
const pkg = require('../package.json')
const moment = require('moment');

const vendoreArray = [
    path.resolve(__dirname, '../app/webapp/Globals/modified_lib/moment.js'),
    'script-loader!jquery',
    'jquery-ui',
    'script-loader!' + path.resolve(__dirname, '../node_modules/perfect-scrollbar/dist/js/perfect-scrollbar.min.js'),
    'script-loader!' + path.resolve(__dirname, '../node_modules/perfect-scrollbar/dist/js/perfect-scrollbar.jquery.min.js'),
    'angular',
    'bootstrap',
    'script-loader!' + path.resolve(__dirname, '../node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js'),
    'script-loader!' + path.resolve(__dirname, '../node_modules/underscore/underscore-min.js'),
    'angular-sanitize',
    'satellizer',
    'angular-animate',
    'angular-resource',
    'angular-ui-router',
    'angular-translate',
    'angular-filter',
    'angular-mocks',
    'angular-local-storage',
    'angular-toastr',
    'angular-ui-tree',
    'ng-file-upload',
    'ui-select',
    'html2canvas',
    'script-loader!' + path.resolve(__dirname, '../node_modules/chart.js/Chart.min.js'),
    'angular-ui-switch',
    'ng-csv',
    'angular-vidbg',
    'fullpage.js',
    'angular-recaptcha',
    'angular-fullpage.js',
    'angular-wizard',
    'angular-google-chart',
    'intl-tel-input',
    'script-loader!' + path.resolve(__dirname, '../node_modules/international-phone-number/releases/international-phone-number.min.js'),
    'angular-file-saver',
    'angular-gridster',
    'ment.io',
    'tinymce',
    'tinymce-mention',
    'angular-ui-tinymce',
    'file-saver.js',
    'angular-upload',
    'angular-ui-mask'

];
const filesArray = [];

var f = glob.sync(path.resolve(__dirname, '../app/webapp/Globals/modified_lib/**/*.js'), {
    ignore: [
        path.resolve(__dirname, '../app/webapp/Globals/modified_lib/moment.js')
    ]
}).map((i) => {
    return 'script-loader!' + i
})
filesArray.push(...f);
filesArray.push('script-loader!' + path.resolve(__dirname, '../node_modules/rxjs/bundles/Rx.umd.js'))
filesArray.push('script-loader!' + path.resolve(__dirname, '../node_modules/es6-shim/es6-shim.js'))
filesArray.push('script-loader!' + path.resolve(__dirname, '../node_modules/angular2/bundles/angular2-polyfills.js'))
filesArray.push('script-loader!' + path.resolve(__dirname, '../node_modules/angular2/bundles/angular2-all.umd.min.js'))
filesArray.push(path.resolve(__dirname, '../app/webapp/root.js'));
filesArray.push(...glob.sync(path.resolve(__dirname, '../app/webapp/**/*.js'), {
    ignore: [
        path.resolve(__dirname, '../app/webapp/Globals/modified_lib/**/*.js'),
        path.resolve(__dirname, '../app/webapp/root.js'),
        path.resolve(__dirname, '../app/webapp/ng2/**/*.js')

    ]
}));

filesArray.push(...glob.sync(path.resolve(__dirname, '../app/webapp/ng2/**/*.services.js')))
filesArray.push(...glob.sync(path.resolve(__dirname, '../app/webapp/ng2/**/*.component.js')))
filesArray.push(...glob.sync(path.resolve(__dirname, '../app/webapp/ng2/*.js')))

const METADATA = {
    baseUrl: '/public/electron/',
    isProduction: false,
    isDev: true,
    testingUrl: 'http://test.giddh.com',
    isWeb: false,
    isElectron: true
}

module.exports = {
    resolve: {
        extensions: ['.js', '.less', '.css'],
        alias: {
            // modernizr: "modernizr",
            'intl-tel-input': path.resolve(__dirname, '../node_modules/international-phone-number/releases/international-phone-number.js'),
            'international-phone-number': path.resolve(__dirname, '../node_modules/international-phone-number/releases/international-phone-number.js'),
            'ment.io': path.resolve(__dirname, '../node_modules/ment.io/dist/mentio.js'),
            'file-saver.js': path.resolve(__dirname, '../node_modules/file-saver/FileSaver.js'),
        },
        modules: ['node_modules'],
    },
    entry: {
        'vendor': vendoreArray,
        'app.js': filesArray
    },
    devtool: '',
    output: {
        path: path.resolve(__dirname, '../dist/electron/public/webapp'),
        filename: '[name]',
        libraryTarget: "window",
        publicPath: "electron/public/webapp"
    },
    module: {
        rules: [{
            test: /\.css$/i,
            use: extractCSS.extract({
                use: {
                    loader: 'css-loader',
                    options: {
                        minimize: false

                    }
                },
                fallback: "style-loader",
                publicPath: ''
            })
        }, {
            test: /\.(jpg|png|eot|svg|ttf|woff|woff2)$/,
            loader: 'url-loader?limit=100000&name=images/[hash].[ext]'
        }, {
            exclude: /node_modules/,
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                },
            }],
        },
        {
            test: require.resolve("angular"),
            use: 'imports-loader?this=>window'
        }
        ]
    },
    plugins: [
        extractCSS,
        new webpack.ProvidePlugin({
            // "angular": path.resolve(__dirname, '../node_modules/angular/angular.min.js')
            // '$': 'jquery',
            // 'jquery': 'jquery',
            // 'jQuery': 'jquery',
            // 'window.jQuery': 'jquery',
            // "window.moment": path.resolve(__dirname, '../node_modules/moment/moment.js')
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '/../app/webapp/views/index.html'),
            inject: false,
            filename: '../../index.html',
            metadata: METADATA
        }),
        new webpack.DefinePlugin(METADATA),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'core_bower.min.js',
            minChunks: function (module) {
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new CopyWebpackPlugin([{
            from: 'app/webapp/',
            to: './'
        },], {
                ignore: [
                    "*.js", "*.md", "*.json", ".gitignore", "*.eot", "*.ttf", "*.svg", "*.woff", "*.woff2",
                    "*.css", "*.xml", "*.png", "*.jpg", "*.gif", "*.mp4", "*.ico"
                ],
            }),
        new CopyWebpackPlugin([
            {
                from: 'app/webapp/Globals/images',
                to: './Globals/images/'
            }
        ])
    ]
};