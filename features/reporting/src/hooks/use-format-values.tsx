import { useFormatNumber, useTranslation } from '@tyro/i18n';
import {
  formatPhoneNumber,
  TableAvatar,
  TableBooleanValue,
  TablePersonAvatar,
  usePreferredNameLayout,
  RouterLink,
} from '@tyro/core';
import {
  getGroupProfileLink,
  getPersonProfileLink,
  PartyGroup,
  PartyGroupType,
  PartyPersonType,
  Person,
  PhoneNumber,
  SubjectGroup,
} from '@tyro/api';
import { StudentTableAvatar } from '@tyro/people';
import dayjs from 'dayjs';
import { Stack, Chip } from '@mui/material';
import {
  ExtendedReportData,
  ExtendedTableReportField,
  ReportChipValue,
} from '../components/types';
import { getReportUrl, Report } from '../utils/get-report-url';

const getCustomLink = (
  value: ExtendedReportData[number],
  column: ExtendedTableReportField,
  internalUrl?: string | null
) => {
  if (!column.meta?.enableLink) return null;

  const { report, reportFilters, reportTab } = value.link || {};

  // for report links
  if (report) {
    switch (report) {
      case Report.OCTOBER_RETURNS: {
        return getReportUrl({ report, tab: reportTab });
      }
      case Report.STUDENT_BEHAVIOUR: {
        return getReportUrl({
          report,
          filters: {
            ...reportFilters,
            to_date: dayjs(reportFilters?.to_date as string),
            from_date: dayjs(reportFilters?.from_date as string),
          },
        });
      }
      default:
        return getReportUrl({ report });
    }
  }

  const { profileTab, searchParams } = value.link || {};

  // for internal profile links
  if (internalUrl) {
    try {
      const basePath = [internalUrl, profileTab].filter(Boolean).join('/');
      const url = new URL(basePath, new URL(window.location.origin));

      Object.entries(searchParams || {}).forEach(([param, paramValue]) => {
        url.searchParams.append(param, String(paramValue ?? ''));
      });

      return url.toString();
    } catch (_error) {
      return null;
    }
  }

  return value.link?.externalUrl || null;
};

export const useFormatTableValues = () => {
  const { t } = useTranslation(['common']);
  const { displayName, displayNames } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();

  const getRawValue = (value: ExtendedReportData[number]) =>
    value?.value as string | number | boolean;

  const renderRawValue = (
    value: ExtendedReportData[number],
    column: ExtendedTableReportField
  ) => {
    const valueRaw = getRawValue(value);
    const toLink = getCustomLink(value, column);

    if (toLink) {
      return (
        <RouterLink sx={{ fontWeight: 600 }} to={toLink}>
          {valueRaw}
        </RouterLink>
      );
    }

    return valueRaw;
  };

  const getPersonValue = (value: ExtendedReportData[number]) => {
    const valueAsPerson = value.value as Person | Person[];

    return Array.isArray(valueAsPerson)
      ? displayNames(valueAsPerson)
      : displayName(valueAsPerson);
  };

  const renderPersonAvatar = (
    value: ExtendedReportData[number],
    column: ExtendedTableReportField
  ) => {
    const valueAsPerson = value.value as Person | Person[];

    if (Array.isArray(valueAsPerson)) {
      return displayNames(valueAsPerson);
    }

    const profileLink = getPersonProfileLink(valueAsPerson);
    const toLink = getCustomLink(value, column, profileLink);

    if (valueAsPerson.type === PartyPersonType.Student) {
      return (
        <StudentTableAvatar
          person={valueAsPerson}
          isPriorityStudent={Boolean(value.meta?.isPriorityStudent)}
          hasSupportPlan={false}
          size={column.meta?.avatarSize ?? undefined}
          hideAvatar={!column.meta?.showAvatar}
          to={toLink}
        />
      );
    }

    return (
      <TablePersonAvatar
        person={valueAsPerson}
        hideAvatar={!column.meta?.showAvatar}
        to={toLink}
        AvatarProps={{
          size: column.meta?.avatarSize ?? undefined,
        }}
      />
    );
  };

  const getPartyGroupValue = (value: ExtendedReportData[number]) => {
    const valueAsPartyGroup = value.value as PartyGroup;

    return valueAsPartyGroup.name;
  };

  const renderPartyGroupAvatar = (
    value: ExtendedReportData[number],
    column: ExtendedTableReportField
  ) => {
    const valueAsPartyGroup = value.value as PartyGroup & {
      type: PartyGroupType;
    };

    const profileLink = getGroupProfileLink(valueAsPartyGroup);
    const toLink = getCustomLink(value, column, profileLink);

    const subject = (valueAsPartyGroup as unknown as SubjectGroup)
      ?.subjects?.[0];
    const bgColorStyle = subject?.colour
      ? { bgcolor: `${subject.colour}.500` }
      : {};

    return (
      <TableAvatar
        name={valueAsPartyGroup.name}
        avatarUrl={valueAsPartyGroup.avatarUrl}
        hideAvatar={!column.meta?.showAvatar}
        to={toLink}
        AvatarProps={{
          size: column.meta?.avatarSize ?? undefined,
          sx: {
            borderRadius: 1,
            ...bgColorStyle,
          },
        }}
      />
    );
  };

  const getDateValue = (
    value: ExtendedReportData[number],
    column: ExtendedTableReportField
  ) => {
    const valueAsDate = dayjs(value.value as string);

    return valueAsDate.format(column.meta?.dateFormat);
  };

  const getCurrencyValue = (
    value: ExtendedReportData[number],
    column: ExtendedTableReportField
  ) => {
    const valueAsCurrency = Number(value.value as number);

    return formatCurrency(valueAsCurrency, {
      currency: column.meta?.currency,
    });
  };

  const getBooleanValue = (value: ExtendedReportData[number]) => {
    const valueAsBoolean = Boolean(value.value);

    return valueAsBoolean ? t('common:yes') : t('common:no');
  };

  const renderBooleanValue = (value: ExtendedReportData[number]) => (
    <Stack alignItems="center">
      <TableBooleanValue value={Boolean(value.value)} />
    </Stack>
  );

  const getPhoneNumberValue = (value: ExtendedReportData[number]) =>
    formatPhoneNumber(value.value as PhoneNumber);

  const getChipValue = (value: ExtendedReportData[number]) => {
    const valueAsChip = value.value as ReportChipValue | ReportChipValue[];

    return [valueAsChip].flat().map((chip) => chip.name);
  };

  const renderChipValue = (
    value: ExtendedReportData[number],
    column: ExtendedTableReportField
  ) => {
    const valueAsChip = value.value as ReportChipValue | ReportChipValue[];

    const chips = [valueAsChip].flat();

    if (chips.length === 0) return '-';

    return (
      <Stack gap={1} my={1} direction="row" flexWrap="wrap">
        {chips.map(({ name, color }) => (
          <Chip
            key={name}
            label={name}
            color={color || 'slate'}
            size={column.meta?.chipSize || 'small'}
            variant={column.meta?.chipVariant || 'soft'}
          />
        ))}
      </Stack>
    );
  };

  return {
    valueGetters: {
      getRawValue,
      getPersonValue,
      getPartyGroupValue,
      getDateValue,
      getCurrencyValue,
      getBooleanValue,
      getPhoneNumberValue,
      getChipValue,
    },
    cellRenders: {
      renderRawValue,
      renderPersonAvatar,
      renderPartyGroupAvatar,
      renderBooleanValue,
      renderChipValue,
    },
  };
};
