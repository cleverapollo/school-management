import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Card } from '@mui/material';
// redux
import { useDispatch } from '../../../store/store';
import { getLabels, objFromArray } from '../../../store/slices/mail';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { MailList, MailDetails, MailSidebar, MailCompose } from '../components';
import { labelsMap, useLabels } from '../api/labels';
import { useMails } from '../api/mails';
import { MailLabel, Mails } from '../types';
import { Mail as MailType } from '@tyro/api/src/gql/graphql';

// ----------------------------------------------------------------------

export default function Mail() {
  const { themeStretch } = useSettings();

  const { mailId, labelName } = useParams();
  console.log('labelName - ', labelName);
  //console.log(mailId);
  const [labels, setLabels] = useState<MailLabel[]>([]);
  const { isLoading: isLoadingLabels, data: labelsData } = useLabels();
  const [mail, setMail] = useState<MailType | null>(null);
  const [activeLabelName, setActiveLabelName] = useState<string>('');
  //const { isLoading: isLoadingMails, data: mailsData } = useMails(activeLabelName);
  const [mails, setMails] = useState<Mails>({ byId: {}, allIds: [] });
  console.log(activeLabelName);

  useEffect(() => {
    if (labelsData?.length) {
      setActiveLabelName(labelsData[0].name);
      const starredLabel: MailLabel = {
        id: 'starred',
        name: 'Starred',
        type: 'system',
        unreadCount: 0,
      };
      // if (mailsData && !labels.filter(label => label.id === 'starred').length) {
      //   let starCount = 0;
      //   mailsData.forEach(mail => {
      //     if (mail?.starred) {
      //       starCount++;
      //     }
      //   });
      //   const starredLabel: MailLabel = {
      //     id: 'starred',
      //     name: 'Starred',
      //     type: 'system',
      //     unreadCount: starCount,
      //   };
      //   setLabels([...labels, starredLabel]);
      // } else {
        setLabels([...labels, ...labelsData, starredLabel]);
      //}
    }
  }, [labelsData//, mailsData
  ]);

  // useEffect(() => {
  //   mailsData && setMails({ byId: objFromArray(mailsData), allIds: Object.keys(objFromArray(mailsData)) });
  // }, [mailsData]);

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
            //labels={labelsData ?? []}
            labels={labels}
            activeLabelName={activeLabelName}
            setActiveLabelName={setActiveLabelName}
            setMails={setMails}
          />
          {mailId ? <MailDetails mail={mail} activeLabelName={activeLabelName}/> : <MailList mails={mails} labels={labelsData} onOpenSidebar={() => setOpenSidebar(true)} activeLabelName={activeLabelName}/>}
          <MailCompose isOpenCompose={openCompose} onCloseCompose={() => setOpenCompose(false)} />
        </Card>
      </Container>
    </Page>
  );
}
