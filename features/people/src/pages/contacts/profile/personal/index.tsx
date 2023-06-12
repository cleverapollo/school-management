import { useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { UpsertStudentContactInput } from '@tyro/api';
import { useContactPersonal } from '../../../../api/contact/personal';
import { ProfileAbout } from './about';
import { useUpsertContact } from '../../../../api/contact/upsert-contact';

export default function ContactProfilePersonalPage() {
  const { id } = useParams();
  const idNumber = useNumber(id);
  const { data: contactData } = useContactPersonal(idNumber);
  const { mutate: upsertContactMutation } = useUpsertContact();

  const handleEdit = (
    updatedData: Omit<UpsertStudentContactInput, 'studentRelationships'>,
    onSuccess: () => void
  ) =>
    upsertContactMutation(
      {
        contactPartyId: contactData?.partyId,
        studentRelationships: contactData?.relationships || [],
        ...updatedData,
      },
      {
        onSuccess,
      }
    );

  return (
    <ProfileAbout contactData={contactData} editable onSave={handleEdit} />
  );
}
