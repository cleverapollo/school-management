import {
  Card,
  CardHeader,
  Chip,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Avatar, stringToColor, usePreferredNameLayout } from '@tyro/core';
import { Colour } from '@tyro/api';
import { Link } from 'react-router-dom';
import { useStudentMedical } from '../../../api/student/medical';

interface StudentContactsWidgetProps {
  studentId: number | undefined;
}

export function SiblingsWidget({ studentId }: StudentContactsWidgetProps) {
  const { t } = useTranslation(['common', 'people']);
  const { displayName } = usePreferredNameLayout();

  const { data: medicalData } = useStudentMedical(studentId ?? 0);

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      <CardHeader component="h3" title="Siblings in school" />

      <>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography component="h4" variant="subtitle2" noWrap>
            {t('common:name')}
          </Typography>
          <Typography component="h4" variant="subtitle2" noWrap>
            {t('common:classGroup')}
          </Typography>
        </Stack>

        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2,
          }}
        >
          {!medicalData?.student?.siblings?.enrolledSiblings ||
          medicalData?.student?.siblings?.enrolledSiblings.length === 0 ? (
            <Chip label={t('common:noSiblingsRegisteredAtThisSchool')} />
          ) : (
            medicalData?.student?.siblings?.enrolledSiblings.map(
              ({ partyId, person, classGroup }) => {
                const name = displayName(person);
                const color = stringToColor(name);
                const colorKey = color.split('.')[0] as Colour;

                return (
                  <>
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
                    <Typography component="h4" variant="subtitle2" noWrap>
                      {classGroup?.name}
                    </Typography>
                  </>
                );
              }
            )
          )}
        </Stack>
      </>
    </Card>
  );
}
