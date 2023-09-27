import { alpha, Chip, Tooltip } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  Avatar,
  usePreferredNameLayout,
  IconChip,
  useDisclosure,
  getColorBasedOnString,
  getBaseColorBasedOnString,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import { GearIcon } from '@tyro/icons';
import { ReturnTypeFromUseStudentPersonal } from '../../../api/student/personal';
import { ManageSiblingModal } from '../manage-sibling-modal';

interface SiblingsChipsProps {
  currentStudent: ReturnTypeFromUseStudentPersonal['person'];
  siblings: ReturnTypeFromUseStudentPersonal['siblings'];
}

export function SiblingsChips({
  currentStudent,
  siblings,
}: SiblingsChipsProps) {
  const { t } = useTranslation(['common', 'people']);
  const { displayName } = usePreferredNameLayout();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const hasNoSiblings =
    siblings?.enrolledSiblings.length === 0 &&
    siblings?.nonEnrolledSiblings.length === 0;

  return (
    <>
      {hasNoSiblings ? (
        <Chip label={t('common:noSiblingsRegisteredAtThisSchool')} />
      ) : (
        <>
          {siblings?.enrolledSiblings.map(({ partyId, person }) => {
            const name = displayName(person);
            const color = getColorBasedOnString(name);
            const colorKey = getBaseColorBasedOnString(name);

            return (
              <Chip
                avatar={<Avatar name={name} src={person.avatarUrl} />}
                component={Link}
                to={`/people/students/${partyId}`}
                key={partyId}
                label={name}
                variant="soft"
                sx={({ palette }) => ({
                  color: 'text.primary',
                  cursor: 'pointer',
                  backgroundColor: alpha(palette[colorKey][500], 0.16),
                  '&:hover': {
                    backgroundColor: alpha(palette[colorKey][500], 0.32),
                  },

                  '& .MuiChip-avatar': {
                    color: 'white',
                    backgroundColor: color,
                  },
                })}
              />
            );
          })}
          {siblings?.nonEnrolledSiblings.map((sibling) => {
            const name = displayName(sibling);
            const colorKey = getBaseColorBasedOnString(name);

            return (
              <Chip
                key={sibling.partyId}
                label={name}
                sx={({ palette }) => ({
                  color: 'text.primary',
                  backgroundColor: alpha(palette[colorKey][500], 0.16),
                })}
              />
            );
          })}
        </>
      )}
      <Tooltip title={t('people:manageSiblings')}>
        <IconChip
          aria-label={t('people:manageSiblings')}
          icon={<GearIcon />}
          onClick={() => onOpen()}
        />
      </Tooltip>
      <ManageSiblingModal
        open={isOpen}
        onClose={() => onClose()}
        currentStudent={currentStudent}
        currentSiblings={
          siblings ?? { enrolledSiblings: [], nonEnrolledSiblings: [] }
        }
      />
    </>
  );
}
