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
  commonActionMenuProps,
  FileDropzone,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { TrashIcon, VerticalDotsIcon } from '@tyro/icons';
import { Card, Link } from '@mui/material';
import { FileTransferFeature } from '@tyro/api';
import { useUploadDocument } from '../../../api/documents/upload';
import { DeleteDocumentsModal } from '../../../components/students/delete-documents-modal';
import { useDocuments } from '../../../api/documents/list';

type ReturnTypeFromUseDocuments = NonNullable<
  ReturnType<typeof useDocuments>['data']
>[number];

const getStudentDocumentColumns = (
  t: TFunction<('common' | 'people')[], undefined, ('common' | 'people')[]>,
  onDelete: (document: ReturnTypeFromUseDocuments) => void
): GridOptions<ReturnTypeFromUseDocuments>['columnDefs'] => [
  {
    field: 'fileName',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    width: 400,
    valueGetter: ({ data }) =>
      data?.fileName?.slice(0, data?.fileName?.lastIndexOf('.')),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseDocuments>) => {
      const fileName = data?.fileName?.slice(
        0,
        data?.fileName?.lastIndexOf('.')
      );
      return (
        <Link href={data?.fileUrl} target="_blank" noWrap download>
          {fileName}
        </Link>
      );
    },
    checkboxSelection: true,
    lockVisible: true,
    sort: 'asc',
  },
  {
    field: 'fileName',
    headerName: t('common:type'),
    valueGetter: ({ data }) =>
      data?.fileName?.slice(data?.fileName?.lastIndexOf('.')),
  },
  {
    ...commonActionMenuProps,
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseDocuments>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.delete'),
              icon: <TrashIcon />,
              isDelete: true,
              onClick: () => onDelete(data),
            },
          ]}
        />
      ),
  },
];

export default function StudentProfileDocumentsPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const { t } = useTranslation(['common', 'people', 'mail', 'sms']);
  const { displayName } = usePreferredNameLayout();

  const { data: documents = [] } = useDocuments({
    referenceId: id ?? '',
    feature: FileTransferFeature.StudentDocs,
  });
  const { mutateAsync: uploadDocument, isLoading: isUploading } =
    useUploadDocument(studentId);

  const [selectedDocuments, setSelectedDocuments] = useState<
    ReturnTypeFromUseDocuments[]
  >([]);

  const {
    isOpen: isDeleteFilesModalOpened,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();

  const onDeleteDocument = (document: ReturnTypeFromUseDocuments) => {
    setSelectedDocuments([document]);
    onOpenDeleteModal();
  };

  const studentDocumentColumns = useMemo(
    () => getStudentDocumentColumns(t, onDeleteDocument),
    [t, displayName]
  );

  const actionMenuItems = [
    {
      label: t('common:actions.delete'),
      icon: <TrashIcon />,
      isDelete: true,
      onClick: onOpenDeleteModal,
    },
  ];

  return (
    <>
      <Card sx={{ p: 2 }}>
        <FileDropzone onUpload={uploadDocument} uploading={isUploading} />
      </Card>
      <Table
        rowData={documents ?? []}
        columnDefs={studentDocumentColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
        onRowSelection={setSelectedDocuments}
        rightAdornment={
          selectedDocuments.length > 0 ? (
            <ActionMenu menuItems={actionMenuItems} />
          ) : null
        }
      />
      <DeleteDocumentsModal
        isOpen={isDeleteFilesModalOpened}
        onClose={onCloseDeleteModal}
        documents={selectedDocuments}
      />
    </>
  );
}
