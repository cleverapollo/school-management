import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost/api/graphql',
  documents: ['packages/**/*.tsx', 'features/**/*.tsx', '!gql/**/*', '!node_modules/**/*'],
  generates: {
    './packages/api/src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
