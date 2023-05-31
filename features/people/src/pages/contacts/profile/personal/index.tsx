import { useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { useContactPersonal } from '../../../../api/contact/personal';
import { ProfileAbout } from './about';

export default function ContactProfilePersonalPage() {
  const { id } = useParams();
  const idNumber = useNumber(id);
  const { data } = useContactPersonal(idNumber);

  return <ProfileAbout contactData={data} editable />;
}
