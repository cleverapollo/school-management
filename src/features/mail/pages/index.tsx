import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Card } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { MailList, MailDetails, MailSidebar, MailCompose } from '../components';
import { useLabels, useUnreadCount } from '../api/labels';
import { MailLabel, Mails } from '../types';
import { Mail as MailType, UnreadCountFilter, useUser } from '@tyro/api';
import { LABEL_TYPE } from '../constants';

// ----------------------------------------------------------------------

export default function Mail() {
  const { themeStretch } = useSettings();

  const { mailId } = useParams();
  const [labels, setLabels] = useState<MailLabel[]>([]);
  const { isLoading: isLoadingLabels, data: labelsData } = useLabels();
  const [mail, setMail] = useState<MailType | null>(null);
  const [activeLabelName, setActiveLabelName] = useState<string>('');
  const [mails, setMails] = useState<Mails>({ byId: {}, allIds: [] });

  const { activeProfile } = useUser();

  const filter: UnreadCountFilter = useMemo(() => ({
    personPartyId: activeProfile?.partyId
  }), [activeProfile]);

  const { data: unreadCountData } = useUnreadCount(filter);

  useEffect(() => {
    if (labelsData?.length) {
      setActiveLabelName(labelsData[0].name);
      const starredLabel: MailLabel = {
        originalId: 0,
        id: 'starred',
        name: 'Starred',
        type: LABEL_TYPE.SYSTEM,
        unreadCount: 0,
      };
      const updatedLabelsData = labelsData.map(label => { 
        if (unreadCountData?.unreadCount?.filter(item => item?.labelId === label?.originalId).length) { 
          return { ...label, 
            unreadCount: unreadCountData?.unreadCount?.filter(item => item?.labelId === label?.originalId)[0]?.count || label.unreadCount }
          }; 
        return label;
      });
      setLabels([...updatedLabelsData, starredLabel]);
    }
  }, [labelsData, unreadCountData]);

  useEffect(() => {
    if(mailId) {
      setMail(mails.byId[mailId]);
    }
  }, [mailId, mails]);


  const [openSidebar, setOpenSidebar] = useState(false);

  const [openCompose, setOpenCompose] = useState(false);

  return (
    <Page title="Mail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Mail"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            { name: 'Mail' },
          ]}
        />
        <Card
          sx={{
            minHeight: 480,
            height: { md: '72vh' },
            display: { md: 'flex' },
          }}
        >
          <MailSidebar
            isOpenSidebar={openSidebar}
            onCloseSidebar={() => setOpenSidebar(false)}
            onOpenCompose={() => setOpenCompose(true)}
            labels={labels}
            activeLabelName={activeLabelName}
            setActiveLabelName={setActiveLabelName}
            setMails={setMails}
          />
          {mailId ? 
            <MailDetails mail={mail} activeLabelName={activeLabelName} labels={labels}/> : 
            <MailList 
              mails={mails} 
              labels={labelsData} 
              onOpenSidebar={() => setOpenSidebar(true)} 
              activeLabelName={activeLabelName}
            />
          }
          <MailCompose isOpenCompose={openCompose} onCloseCompose={() => setOpenCompose(false)} />
        </Card>
      </Container>
    </Page>
  );
}
