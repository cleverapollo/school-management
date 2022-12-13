import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Card } from '@mui/material';
// redux
import { useDispatch } from '../../../store/store';
import { getLabels } from '../../../store/slices/mail';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { MailList, MailDetails, MailSidebar, MailCompose } from '../components';
import { useLabels } from '../api/labels';
import { MailLabel } from '../types';
import { Mail as MailType } from '@tyro/api/src/gql/graphql';

// ----------------------------------------------------------------------

export default function Mail() {
  const { themeStretch } = useSettings();

//  const dispatch = useDispatch();

  const { mailId } = useParams();
  const [mail, setMail] = useState<MailType | null>(null);

  const [openSidebar, setOpenSidebar] = useState(false);

  const [openCompose, setOpenCompose] = useState(false);

  // useEffect(() => {
  //   dispatch(getLabels());
  // }, [dispatch]);
  const { isLoading, data } = useLabels();


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
            labels={data ?? []}
          />
          {mailId ? <MailDetails mail={mail}/> : <MailList labels={data} onOpenSidebar={() => setOpenSidebar(true)} />}
          <MailCompose isOpenCompose={openCompose} onCloseCompose={() => setOpenCompose(false)} />
        </Card>
      </Container>
    </Page>
  );
}
