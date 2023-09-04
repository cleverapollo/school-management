/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@mui/material';
import { PageContainer, PageHeading } from '@tyro/core';
import { Mail as MailType, UnreadCountFilter, useUser } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
// sections
import { useLabels, useUnreadCount } from '../api/labels';
import { MailLabel, Mails } from '../types';
import { LabelType } from '../constants';

export default function Mail() {
  const { t } = useTranslation(['mail', 'navigation']);
  const { mailId } = useParams();
  const [labels, setLabels] = useState<MailLabel[]>([]);
  const { isLoading: isLoadingLabels, data: labelsData } = useLabels();
  const [mail, setMail] = useState<MailType | null>(null);
  const [activeLabelName, setActiveLabelName] = useState<string>('');
  const [mails, setMails] = useState<Mails>({ byId: {}, allIds: [] });

  const { activeProfile } = useUser();

  const { data: unreadCountData } = useUnreadCount(
    activeProfile?.partyId
      ? {
          personPartyId: activeProfile?.partyId,
        }
      : null
  );

  useEffect(() => {
    if (labelsData?.length) {
      setActiveLabelName(labelsData[0].name);
      const starredLabel: MailLabel = {
        originalId: 0,
        id: 'starred',
        name: 'Starred',
        type: LabelType.SYSTEM,
        unreadCount: 0,
      };
      const updatedLabelsData = labelsData.map((label) => {
        if (
          unreadCountData?.unreadCount?.filter(
            (item) => item?.labelId === label?.originalId
          ).length
        ) {
          return {
            ...label,
            unreadCount:
              unreadCountData?.unreadCount?.filter(
                (item) => item?.labelId === label?.originalId
              )[0]?.count || label.unreadCount,
          };
        }
        return label;
      });
      setLabels([...updatedLabelsData, starredLabel]);
    }
  }, [labelsData, unreadCountData]);

  useEffect(() => {
    if (mailId) {
      setMail(mails.byId[mailId]);
    }
  }, [mailId, mails]);

  const [openSidebar, setOpenSidebar] = useState(false);

  const [openCompose, setOpenCompose] = useState(false);

  return (
    <PageContainer title={t('mail:mail')}>
      <PageHeading title={t('mail:mail')} titleProps={{ variant: 'h3' }} />
      <Card
        sx={{
          minHeight: 480,
          height: { md: '72vh' },
          display: { md: 'flex' },
        }}
      >
        {/* <MailSidebar
            isOpenSidebar={openSidebar}
            onCloseSidebar={() => setOpenSidebar(false)}
            onOpenCompose={() => setOpenCompose(true)}
            labels={labels}
            activeLabelName={activeLabelName}
            setActiveLabelName={setActiveLabelName}
            setMails={setMails}
          />
          {mailId ? (
            <MailDetails
              mail={mail}
              activeLabelName={activeLabelName}
              labels={labels}
            />
          ) : (
            <MailList
              mails={mails}
              labels={labelsData}
              onOpenSidebar={() => setOpenSidebar(true)}
              activeLabelName={activeLabelName}
            />
          )}
          <MailCompose
            isOpenCompose={openCompose}
            onCloseCompose={() => setOpenCompose(false)}
          /> */}
      </Card>
    </PageContainer>
  );
}
