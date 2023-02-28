/// <reference types="react" />
import { ReturnTypeFromUseStudent } from '../../../api/students';
export interface AdditionalInfoProps {
    year: ReturnTypeFromUseStudent['yearGroups'];
    classGroup: ReturnTypeFromUseStudent['classGroup'];
    yearGroupLead: ReturnTypeFromUseStudent['yearGroupLeads'];
    tutor: ReturnTypeFromUseStudent['tutors'];
}
export declare function AdditionalInfo({ year, classGroup, yearGroupLead, tutor, }: AdditionalInfoProps): JSX.Element;
//# sourceMappingURL=additional-info.d.ts.map