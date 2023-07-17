import { Box, Card, CardHeader, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { Link } from 'react-router-dom';
import { useStudentMedicalData } from '../../../api/student/medicals/student-medical-data';

type StudentSiblingsWidgetProps = {
  studentId: number | undefined;
};

export function SiblingsWidget({ studentId }: StudentSiblingsWidgetProps) {
  const { t } = useTranslation(['common', 'people']);
  const { displayName } = usePreferredNameLayout();
  const { data: medicalData } = useStudentMedicalData(studentId ?? 0);

  const numberOfSiblings =
    medicalData?.student?.siblings?.enrolledSiblings?.length;

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
      <CardHeader component="h3" title={t('people:siblingsInSchool')} />
      {!numberOfSiblings || numberOfSiblings === 0 ? (
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 1.75,
            borderBottom: 'none',

            borderColor: 'divider',
          }}
        >
          <Chip label={t('common:noSiblingsRegisteredAtThisSchool')} />
        </Stack>
      ) : (
        <>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 3,
              py: 1.75,
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

          <Box>
            {medicalData?.student?.siblings?.enrolledSiblings.map(
              ({ partyId, person, classGroup }) => {
                const name = displayName(person);

                return (
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 3,
                      py: 2,
                    }}
                    key={partyId}
                  >
                    <Box
                      component={Link}
                      to={`/people/students/${partyId}`}
                      sx={{
                        display: 'flex',
                        direction: 'row',
                        alignItems: 'center',
                        textDecoration: 'none',
                      }}
                    >
                      <Avatar name={name} src={person.avatarUrl} />
                      <Typography
                        component="h4"
                        variant="subtitle2"
                        sx={{
                          ml: 1,
                          color: 'text.primary',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {name}
                      </Typography>
                    </Box>

                    <Typography component="h4" variant="subtitle2" noWrap>
                      {classGroup?.name}
                    </Typography>
                  </Stack>
                );
              }
            )}
          </Box>
        </>
      )}
    </Card>
  );
}
