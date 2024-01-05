import {
  alpha,
  Box,
  Card,
  Grid,
  Stack,
  Theme,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { SelectListDropArea } from './drop-area';
import { SelectionListProvider } from './store';

type SelectionListProps<T extends object | string> = {
  value: T[];
  onChange: (value: T[]) => void;
  options: T[];
  optionIdKey?: T extends object
    ? keyof T | ((option: T) => string)
    : (option: T) => string;
  optionTextKey?: T extends object ? keyof T : never;
  groupBy?: T extends object
    ? keyof T | ((option: T) => string)
    : (option: T) => string;
  collapsibleGroups?: boolean;
  getOptionLabel?: (option: T) => string;
  showSearch?: boolean;
  firstColumnLabel?: string;
  secondColumnLabel?: string;
  selectedCountLabel?: (count: number) => string;
  firstColumnHeader?: React.ReactNode;
  secondColumnHeader?: React.ReactNode;
  firstColumnEmptyMessage?: string;
  secondColumnEmptyMessage?: string;
  isLoading?: boolean;
};

const getOuterContainerStyle = (anyHasColumnHeader: boolean, theme: Theme) => ({
  ...(anyHasColumnHeader && {
    backgroundColor: 'slate.50',
    p: 1.5,
    pt: 2,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'indigo.50',
    boxShadow: `0px 1px 6px ${alpha(theme.palette.indigo[500], 0.1)}`,
  }),
});

export const SelectionList = <T extends object | string>({
  value,
  onChange,
  options,
  optionIdKey,
  optionTextKey,
  groupBy,
  collapsibleGroups,
  getOptionLabel: externalGetOptionLabel,
  showSearch,
  firstColumnLabel,
  secondColumnLabel,
  selectedCountLabel,
  firstColumnHeader,
  secondColumnHeader,
  firstColumnEmptyMessage,
  secondColumnEmptyMessage,
  isLoading,
}: SelectionListProps<T>) => {
  const { t } = useTranslation(['common']);
  const hasColumnHeader = Boolean(firstColumnHeader || secondColumnHeader);
  const theme = useTheme();

  return (
    <SelectionListProvider
      value={value}
      onChange={onChange}
      options={options}
      optionIdKey={optionIdKey}
      optionTextKey={optionTextKey}
      getOptionLabel={externalGetOptionLabel}
      groupBy={groupBy}
      collapsibleGroups={collapsibleGroups}
      showSearch={showSearch}
    >
      <Card
        component={Stack}
        variant="soft"
        sx={{
          backgroundColor: 'slate.100',
          boxShadow: 'none',
          p: 1.5,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography component="h3" variant="h6" ml={1.5} lineHeight={2.6}>
              {firstColumnLabel ?? t('common:unselected')}
            </Typography>
            <Stack
              sx={getOuterContainerStyle(hasColumnHeader, theme)}
              spacing={2}
            >
              {firstColumnHeader}
              <SelectListDropArea
                droppableId="unselected"
                isLoading={isLoading}
                emptyMessage={
                  firstColumnEmptyMessage ?? t('common:noItemsToSelect')
                }
              />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
              mx={1.5}
            >
              <Typography component="h3" variant="h6" lineHeight={2.6}>
                {secondColumnLabel ?? t('common:selected')}
              </Typography>
              <Typography component="span" color="text.secondary" fontSize={14}>
                <Typography
                  component="span"
                  color="primary"
                  fontWeight={600}
                  fontSize={14}
                >
                  {t('common:addedToGroup')}
                </Typography>{' '}
                <Box component="span" sx={{ mx: 0.5 }}>
                  &bull;
                </Box>{' '}
                {typeof selectedCountLabel === 'function'
                  ? selectedCountLabel(value.length)
                  : t('common:items', { count: value.length ?? 0 })}
              </Typography>
            </Stack>
            <Stack
              sx={getOuterContainerStyle(hasColumnHeader, theme)}
              spacing={2}
            >
              {secondColumnHeader}
              <SelectListDropArea
                droppableId="selected"
                emptyMessage={
                  secondColumnEmptyMessage ?? t('common:noItemsSelected')
                }
              />
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </SelectionListProvider>
  );
};
