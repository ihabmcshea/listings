// cypress.config.ts

import { defineConfig } from 'cypress';
import webpackPreprocessor from '@cypress/webpack-preprocessor';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implement node event listeners here
      const options = {
        webpackOptions: {
          resolve: {
            extensions: ['.ts', '.js'],
          },
          module: {
            rules: [
              {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: [
                  {
                    loader: 'ts-loader',
                  },
                ],
              },
            ],
          },
        },
      };
      on('file:preprocessor', webpackPreprocessor(options));

      return config;
    },
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/integration/**/*.spec.ts',
  },
});
