import { Box, Chip, Stack, Typography } from '@mui/material';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { forwardRef } from 'react';
import { useMeasure } from 'react-use';
import { ListManagerState } from './state/types';

interface TeacherCardsProps {
  teachers: ListManagerState['staff'];
  isDraggingOver: boolean;
}

interface TeacherCardProps {
  teacher: NonNullable<TeacherCardsProps['teachers']>[number];
  index: number;
  numberOfTeachers: number;
}

const TeacherCard = forwardRef<HTMLDivElement, TeacherCardProps>(
  ({ teacher, index, numberOfTeachers }, ref) => {
    const { displayName } = usePreferredNameLayout();
    const name = displayName(teacher);
    const { t } = useTranslation(['common']);

    const numberOfAdditionalTeachers = numberOfTeachers - 1;
    const showAdditionalTeachersNumber =
      index === 0 && numberOfAdditionalTeachers > 0;

    return (
      <Box ref={ref}>
        <Box
          sx={{
            padding: 0.75,
            marginBottom: 0.75,
            borderRadius: 0.75,
            backgroundColor: 'slate.300',
          }}
          tabIndex={0}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              px: 1,
            }}
          >
            <Avatar
              src={teacher.avatarUrl}
              name={name}
              sx={{
                my: 0.5,
                mr: 1,
                width: 30,
                height: 30,
                fontSize: '0.625rem',
              }}
            />
            <Stack alignItems="flex-start">
              <Typography
                component="span"
                variant="subtitle2"
                sx={{ fontSize: '0.75rem', lineHeight: 1.5 }}
              >
                {name}{' '}
                {showAdditionalTeachersNumber && (
                  <span className="additional-teachers-num">
                    {`+${numberOfAdditionalTeachers}`}
                  </span>
                )}
              </Typography>
              <Chip
                label={t('common:teacher')}
                size="small"
                sx={{
                  height: 18,
                  backgroundColor: 'slate.200',
                  '& span': {
                    fontSize: '0.6875rem',
                    px: 0.75,
                    color: 'text.primary',
                    fontWeight: 600,
                  },
                }}
              />
            </Stack>
          </Box>
        </Box>
      </Box>
    );
  }
);

if (process.env.NODE_ENV === 'development') {
  TeacherCard.displayName = 'TeacherCard';
}

export function TeacherCards({ teachers, isDraggingOver }: TeacherCardsProps) {
  const [firstItemRef, { height: firstItemHeight }] =
    useMeasure<HTMLDivElement>();
  const [innerContainerRef, { height: innerContainerHeight }] = useMeasure();
  if (teachers?.length === 0) return null;

  return (
    <Box
      sx={{
        height: firstItemHeight + 6,
        transitionProperty: 'height',
        overflow: 'hidden',
        '&, & .additional-teachers-num': {
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '150ms',
        },
        '& .additional-teachers-num': {
          transitionProperty: 'opacity',
        },
        ...(!isDraggingOver && {
          '&:hover, &:focus-within': {
            height: innerContainerHeight + 6,

            '& .additional-teachers-num': {
              opacity: 0,
            },
          },
        }),
      }}
    >
      <Box ref={innerContainerRef}>
        {teachers?.map((teacher, index) => (
          <TeacherCard
            ref={index === 0 ? firstItemRef : undefined}
            key={teacher.partyId}
            teacher={teacher}
            index={index}
            numberOfTeachers={teachers.length}
          />
        ))}
      </Box>
    </Box>
  );
}
