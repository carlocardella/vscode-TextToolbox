const path = require("path");
const webpack = require("webpack");

const webConfig = /** @type WebpackConfig */ {
    context: __dirname,
    mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
    target: "webworker", // web extensions run in a webworker context
    entry: {
        "extension-web": "./src/extension.ts", // source of the web extension main file
        // "test/suite/index-web": "./src/test/suite/index-web.ts", // source of the web extension test runner
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "./dist"),
        libraryTarget: "commonjs",
    },
    resolve: {
        mainFields: ["browser", "module", "main"], // look for `browser` entry point in imported node modules
        extensions: [".ts", ".js"], // support ts-files and js-files
        alias: {
            // provides alternate implementation for node module and source files
        },
        fallback: {
            // Webpack 5 no longer polyfills Node.js core modules automatically.
            // see https://webpack.js.org/configuration/resolve/#resolvefallback
            // for the list of Node.js core module polyfills.
            assert: require.resolve("assert"),
            // buffer: require.resolve("buffer"),
            // console: require.resolve("console-browserify"),
            // constants: require.resolve("constants-browserify"),
            // crypto: require.resolve("crypto-browserify"),
            // domain: require.resolve("domain-browser"),
            // events: require.resolve("events"),
            // http: require.resolve("stream-http"),
            // https: require.resolve("https-browserify"),
            os: require.resolve("os-browserify/browser"),
            path: require.resolve("path-browserify"),
            // punycode: require.resolve("punycode"),
            process: require.resolve("process/browser"),
            // querystring: require.resolve("querystring-es3"),
            // stream: require.resolve("stream-browserify"),
            // string_decoder: require.resolve("string_decoder"),
            // sys: require.resolve("util"),
            // timers: require.resolve("timers-browserify"),
            // tty: require.resolve("tty-browserify"),
            // url: require.resolve("url"),
            // util: require.resolve("util"),
            // vm: require.resolve("vm-browserify"),
            // zlib: require.resolve("browserify-zlib")
            'lorem-ipsum': require.resolve("lorem-ipsum"),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: "process/browser", // provide a shim for the global `process` variable
        }),
    ],
    externals: {
        vscode: "commonjs vscode", // ignored because it doesn't exist
    },
    performance: {
        hints: false,
    },
    devtool: "nosources-source-map", // create a source map that points to the original source file
};
const nodeConfig = /** @type WebpackConfig */ {
    context: __dirname,
    mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
    target: "node", // extensions run in a node context
    entry: {
        "extension-node": "./src/extension.ts", // source of the node extension main file
        // "test/suite/index-node": "./src/test/suite/index-node.ts", // source of the node extension test runner
        // "test/suite/extension.test": "./src/test/suite/extension.test.ts", // create a separate file for the tests, to be found by glob
        "test/runTest": "./src/test/runTest", // used to start the VS Code test runner (@vscode/test-electron)
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "./dist"),
        libraryTarget: "commonjs",
    },
    resolve: {
        mainFields: ["module", "main"],
        extensions: [".ts", ".js"], // support ts-files and js-files
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },
    externals: {
        vscode: "commonjs vscode", // ignored because it doesn't exist
        mocha: "commonjs mocha", // don't bundle
        "@vscode/test-electron": "commonjs @vscode/test-electron", // don't bundle
    },
    performance: {
        hints: false,
    },
    devtool: "nosources-source-map", // create a source map that points to the original source file
};

module.exports = [webConfig, nodeConfig];
