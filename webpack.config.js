const path = require('path');

const tsConfigPath = path.join(__dirname, 'tsconfig.json');

const config = {
  target: 'node',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  // 不打包
  externals: {
    vscode: 'commonjs vscode',
    prettier: 'commonjs prettier',
    'copy-paste': 'commonjs copy-paste',
    'typescript-json-schema': 'commonjs2 typescript-json-schema',
    // 'ts-json-schema-generator': 'cmmonjs ts-json-schema-generator'
    // axios: 'commonjs axios',
    // ejs:'commonjs ejs',
    // 'generate-schema':'commonjs generate-schema',
    // 'is-url':'commonjs is-url',
    // 'json-schema-to-typescript':'commonjs json-schema-to-typescript',
    // 'quicktype-core':'commonjs quicktype-core',
    // 'strip-comments':'commonjs strip-comments'
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: tsConfigPath,
            },
          },
        ],
      },
    ],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  return config;
};
