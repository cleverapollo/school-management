import { alpha, Chip, Tooltip } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  Avatar,
  usePreferredNameLayout,
  stringToColor,
  IconChip,
  useDisclosure,
} from '@tyro/core';
import { Link } from 'react-router-dom';
import { Colour } from '@tyro/api';
import { GearIcon } from '@tyro/icons';
import { ReturnTypeFromUseStudentPersonal } from '../../../api/student/personal';
import { ManageSiblingModal } from '../manage-sibling-modal';

interface SiblingsChipsProps {
  studentId: number;
  siblings: ReturnTypeFromUseStudentPersonal['siblings'];
}

export function SiblingsChips({ studentId, siblings }: SiblingsChipsProps) {
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
            const color = stringToColor(name);
            const colorKey = color.split('.')[0] as Colour;

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
            const color = stringToColor(name);
            const colorKey = color.split('.')[0] as Colour;

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
        studentId={studentId}
        currentSiblings={
          siblings ?? { enrolledSiblings: [], nonEnrolledSiblings: [] }
        }
      />
    </>
  );
}
