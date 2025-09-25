const path = require("path");
const webpack = require("webpack");

const webConfig = /** @type WebpackConfig */ {
    context: __dirname,
    mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
    target: "webworker", // web extensions run in a webworker context
    entry: {
        "extension-web": "./src/extension.ts", // source of the web extension main file
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "./dist"),
        libraryTarget: "commonjs",
        clean: false, // don't clean so we keep both builds
    },
    resolve: {
        mainFields: ["browser", "module", "main"], // look for `browser` entry point in imported node modules
        extensions: [".ts", ".js"], // support ts-files and js-files
        alias: {
            // provides alternate implementation for node module and source files
        },
        fallback: {
            // Webpack 5 no longer polyfills Node.js core modules automatically.
            assert: require.resolve("assert"),
            buffer: require.resolve("buffer"),
            crypto: require.resolve("crypto-browserify"),
            os: require.resolve("os-browserify/browser"),
            path: require.resolve("path-browserify"),
            process: require.resolve("process/browser"),
            stream: require.resolve("stream-browserify"),
            timers: require.resolve("timers-browserify"),
            vm: false, // disable vm polyfill as it's not needed for our use case
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/, /\.test\.ts$/, /test/],
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: path.resolve(__dirname, "tsconfig.production.json"),
                        },
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
    optimization: {
        usedExports: true, // enable tree shaking
        sideEffects: false, // mark all files as side-effect free for better tree shaking
        minimize: true, // enable minification in production mode
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    minSize: 0,
                },
            },
        },
    },
    devtool: process.env.NODE_ENV === "production" ? false : "nosources-source-map", // no source maps in production
};
const nodeConfig = /** @type WebpackConfig */ {
    context: __dirname,
    mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
    target: "node", // extensions run in a node context
    entry: {
        "extension-node": "./src/extension.ts", // source of the node extension main file
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "./dist"),
        libraryTarget: "commonjs",
        clean: false, // don't clean as we want both web and node builds
    },
    resolve: {
        mainFields: ["module", "main"],
        extensions: [".ts", ".js"], // support ts-files and js-files
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/, /\.test\.ts$/, /test/],
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: path.resolve(__dirname, "tsconfig.production.json"),
                        },
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
    optimization: {
        usedExports: true, // enable tree shaking
        sideEffects: false, // mark all files as side-effect free for better tree shaking
        minimize: true, // enable minification in production mode
    },
    devtool: process.env.NODE_ENV === "production" ? false : "nosources-source-map", // no source maps in production
};

module.exports = [webConfig, nodeConfig];
