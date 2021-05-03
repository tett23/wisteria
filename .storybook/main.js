module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config, _) => {
    config.module.rules = config.module.rules.filter(
      (f) => f.test.toString() !== '/\\.css$/',
    );
    config.module.rules.push({
      test: /\.css$/,
      sideEffects: true,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('tailwindcss')('./tailwind.config.js'),
                require('autoprefixer'),
              ],
            },
          },
        },
      ],
    });

    return config;
  },
  babel: async (options) => ({
    ...options,
    presets: [
      ...options.presets,
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
        'preset-react-jsx-transform',
      ],
    ],
  }),
};
