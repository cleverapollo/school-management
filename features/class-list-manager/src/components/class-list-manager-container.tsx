import {
  PageHeading,
  Page,
  TabPageContainer,
  ActionMenu,
  useDebouncedValue,
  ActionMenuProps,
  useDisclosure,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { MaleFemaleIcon, PersonTickIcon, RotationIcon } from '@tyro/icons';
import { useContainerMargin } from '../hooks/use-container-margin';
import { ClassListSettingsProvider } from '../store/class-list-settings';
import { ReturnTypeOfUseBlockList } from '../api/blocks';
import { CreateBlockRotationModal } from './blocks/create-block-rotation-modal';
import { YearGroupsAutocompleteProps } from './common/list-manager/year-groups-autocomplete';
import { AutoAssignConfirmDialog } from './common/auto-assign-confirm-dialog';

export default function ClassListManagerContainer() {
  const { t } = useTranslation(['navigation', 'classListManager']);
  const { pathname } = useLocation();
  const [, setSearchParams] = useSearchParams();
  const isBlockView = pathname.includes('blocks');
  const containerMargin = useContainerMargin();

  const [showGender, setShowGender] = useState(false);
  const [selectedYearGroup, setSelectedYearGroup] =
    useState<YearGroupsAutocompleteProps['value']>(null);
  const [selectedBlock, setSelectedBlock] = useState<
    ReturnTypeOfUseBlockList[number] | null
  >(null);

  const blockHasRotations = !!selectedBlock?.isRotation;
  const {
    isOpen: isAutoAssignOpen,
    onOpen: onOpenAutoAssign,
    onClose: onCloseAutoAssign,
  } = useDisclosure({ defaultIsOpen: false });
  const {
    value: blockForCreateRotation,
    debouncedValue: debouncedBlockForCreateRotation,
    setValue: setBlockForCreateRotation,
  } = useDebouncedValue<NonNullable<ReturnTypeOfUseBlockList>[number] | null>({
    defaultValue: null,
  });

  const createRotation = () => {
    setBlockForCreateRotation(selectedBlock);
  };

  const menuItems = useMemo<ActionMenuProps['menuItems']>(
    () => [
      {
        label: showGender
          ? t('classListManager:deactivateGenderView')
          : t('classListManager:activateGenderView'),
        icon: <MaleFemaleIcon />,
        onClick: () => setShowGender((prevState) => !prevState),
      },
      ...(blockHasRotations
        ? []
        : [
            {
              label: t('classListManager:autoAssign'),
              icon: <PersonTickIcon />,
              onClick: onOpenAutoAssign,
            },
          ]),
      ...(isBlockView && !blockHasRotations
        ? [
            {
              label: blockHasRotations
                ? t('classListManager:updateRotation')
                : t('classListManager:createRotation'),
              icon: <RotationIcon />,
              onClick: createRotation,
            },
          ]
        : []),
    ],
    [
      isBlockView,
      blockHasRotations,
      showGender,
      setShowGender,
      t,
      onOpenAutoAssign,
      createRotation,
    ]
  );

  const classListSettings = useMemo(
    () => ({
      showGender,
      selectedYearGroup,
      selectedBlock,
      setSelectedBlock,
      setSelectedYearGroup,
    }),
    [
      showGender,
      selectedYearGroup,
      selectedBlock,
      setSelectedBlock,
      setSelectedYearGroup,
    ]
  );

  useEffect(() => {
    if (selectedYearGroup?.yearGroupId) {
      setSearchParams({ yearGroupId: `${selectedYearGroup.yearGroupId}` });
    }
  }, [pathname, selectedYearGroup]);

  return (
    <ClassListSettingsProvider {...classListSettings}>
      <Page title={t('navigation:management.classListManager')} sx={{ px: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <PageHeading
            title={t('navigation:management.classListManager')}
            sx={{ px: containerMargin }}
            rightAdornment={<ActionMenu menuItems={menuItems} />}
          />
          <TabPageContainer
            TabProps={{
              sx: {
                px: containerMargin,
              },
            }}
            links={[
              {
                label: t('classListManager:classes'),
                value: 'classes',
              },
              {
                label: t('classListManager:blocks'),
                value: 'blocks',
              },
            ]}
          />
        </Box>
        <CreateBlockRotationModal
          open={!!blockForCreateRotation}
          blockForCreateRotation={
            blockForCreateRotation || debouncedBlockForCreateRotation
          }
          onClose={() => setBlockForCreateRotation(null)}
        />
        <AutoAssignConfirmDialog
          open={isAutoAssignOpen}
          onClose={onCloseAutoAssign}
          isBlockView={isBlockView}
          currentBlock={selectedBlock}
          currentYearGroup={selectedYearGroup}
        />
      </Page>
    </ClassListSettingsProvider>
  );
}
