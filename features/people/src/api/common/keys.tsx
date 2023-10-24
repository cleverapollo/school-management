export const peopleCommonKeys = {
  personalTitles: ['personal', 'titles'] as const,
  partySearch: (query: string) => ['partySearch', query] as const,
};
