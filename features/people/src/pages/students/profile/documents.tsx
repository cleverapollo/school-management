import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  ActionMenu,
  getNumber,
  GridOptions,
  Table,
  usePreferredNameLayout,
  useDisclosure,
  ICellRendererParams,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  DownloadArrowCircleIcon,
  TrashIcon,
  VerticalDotsIcon,
} from '@tyro/icons';
import { Card } from '@mui/material';
import { FileUploader } from '../../../components/students/file-uploader';
import { DeleteDocumentsModal } from '../../../components/students/delete-documents-modal';
import { useDocuments } from '../../../api/documents/list';

type ReturnTypeFromUseDocuments = NonNullable<
  ReturnType<typeof useDocuments>['data']
>[number];

const getStudentDocumentColumns = (
  translate: TFunction<
    ('common' | 'people')[],
    undefined,
    ('common' | 'people')[]
  >,
  onDelete: (document: ReturnTypeFromUseDocuments) => void
): GridOptions<ReturnTypeFromUseDocuments>['columnDefs'] => [
  {
    field: 'name',
    headerName: translate('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: true,
    lockVisible: true,
    sort: 'asc',
  },
  {
    field: 'type',
    headerName: translate('common:type'),
  },
  {
    field: 'uploaded',
    headerName: translate('people:uploaded'),
  },
  {
    suppressColumnsToolPanel: true,
    cellClass: 'ag-show-on-row-interaction',
    sortable: false,
    suppressSizeToFit: true,
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseDocuments>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: translate('people:actions.download'),
              icon: <DownloadArrowCircleIcon />,
              onClick: () => {},
            },
            {
              label: translate('common:actions.delete'),
              icon: <TrashIcon />,
              onClick: () => onDelete(data),
            },
          ]}
        />
      ),
  },
];

export default function StudentProfileDocumentsPage() {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'people', 'mail', 'sms']);
  const { displayName } = usePreferredNameLayout();

  const studentId = getNumber(id);
  const { data: documents = [] } = useDocuments(studentId);

  const [selectedDocuments, setSelectedDocuments] = useState<
    ReturnTypeFromUseDocuments[]
  >([]);
  const [selectedDocument, setSelectedDocument] = useState<
    ReturnTypeFromUseDocuments | undefined
  >();

  const {
    isOpen: isDeleteFilesModalOpened,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const onDeleteDocument = (document: ReturnTypeFromUseDocuments) => {
    setSelectedDocument(document);
    onOpenDeleteModal();
  };

  const studentDocumentColumns = useMemo(
    () => getStudentDocumentColumns(t, onDeleteDocument),
    [t, displayName]
  );

  const actionMenuItems = [
    {
      label: t('people:actions.download'),
      icon: <DownloadArrowCircleIcon />,
      onClick: () => {},
    },
    {
      label: t('common:actions.delete'),
      icon: <TrashIcon />,
      onClick: onOpenDeleteModal,
    },
  ];

  return (
    <>
      <Card sx={{ p: 2 }}>
        <FileUploader />
      </Card>
      <Table
        rowData={documents ?? []}
        columnDefs={studentDocumentColumns}
        tableContainerSx={{ height: 300 }}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
        onRowSelection={(rows) => {
          setSelectedDocuments(rows);
        }}
        rightAdornment={
          selectedDocuments.length > 0 ? (
            <ActionMenu menuItems={actionMenuItems} />
          ) : null
        }
      />
      <DeleteDocumentsModal
        isOpen={isDeleteFilesModalOpened}
        onClose={onCloseDeleteModal}
        documents={
          selectedDocument !== undefined
            ? [selectedDocument]
            : selectedDocuments
        }
      />
    </>
  );
}
