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
            padding: 1,
            marginBottom: 1,
            borderRadius: 1,
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
                mr: 1.5,
              }}
            />
            <Stack alignItems="flex-start">
              <Typography component="span" variant="subtitle1">
                {name}{' '}
                {showAdditionalTeachersNumber && (
                  <span className="additional-teachers-num">
                    {`+${numberOfAdditionalTeachers}`}
                  </span>
                )}
              </Typography>
              <Chip
                label={t('common:classTeacher')}
                size="small"
                sx={{
                  backgroundColor: 'slate.200',
                  '& span': {
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
        height: firstItemHeight + 8,
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
            height: innerContainerHeight + 8,

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
