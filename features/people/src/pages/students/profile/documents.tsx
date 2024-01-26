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
  useToast,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  DownloadArrowCircleIcon,
  TrashIcon,
  VerticalDotsIcon,
} from '@tyro/icons';
import { Card } from '@mui/material';
import axios from 'axios';
import { getToken } from '@tyro/api';
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
    field: 'fileName',
    headerName: translate('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    valueGetter: ({ data }) =>
      data?.fileName?.slice(0, data?.fileName?.lastIndexOf('.')),
    checkboxSelection: true,
    lockVisible: true,
    sort: 'asc',
  },
  {
    field: 'fileName',
    headerName: translate('common:type'),
    valueGetter: ({ data }) =>
      data?.fileName?.slice(data?.fileName?.lastIndexOf('.')),
  },
  // {
  //   field: 'uploaded',
  //   headerName: translate('people:uploaded'),
  // },
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
  const { toast } = useToast();
  const { displayName } = usePreferredNameLayout();
  const [isUploading, setIsUploading] = useState(false);

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

  const handleUploadDocument = (files: File[]) => {
    if (files.length && studentId && process.env.REACT_APP_REST_API_URI) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('referenceId', `${studentId}`);
      formData.append('overwrite', 'true');
      const token = getToken();
      const headers: HeadersInit = {};
      if (typeof token === 'string') {
        headers.authorization = `Bearer ${token}`;
        headers.origin = 'http://localhost:4000';
      }

      axios
        .post(
          `${process.env.REACT_APP_REST_API_URI}/file-transfer/STUDENT_DOCS`,
          formData,
          {
            headers,
          }
        )
        .then((response) => {
          toast(t('common:snackbarMessages.uploadSuccess'));
        })
        .catch((error) => {
          toast(t('common:snackbarMessages.errorFailed'), {
            variant: 'error',
          });
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
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
        <FileUploader onUpload={handleUploadDocument} uploading={isUploading} />
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
