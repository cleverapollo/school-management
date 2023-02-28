export declare const overviewKeys: {
    all: readonly ["people", "student", "overview"];
    contacts: (studentId: number | undefined) => readonly ["people", "student", "overview", "contacts", number | undefined];
};
export declare function getStudentsContacts(studentId: number | undefined): Promise<import("@tyro/api").Core_Student_ContactsQuery>;
export declare function useStudentsContacts(studentId: number | undefined): import("@tanstack/react-query").UseQueryResult<{
    __typename?: "Student" | undefined;
    partyId: number;
    contacts?: ({
        __typename?: "StudentContact" | undefined;
        partyId: number;
        person: {
            __typename?: "Person" | undefined;
            firstName?: string | null | undefined;
            lastName?: string | null | undefined;
            avatarUrl?: string | null | undefined;
            type?: import("@tyro/api").PartyPersonType | null | undefined;
        };
        personalInformation?: {
            __typename?: "PersonalInformation" | undefined;
            nationality?: string | null | undefined;
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
        } | null | undefined;
        relationships?: ({
            __typename?: "StudentContactRelationshipInfo" | undefined;
            relationshipType: import("@tyro/api").StudentContactType;
            primaryContact?: boolean | null | undefined;
            allowedToContact?: boolean | null | undefined;
        } | null)[] | null | undefined;
    } | null)[] | null | undefined;
} | null, unknown>;
//# sourceMappingURL=overview.d.ts.map