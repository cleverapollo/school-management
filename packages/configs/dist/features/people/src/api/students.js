var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useMutation, useQuery } from '@tanstack/react-query';
import { CodeType, gqlClient, graphql, queryClient, } from '@tyro/api';
var students = graphql(/* GraphQL */ "\n  query core_students {\n    core_students {\n      partyId\n      person {\n        avatarUrl\n        firstName\n        lastName\n      }\n      classGroup {\n        name\n        staff {\n          firstName\n          lastName\n        }\n      }\n      personalInformation {\n        preferredFirstName\n        primaryPhoneNumber {\n          number\n        }\n        primaryEmail {\n          email\n        }\n      }\n      studentIrePP {\n        examNumber\n      }\n      tutors {\n        partyId\n        firstName\n        lastName\n        avatarUrl\n      }\n      yearGroupLeads {\n        partyId\n        firstName\n        lastName\n        avatarUrl\n      }\n      yearGroups {\n        name\n      }\n      programmeStages {\n        name\n        programme {\n          name\n        }\n      }\n    }\n  }\n");
var studentById = graphql(/* GraphQL */ "\n  query core_student($filter: StudentFilter!) {\n    core_students(filter: $filter) {\n      partyId\n      person {\n        avatarUrl\n        firstName\n        lastName\n      }\n      classGroup {\n        name\n        staff {\n          firstName\n          lastName\n        }\n      }\n      yearGroupLeads {\n        firstName\n        lastName\n        avatarUrl\n      }\n      yearGroups {\n        shortName\n      }\n      tutors {\n        partyId\n        firstName\n        lastName\n        avatarUrl\n        type\n      }\n      status {\n        sessionAttendance {\n          studentPartyId\n          name\n          status\n        }\n        currentLocation {\n          room {\n            roomId\n            name\n          }\n          lesson\n          teacher\n          currentAttendance {\n            attendanceCodeName\n            codeType\n          }\n        }\n        priorityStudent\n        activeSupportPlan\n      }\n    }\n  }\n");
var bulkUpdateCoreStudent = graphql(/* GraphQL */ "\n  mutation updateCoreStudents($input: [UpdateStudentInput]!) {\n    core_updateStudents(input: $input)\n  }\n");
export var studentKeys = {
    all: ['people', 'students'],
    details: function (studentId) {
        return __spreadArray(__spreadArray([], studentKeys.all, true), [studentId], false);
    },
};
var studentsQuery = {
    queryKey: studentKeys.all,
    queryFn: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, gqlClient.request(students)];
    }); }); },
};
export function getStudents() {
    return queryClient.fetchQuery(studentsQuery);
}
export function useStudents() {
    return useQuery(__assign(__assign({}, studentsQuery), { select: function (_a) {
            var core_students = _a.core_students;
            return core_students;
        } }));
}
var studentQuery = function (studentId) { return ({
    queryKey: studentKeys.details(studentId),
    queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, gqlClient.request(studentById, {
                    filter: { partyIds: [studentId !== null && studentId !== void 0 ? studentId : 0] },
                })];
        });
    }); },
}); };
export function getStudent(studentId) {
    return queryClient.fetchQuery(studentQuery(studentId));
}
export function useStudent(studentId) {
    return useQuery(__assign(__assign({}, studentQuery(studentId)), { select: function (_a) {
            var _b;
            var core_students = _a.core_students;
            var student = Array.isArray(core_students) && core_students.length > 0
                ? core_students[0]
                : null;
            // Adding mock data for demo purposes
            return __assign(__assign({}, student), { status: {
                    studentPartyId: (_b = student === null || student === void 0 ? void 0 : student.partyId) !== null && _b !== void 0 ? _b : 0,
                    sessionAttendance: [
                        {
                            studentPartyId: 0,
                            name: 'AM',
                            status: 'Present',
                        },
                        {
                            studentPartyId: 1,
                            name: 'PM',
                            status: 'Absent',
                        },
                    ],
                    currentLocation: {
                        room: [
                            {
                                roomId: 0,
                                name: 'Room 20B',
                            },
                        ],
                        lesson: 'English H2',
                        teacher: 'Mr. Smith',
                        currentAttendance: {
                            name: 'Present',
                            codeType: CodeType.Present,
                        },
                    },
                    priorityStudent: true,
                    activeSupportPlan: true,
                } });
        }, enabled: !!studentId }));
}
var studentBulkUpdateMapping = {
    'personalInformation.preferredFirstName': 'preferredName',
    'personalInformation.primaryPhoneNumber.number': 'primaryPhoneNumber',
    'personalInformation.primaryEmail.email': 'primaryEmail',
    'studentIrePP.examNumber': 'examNumber',
};
export function useBulkUpdateCoreStudent() {
    return useMutation(function (input) {
        var mappedInput = Object.entries(input).map(function (_a) {
            var partyId = _a[0], changes = _a[1];
            return Object.entries(changes).reduce(function (acc, _a) {
                var key = _a[0], newValue = _a[1].newValue;
                var mappedKey = studentBulkUpdateMapping[key];
                if (mappedKey) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    acc[mappedKey] = newValue;
                }
                return acc;
            }, { studentPartyId: Number(partyId) });
        });
        return gqlClient.request(bulkUpdateCoreStudent, { input: mappedInput });
    }, {
        onSuccess: function () {
            queryClient.invalidateQueries(studentKeys.all);
        },
    });
}
