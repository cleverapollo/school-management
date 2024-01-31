import { useFormatNumber, useTranslation } from '@tyro/i18n';
import {
  formatPhoneNumber,
  TableAvatar,
  TableBooleanValue,
  TablePersonAvatar,
  usePreferredNameLayout,
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

export const useFormatTableValues = () => {
  const { t } = useTranslation(['common']);
  const { displayName, displayNames } = usePreferredNameLayout();
  const { formatCurrency } = useFormatNumber();

  const getRawValue = (value: ExtendedReportData[number]) =>
    value?.value as string | number | boolean;

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
    if (!column.meta?.showAvatar) {
      return getPersonValue(value);
    }
    const valueAsPerson = value.value as Person | Person[];

    if (Array.isArray(valueAsPerson)) {
      return displayNames(valueAsPerson);
    }

    const toLink = column.meta?.enableLink
      ? getPersonProfileLink(valueAsPerson)
      : undefined;

    if (valueAsPerson.type === PartyPersonType.Student) {
      return (
        <StudentTableAvatar
          person={valueAsPerson}
          isPriorityStudent={Boolean(value.meta?.isPriorityStudent)}
          hasSupportPlan={false}
          size={column.meta?.avatarSize ?? undefined}
          to={toLink}
        />
      );
    }

    return (
      <TablePersonAvatar
        person={valueAsPerson}
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
    if (!column.meta?.showAvatar) {
      return getPartyGroupValue(value);
    }

    const valueAsPartyGroup = value.value as PartyGroup & {
      type: PartyGroupType;
    };

    const toLink = column.meta?.enableLink
      ? getGroupProfileLink(valueAsPartyGroup)
      : undefined;

    const subject = (valueAsPartyGroup as unknown as SubjectGroup)
      ?.subjects?.[0];
    const bgColorStyle = subject?.colour
      ? { bgcolor: `${subject.colour}.500` }
      : {};

    return (
      <TableAvatar
        name={valueAsPartyGroup.name}
        avatarUrl={valueAsPartyGroup.avatarUrl}
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
            color={color ?? 'slate'}
            size={column.meta?.chipSize}
            variant={column.meta?.chipVariant}
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
      renderPersonAvatar,
      renderPartyGroupAvatar,
      renderBooleanValue,
      renderChipValue,
    },
  };
};
