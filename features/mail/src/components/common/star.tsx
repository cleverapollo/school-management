import { Checkbox, Tooltip } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { StarIcon } from '@tyro/icons';
import {
  ReturnTypeUseMail,
  ReturnTypeUseMailList,
  useStarMail,
} from '../../api/mails';

interface StarMailProps {
  isStarred: boolean;
  mail: ReturnTypeUseMailList | ReturnTypeUseMail | undefined;
}

export function StarMail({ isStarred, mail }: StarMailProps) {
  const { t } = useTranslation(['mail']);

  const { mutate: starMail } = useStarMail();
  const onToggleStarred = () => {
    if (mail) {
      starMail({
        mailId: mail.id,
        threadId: mail.threadId,
        starred: !mail.starred,
      });
    }
  };

  return (
    <Tooltip
      title={
        isStarred
          ? t('mail:tooltipTitles.starred')
          : t('mail:tooltipTitles.notStarred')
      }
    >
      <Checkbox
        color="warning"
        onChange={onToggleStarred}
        checked={isStarred}
        icon={<StarIcon />}
        checkedIcon={
          <StarIcon
            sx={{
              '& path': {
                fill: 'currentcolor',
              },
            }}
          />
        }
      />
    </Tooltip>
  );
}
