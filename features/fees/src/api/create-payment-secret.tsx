import { gqlClient, graphql, MakePaymentInput } from '@tyro/api';

const createPayment = graphql(/* GraphQL */ `
  mutation createPayment($input: MakePaymentInput) {
    fees_createPayment(input: $input) {
      clientSecret
    }
  }
`);

export function getPaymentSecret(input: MakePaymentInput) {
  return gqlClient.request(createPayment, { input });
}
