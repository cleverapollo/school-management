import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  SmsTopUpInput,
  UseQueryReturnType,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { smsKeys } from './keys';

const smsCredit = graphql(/* GraphQL */ `
  query communications_smsCredit {
    communications_smsCredit {
      smsCredit
    }
  }
`);

const smsXeroItems = graphql(/* GraphQL */ `
  query communications_smsXeroItem {
    communications_smsXeroItem {
      code
      cost
    }
  }
`);

const smsTopUp = graphql(/* GraphQL */ `
  mutation communications_smsTopUp($input: SmsTopUpInput) {
    communications_smsTopUp(input: $input) {
      smsCredit
    }
  }
`);

const smsCreditQuery = () => ({
  queryKey: smsKeys.credit(),
  queryFn: () => gqlClient.request(smsCredit),
  staleTime: 0,
});

export function useSmsCredit() {
  return useQuery({
    ...smsCreditQuery(),
    select: ({ communications_smsCredit }) =>
      communications_smsCredit?.smsCredit ?? 0,
  });
}

export function getSmsCredit() {
  return queryClient.fetchQuery(smsCreditQuery());
}

const smsXeroItemsQuery = () => ({
  queryKey: smsKeys.xeroItems(),
  queryFn: () => gqlClient.request(smsXeroItems),
  staleTime: 1000 * 60 * 60,
});

export function useSmsXeroItems(enabled: boolean) {
  return useQuery({
    ...smsXeroItemsQuery(),
    select: ({ communications_smsXeroItem }) =>
      communications_smsXeroItem ?? [],
    enabled,
  });
}

export function useTopUpSms() {
  const { toast } = useToast();
  const { t } = useTranslation(['sms']);

  return useMutation({
    mutationFn: (input: SmsTopUpInput) =>
      gqlClient.request(smsTopUp, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(smsKeys.credit());
      toast(t('sms:smsCreditTopSuccessful'));
    },
    onError: () => {
      toast(t('sms:smsCreditTopFailed'), { variant: 'error' });
    },
  });
}

export type ReturnTypeOfUseSmsXeroItems = UseQueryReturnType<
  typeof useSmsXeroItems
>[number];