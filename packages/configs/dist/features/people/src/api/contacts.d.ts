export declare const contactKeys: {
    all: readonly ["people", "contacts"];
    details: (studentId: number | undefined) => readonly ["people", "contacts", number | undefined];
};
export declare function getContacts(): Promise<import("@tyro/api").Core_StudentContactsQuery>;
export declare function useContacts(): import("@tanstack/react-query").UseQueryResult<({
    __typename?: "StudentContact" | undefined;
    partyId: number;
    person: {
        __typename?: "Person" | undefined;
        avatarUrl?: string | null | undefined;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
    };
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
} | null)[] | null | undefined, unknown>;
//# sourceMappingURL=contacts.d.ts.map