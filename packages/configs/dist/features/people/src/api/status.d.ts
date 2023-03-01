export declare const studentKeys: {
    all: readonly ["people", "student", "status"];
    details: (studentId: number | undefined) => readonly ["people", "student", "status", number | undefined];
};
export declare function getStudentStatus(studentId: number | undefined): Promise<import("@tyro/api").QQuery>;
export declare function useStudentStatus(studentId: number | undefined): import("@tanstack/react-query").UseQueryResult<{
    __typename?: "StudentStatus" | undefined;
    studentPartyId: number;
    priorityStudent?: boolean | null | undefined;
    activeSupportPlan?: boolean | null | undefined;
    sessionAttendance?: ({
        __typename?: "SessionAttendanceStatus" | undefined;
        name?: string | null | undefined;
        status?: string | null | undefined;
    } | null)[] | null | undefined;
    currentLocation?: {
        __typename?: "CurrentStudentLocation" | undefined;
        studentPartyId?: number | null | undefined;
        eventId?: number | null | undefined;
        lesson?: string | null | undefined;
        teacher?: string | null | undefined;
        room?: ({
            __typename?: "Room" | undefined;
            roomId: number;
            name: string;
            capacity?: number | null | undefined;
        } | null)[] | null | undefined;
        currentAttendance?: {
            __typename?: "CurrentAttendance" | undefined;
            attendanceCodeName?: string | null | undefined;
            codeType?: import("@tyro/api").AttendanceCodeType | null | undefined;
        } | null | undefined;
    } | null | undefined;
}, unknown>;
//# sourceMappingURL=status.d.ts.map