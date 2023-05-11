import { useParams } from 'react-router-dom';
import {
    useNumber,
    usePreferredNameLayout,
    PageHeading,
    Page,
    TabPageContainer,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Container } from '@mui/material';
import { useSingleStaff } from '../../api/staff';
import { StaffOverviewBar } from './staff-overview-bar';


export default function StaffProfileContainer() {

    const { t } = useTranslation(['common', 'people']);

    const { id } = useParams();
    const idNumber = useNumber(id);
    const { data: staffData } = useSingleStaff(idNumber);

    const { displayName } = usePreferredNameLayout();

    const userProfileName = t('people:usersProfile', {
        name: displayName(staffData?.person),
    });

    return (
        <Page title={userProfileName}>
            <Container
                maxWidth="xl"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <PageHeading
                    title={userProfileName}
                    breadcrumbs={{
                        links: [
                            {
                                name: t('common:staff'),
                                href: './..',
                            },
                            {
                                name: userProfileName,
                            },
                        ],
                    }}
                />
                <StaffOverviewBar staffId={idNumber} />
                <TabPageContainer
                    links={[
                        {
                            label: 'Overview',
                            value: 'overview',
                        },
                        {
                            label: t('people:personal.title'),
                            value: 'personal',
                        },
                        {
                            label: t('people:contacts'),
                            value: 'contacts',
                        },
                        {
                            label: 'Timetable',
                            value: 'timetable',
                        },
                        {
                            label: 'Classes',
                            value: 'classes',
                        }
                    ]}
                />
            </Container>
        </Page>
    );


}