import dayjs from 'dayjs';
import { FeeType } from '@tyro/api';
import { StudentSelectOption } from '@tyro/people';
import { ReturnTypeFromUseDiscounts } from '../../../api/discounts';
import { ReturnTypeFromUseFeesCategories } from '../../../api/fees-categories';

export type FeeFormState = {
  name: string;
  dueDate: dayjs.Dayjs;
  amount: number;
  feeType: FeeType;
  absorbFees: boolean;
  discounts: ReturnTypeFromUseDiscounts;
  categories: ReturnTypeFromUseFeesCategories[];
  students: StudentSelectOption[];
  individualDiscounts: Array<{
    id: ReturnTypeFromUseDiscounts['id'];
    name: ReturnTypeFromUseDiscounts['name'];
    partyId: StudentSelectOption['partyId'];
  }>;
};
