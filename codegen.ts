import { CodegenConfig } from '@graphql-codegen/cli';

if (!process.env.token) {
  throw new Error('You must pass in a auth token. Please re-run the command like `token=[token] yarn run codegen`')
}

const config: CodegenConfig = {
  schema: [
    {
      'http://localhost:80/api/graphql': {
        headers: {
          Authorization: `Bearer ${process.env.token}`,
        },
      },
    },
  ],
  documents: ['packages/**/*.tsx', 'features/**/*.tsx', 'src/**/*.tsx', '!gql/**/*', '!node_modules/**/*'],
  generates: {
    './packages/api/src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
