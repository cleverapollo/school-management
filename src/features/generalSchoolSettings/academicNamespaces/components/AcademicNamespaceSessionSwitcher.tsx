import {useState} from 'react';
// @mui
import {MenuItem, Stack, Typography} from '@mui/material';
// components
import MenuPopover from '../../../../components/MenuPopover';
import {useSubjects} from "../../../subjects/api/subjects";
import {useCoreAcademicNamespace} from "../api/academicNamespaces";
import {SubjectGroup} from "../../../../app/api/generated";
import {usePermissions} from "@tyro/api";
import {HEADERS} from "../../../../constants";

interface NamespacesDropdown  {
    year: string;
    id: number;
}
export default function AcademicNamespaceSessionSwitcher() {
    const [open, setOpen] = useState<HTMLElement | null>(null);
    const sessionNamespaceId = Number(localStorage.getItem(HEADERS.ACADEMIC_NAMESPACE_ID));
    const { data, isLoading } = useCoreAcademicNamespace();
    const {hasPermission} = usePermissions()
    const [currentYear, setCurrentYear] = useState(sessionNamespaceId || 3);


    const years = data?.map(ns => {
        return {
            year: ns?.name,
            id: ns?.academicNamespaceId
        } as NamespacesDropdown
    }) || [];
    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const onClickItem = (value: number) => {
        setCurrentYear( value)
        localStorage.setItem(HEADERS.ACADEMIC_NAMESPACE_ID, value.toString())
        handleClose();
    }

    if(!hasPermission("api:users:read:academic_namespace_switch_session")){
        return (<></>)
    }
    return (
        <>
            <div
                onClick={handleOpen}
            >
                <Typography  variant="subtitle1" sx={{ flexGrow: 1, color:"black" }}>{years.find(a => a?.id === currentYear)?.year || ''}</Typography>
            </div>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    mt: 1.5,
                    ml: 0.75,
                    width: 180,
                    '& .MuiMenuItem-root': {px: 1, typography: 'body2', borderRadius: 0.75},
                }}
            >
                <Stack spacing={0.75}>
                    {years.map((option) => (
                        <MenuItem
                            key={option.id}
                            selected={option.id === currentYear}
                            onClick={() => onClickItem(option.id)}
                        >
                            <p>{option.year}</p>
                        </MenuItem>
                    ))}
                </Stack>
            </MenuPopover>
        </>
    );
}
