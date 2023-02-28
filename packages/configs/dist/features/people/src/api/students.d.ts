import { CodeType } from '@tyro/api';
import { BulkEditedRows } from '@tyro/core';
export declare const studentKeys: {
    all: readonly ["people", "students"];
    details: (studentId: number | undefined) => readonly ["people", "students", number | undefined];
};
export declare function getStudents(): Promise<import("@tyro/api").Core_StudentsQuery>;
export declare function useStudents(): import("@tanstack/react-query").UseQueryResult<({
    __typename?: "Student" | undefined;
    partyId: number;
    person: {
        __typename?: "Person" | undefined;
        avatarUrl?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
    };
    classGroup?: {
        __typename?: "GeneralGroup" | undefined;
        name: string;
        staff?: ({
            __typename?: "Person" | undefined;
            firstName?: string | null | undefined;
            lastName?: string | null | undefined;
        } | null)[] | null | undefined;
    } | null | undefined;
    personalInformation?: {
        __typename?: "PersonalInformation" | undefined;
        preferredFirstName?: string | null | undefined;
        primaryPhoneNumber?: {
            __typename?: "PhoneNumber" | undefined;
            number?: number | null | undefined;
        } | null | undefined;
        primaryEmail?: {
            __typename?: "EmailAddress" | undefined;
            email?: string | null | undefined;
        } | null | undefined;
    } | null | undefined;
    studentIrePP?: {
        __typename?: "StudentIrePP" | undefined;
        examNumber?: string | null | undefined;
    } | null | undefined;
    tutors: {
        __typename?: "Person" | undefined;
        partyId: number;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        avatarUrl?: string | null | undefined;
    }[];
    yearGroupLeads: {
        __typename?: "Person" | undefined;
        partyId: number;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        avatarUrl?: string | null | undefined;
    }[];
    yearGroups: {
        __typename?: "YearGroupEnrollment" | undefined;
        name: string;
    }[];
    programmeStages?: ({
        __typename?: "ProgrammeStage" | undefined;
        name: string;
        programme?: {
            __typename?: "Programme" | undefined;
            name: string;
        } | null | undefined;
    } | null)[] | null | undefined;
} | null)[] | null | undefined, unknown>;
export declare function getStudent(studentId: number | undefined): Promise<import("@tyro/api").Core_StudentQuery>;
export type ReturnTypeFromUseStudent = NonNullable<ReturnType<typeof useStudent>['data']>;
export declare function useStudent(studentId: number | undefined): import("@tanstack/react-query").UseQueryResult<{
    status: {
        studentPartyId: number;
        sessionAttendance: {
            studentPartyId: number;
            name: string;
            status: string;
        }[];
        currentLocation: {
            room: {
                roomId: number;
                name: string;
            }[];
            lesson: string;
            teacher: string;
            currentAttendance: {
                name: string;
                codeType: CodeType;
            };
        };
        priorityStudent: boolean;
        activeSupportPlan: boolean;
    };
    __typename?: "Student" | undefined;
    partyId?: number | undefined;
    person?: {
        __typename?: "Person" | undefined;
        avatarUrl?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
    } | undefined;
    classGroup?: {
        __typename?: "GeneralGroup" | undefined;
        name: string;
        staff?: ({
            __typename?: "Person" | undefined;
            firstName?: string | null | undefined;
            lastName?: string | null | undefined;
        } | null)[] | null | undefined;
    } | null | undefined;
    yearGroupLeads?: {
        __typename?: "Person" | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        avatarUrl?: string | null | undefined;
    }[] | undefined;
    yearGroups?: {
        __typename?: "YearGroupEnrollment" | undefined;
        shortName: string;
    }[] | undefined;
    tutors?: {
        __typename?: "Person" | undefined;
        partyId: number;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        avatarUrl?: string | null | undefined;
        type?: import("@tyro/api").PartyPersonType | null | undefined;
    }[] | undefined;
}, unknown>;
export declare function useBulkUpdateCoreStudent(): import("@tanstack/react-query").UseMutationResult<import("@tyro/api").UpdateCoreStudentsMutation, unknown, BulkEditedRows, unknown>;
//# sourceMappingURL=students.d.ts.map