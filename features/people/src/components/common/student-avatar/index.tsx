import { useDisclosure } from '@tyro/core';
import { IconButton, IconButtonProps } from '@mui/material';
// import { useTranslation } from '@tyro/i18n';
import { memo } from 'react';
import {
  StudentAvatarPicture,
  StudentAvatarPictureProps,
} from './student-avatar-picture';
import { NeedToKnowModal } from './need-to-know-modal';

interface StudentAvatarProps extends StudentAvatarPictureProps {
  partyId: number;
  ContainingButtonProps?: IconButtonProps;
}

export function StudentAvatarInner({
  ContainingButtonProps,
  ...props
}: StudentAvatarProps) {
  // const { t } = useTranslation(['people']); // Commenting out this line as it's causing infinite loop on assessment results
  const { getButtonProps, getDisclosureProps } = useDisclosure();

  return (
    <>
      <IconButton
        disabled={!props.isPriorityStudent && !props.hasSupportPlan}
        // aria-label={t('people:studentClickableAvatarAria', {
        //   name: props.name,
        // })}
        {...ContainingButtonProps}
        sx={{
          ...(ContainingButtonProps?.sx ?? {}),
          padding: 0,
          '&:hover': {
            boxShadow: '0px 0px 0px 8px rgba(71, 85, 105, 0.08)',
            backgroundColor: 'transparent',
          },
        }}
        {...getButtonProps()}
      >
        <StudentAvatarPicture {...props} />
      </IconButton>
      <NeedToKnowModal
        {...getDisclosureProps()}
        studentPartyId={props.partyId}
      />
    </>
  );
}

export const StudentAvatar = memo(StudentAvatarInner);
