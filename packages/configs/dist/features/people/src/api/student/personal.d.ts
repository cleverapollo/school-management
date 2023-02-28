import dayjs from 'dayjs';
export declare const personalKeys: {
    all: readonly ["people", "student", "personal"];
    aboutDetails: (studentId: number | undefined) => readonly ["people", "student", "personal", "about", number | undefined];
};
export declare function getStudentPersonal(studentId: number | undefined): Promise<import("@tyro/api").Core_Student_PersonalQuery>;
export declare function useStudentPersonal(studentId: number | undefined): import("@tanstack/react-query").UseQueryResult<{
    personalInformation: {
        dateOfBirth: dayjs.Dayjs | null;
        __typename?: "PersonalInformation" | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        preferredFirstName?: string | null | undefined;
        middleName?: string | null | undefined;
        gender?: import("@tyro/api").Gender | null | undefined;
        nationality?: string | null | undefined;
        mothersMaidenName?: string | null | undefined;
        ire?: {
            __typename?: "PersonalInformationIre" | undefined;
            ppsNumber?: string | null | undefined;
            religion?: string | null | undefined;
            countryOfBirth?: string | null | undefined;
        } | null | undefined;
        primaryAddress?: {
            __typename?: "Address" | undefined;
            line1?: string | null | undefined;
            line2?: string | null | undefined;
            line3?: string | null | undefined;
            city?: string | null | undefined;
            country?: string | null | undefined;
            postCode?: string | null | undefined;
        } | null | undefined;
        primaryPhoneNumber?: {
            __typename?: "PhoneNumber" | undefined;
            number?: number | null | undefined;
            areaCode?: string | null | undefined;
            countryCode?: string | null | undefined;
        } | null | undefined;
        primaryEmail?: {
            __typename?: "EmailAddress" | undefined;
            email?: string | null | undefined;
        } | null | undefined;
    };
    __typename?: "Student" | undefined;
    partyId: number;
    studentIrePP?: {
        __typename?: "StudentIrePP" | undefined;
        medicalCard?: boolean | null | undefined;
        travellerHeritage?: boolean | null | undefined;
        languageSupportApplicant?: boolean | null | undefined;
        borderIndicator?: boolean | null | undefined;
        examNumber?: string | null | undefined;
        previousSchoolRollNumber?: string | null | undefined;
    } | null | undefined;
} | null, unknown>;
//# sourceMappingURL=personal.d.ts.map