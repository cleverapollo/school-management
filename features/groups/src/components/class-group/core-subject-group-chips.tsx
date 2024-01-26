import { alpha, Chip, Tooltip } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { IconChip, useDisclosure, getBaseColorBasedOnString } from '@tyro/core';
import { GearIcon } from '@tyro/icons';

import { ReturnTypeFromUseClassGroupById } from '../../api/class-groups';
import { ManageCoreSubjectGroupsModal } from './manage-core-subject-groups-modal';

interface CoreSubjectGroupChipsProps {
  subjectGroups: ReturnTypeFromUseClassGroupById['relatedSubjectGroups'];
  classGroupId: number;
}

export function CoreSubjectGroupChips({
  subjectGroups,
  classGroupId,
}: CoreSubjectGroupChipsProps) {
  const { t } = useTranslation(['common', 'groups']);
  const { isOpen, onClose, onOpen } = useDisclosure();

  if (subjectGroups?.length === 0) {
    return <Chip label={t('common:noSiblingsRegisteredAtThisSchool')} />;
  }

  return (
    <>
      {subjectGroups.map((subjectGroup) => {
        const { name } = subjectGroup;
        const colorKey = getBaseColorBasedOnString(name);

        return (
          <Chip
            key={name}
            label={name}
            sx={({ palette }) => ({
              color: 'text.primary',
              backgroundColor: alpha(palette[colorKey][500], 0.16),
            })}
          />
        );
      })}
      <Tooltip title={t('groups:manageCoreSubjectGroups')}>
        <IconChip
          aria-label={t('groups:manageCoreSubjectGroups')}
          icon={<GearIcon />}
          onClick={() => onOpen()}
        />
      </Tooltip>
      <ManageCoreSubjectGroupsModal
        open={isOpen}
        classGroupId={classGroupId}
        onClose={() => onClose()}
        currentCoreSubjectGroupString={
          subjectGroups.map((b) => b.partyId) ?? []
        }
      />
    </>
  );
}
