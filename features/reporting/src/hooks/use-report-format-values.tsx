import { useFormatNumber, useTranslation } from '@tyro/i18n';
import {
  formatPhoneNumber,
  TableAvatar,
  TableBooleanValue,
  TablePersonAvatar,
  usePreferredNameLayout,
  RouterLink,
  PreferredNameFormat,
} from '@tyro/core';
import {
  getGroupProfileLink,
  getPersonProfileLink,
  PartyGroup,
  PartyGroupType,
  PartyPersonType,
  Person,
  PhoneNumber,
  Reporting_MetaChipSize,
  Reporting_MetaChipVariant,
  Reporting_ReportCellType,
  Reporting_TableReportField,
  SubjectGroup,
} from '@tyro/api';
import { StudentTableAvatar } from '@tyro/people';
import dayjs from 'dayjs';
import { Stack, Chip } from '@mui/material';
import { ExtendedReportData, ReportChipValue } from '../components/types';
import { getReportUrl, Report } from '../utils/get-report-url';
import { ReturnTypeFromUseRunReports } from '../api/run-report';

const getCustomLink = (
  value: ExtendedReportData[number],
  column: Reporting_TableReportField,
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

  const { profileTab, queryParams } = value.link || {};

  // for internal profile links
  if (internalUrl) {
    try {
      const basePath = [internalUrl, profileTab].filter(Boolean).join('/');
      const url = new URL(basePath, new URL(window.location.origin));

      Object.entries(queryParams || {}).forEach(([param, paramValue]) => {
        url.searchParams.append(param, String(paramValue ?? ''));
      });

      return url.toString();
    } catch (_error) {
      return null;
    }
  }

  return value.link?.externalUrl || null;
};

export const useReportFormatValues = () => {
  const { t } = useTranslation(['common']);
  const { displayName, displayNames } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();

  const getRawValue = (value: ExtendedReportData[number]) =>
    value?.value as string | number | boolean;

  const renderRawValue = (
    value: ExtendedReportData[number],
    column: Reporting_TableReportField
  ) => {
    const valueRaw = getRawValue(value);
    const toLink = getCustomLink(value, column);

    if (toLink) {
      return (
        <RouterLink
          sx={{ fontWeight: 600 }}
          to={toLink}
          target={value.link?.target || '_blank'}
        >
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
      : displayName(valueAsPerson, {
          format: PreferredNameFormat.FirstnameSurname,
        });
  };

  const renderPersonAvatar = (
    value: ExtendedReportData[number],
    column: Reporting_TableReportField
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
          target={value.link?.target || '_blank'}
        />
      );
    }

    return (
      <TablePersonAvatar
        person={valueAsPerson}
        hideAvatar={!column.meta?.showAvatar}
        to={toLink}
        target={value.link?.target || '_blank'}
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
    column: Reporting_TableReportField
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
        target={value.link?.target || '_blank'}
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
    column: Reporting_TableReportField
  ) => {
    if (!value.value) return undefined;

    const valueAsDate = dayjs(value.value as string);

    return valueAsDate.format(column.meta?.dateFormat || 'L');
  };

  const getCurrencyValue = (
    value: ExtendedReportData[number],
    column: Reporting_TableReportField
  ) => {
    const valueAsCurrency = Number(value.value as number);

    return formatCurrency(valueAsCurrency, {
      currency: column.meta?.currency || 'EUR',
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

    return [valueAsChip]
      .flat()
      .map((chip) => chip.name)
      .join(', ');
  };

  const renderChipValue = (
    value: ExtendedReportData[number],
    column: Reporting_TableReportField
  ) => {
    const valueAsChip = value.value as ReportChipValue | ReportChipValue[];

    const chips = [valueAsChip].flat();

    if (chips.length === 0) return undefined;

    return (
      <Stack gap={1} direction="row" flexWrap="wrap">
        {chips.map(({ name, color }) => (
          <Chip
            key={name}
            label={name}
            color={color || 'slate'}
            size={column.meta?.chipSize || Reporting_MetaChipSize.Small}
            variant={column.meta?.chipVariant || Reporting_MetaChipVariant.Soft}
          />
        ))}
      </Stack>
    );
  };

  const getValue = (
    column: Reporting_TableReportField,
    value: ExtendedReportData[number] | undefined
  ) => {
    if (!value) return undefined;

    switch (column.cellType) {
      case Reporting_ReportCellType.Person: {
        return getPersonValue(value);
      }
      case Reporting_ReportCellType.PartyGroup: {
        return getPartyGroupValue(value);
      }
      case Reporting_ReportCellType.Date: {
        return getDateValue(value, column);
      }
      case Reporting_ReportCellType.Currency: {
        return getCurrencyValue(value, column);
      }
      case Reporting_ReportCellType.Boolean: {
        return getBooleanValue(value);
      }
      case Reporting_ReportCellType.PhoneNumber: {
        return getPhoneNumberValue(value);
      }
      case Reporting_ReportCellType.Chip: {
        return getChipValue(value);
      }
      case Reporting_ReportCellType.Raw:
      default: {
        if (typeof value.value === 'boolean') return getBooleanValue(value);

        return getRawValue(value);
      }
    }
  };

  const renderValue = (
    column: Reporting_TableReportField,
    value: ExtendedReportData[number] | undefined
  ) => {
    if (!value) return undefined;

    switch (column.cellType) {
      case Reporting_ReportCellType.Person: {
        return renderPersonAvatar(value, column);
      }
      case Reporting_ReportCellType.PartyGroup: {
        return renderPartyGroupAvatar(value, column);
      }
      case Reporting_ReportCellType.Date: {
        return getDateValue(value, column);
      }
      case Reporting_ReportCellType.Currency: {
        return getCurrencyValue(value, column);
      }
      case Reporting_ReportCellType.Boolean: {
        return renderBooleanValue(value);
      }
      case Reporting_ReportCellType.PhoneNumber: {
        return getPhoneNumberValue(value);
      }
      case Reporting_ReportCellType.Chip: {
        return renderChipValue(value, column);
      }
      case Reporting_ReportCellType.Raw:
      default: {
        if (typeof value.value === 'boolean') return renderBooleanValue(value);

        return renderRawValue(value, column);
      }
    }
  };

  type ReportFieldMapping<T extends Record<string, any>> = {
    [K in keyof T]?: {
      textValue: string;
      typedValue: T[K];
      renderedValue: ReturnType<typeof renderValue>;
    };
  };

  const mapField = <T extends Record<string, any>>(
    reportData: ReturnTypeFromUseRunReports | null | undefined,
    options?: {
      limitData?: number;
    }
  ): ReportFieldMapping<T>[] => {
    if (!reportData) return [];

    type ColumnsByKeys = Record<keyof T, Reporting_TableReportField>;

    const columnsByKeys = (reportData?.fields || []).reduce<ColumnsByKeys>(
      (keys, field) => {
        keys[field.id as keyof T] = field;
        return keys;
      },
      {} as ColumnsByKeys
    );

    const typedData = (reportData.data || []) as Record<
      keyof T,
      ExtendedReportData[number]
    >[];

    return typedData.slice(0, options?.limitData).map((data) =>
      Object.keys(columnsByKeys).reduce((mappedField, key) => {
        const typedKey = key as keyof T;
        const currentData = data[typedKey];
        const currentColumn = columnsByKeys[typedKey];

        mappedField[typedKey] = {
          typedValue: currentData?.value as T[keyof T],
          textValue: String(getValue(currentColumn, currentData) ?? ''),
          renderedValue: renderValue(currentColumn, currentData),
        };

        return mappedField;
      }, {} as ReportFieldMapping<T>)
    );
  };

  return {
    getValue,
    renderValue,
    mapField,
  };
};
