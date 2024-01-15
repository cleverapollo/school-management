export const infoRequestKeys = {
  all: ['info-request'] as const,
  list: (filter: Forms_InformationRequestListFormFilter) =>
    [...infoRequestKeys.all, 'list', filter] as const,
  setup: (filter: Forms_InformationRequestViewFormFilter) =>
    [...infoRequestKeys.all, 'setup', filter] as const,
};
