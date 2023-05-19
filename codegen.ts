import { CodegenConfig } from '@graphql-codegen/cli';

if (!process.env.token) {
  throw new Error('You must pass in a auth token. Please re-run the command like `token=[token] yarn run codegen`')
}

const config: CodegenConfig = {
  // schema: 'introspec.json',
  schema: [
    {
      // 'http://localhost:80/api/tyrogql': {
      'https://tyro-api-uat.azurewebsites.net/api/tyrogql': {
        headers: {
          Authorization: `Bearer ${process.env.token}`,
        },
      },
    },
  ],
  documents: [
    'packages/**/*.tsx',
    'features/**/*.tsx',
    'src/**/*.tsx',
    '!gql/**/*',
    '!node_modules/**/*',
    '!features/**/node_modules/**/*',
    '!packages/**/node_modules/**/*',
  ],
  generates: {
    './packages/api/src/gql/': {
      preset: 'client',
      plugins: [],
      config: {
        scalars: {
          Long: 'number',
          Date: 'string',
          DateTime: 'string',
          Time: 'string',
          BigDecimal: 'number',
        },
      },
    },
  },
};

export default config;
