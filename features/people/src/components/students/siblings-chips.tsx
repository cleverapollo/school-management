import { alpha, Chip } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Avatar, usePreferredNameLayout, stringToColor } from '@tyro/core';
import { Link } from 'react-router-dom';
import { Colour } from '@tyro/api';
import { ReturnTypeFromUseStudentPersonal } from '../../api/student/personal';

interface SiblingsChipsProps {
  siblings: ReturnTypeFromUseStudentPersonal['siblings'];
}

export function SiblingsChips({ siblings }: SiblingsChipsProps) {
  const { t } = useTranslation(['common']);
  const { displayName } = usePreferredNameLayout();

  if (
    siblings?.enrolledSiblings.length === 0 &&
    siblings?.nonEnrolledSiblings.length === 0
  ) {
    return <Chip label={t('common:noSiblingsRegisteredAtThisSchool')} />;
  }

  return (
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
  );
}
