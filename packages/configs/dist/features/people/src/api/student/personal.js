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
import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import dayjs from 'dayjs';
var studentsPersonalById = graphql(/* GraphQL */ "\n  query core_student_personal($filter: StudentFilter!) {\n    core_students(filter: $filter) {\n      partyId\n      personalInformation {\n        firstName\n        lastName\n        preferredFirstName\n        middleName\n        gender\n        dateOfBirth\n        ire {\n          ppsNumber\n          religion\n          countryOfBirth\n        }\n        nationality\n        mothersMaidenName\n        primaryAddress {\n          line1\n          line2\n          line3\n          city\n          country\n          postCode\n        }\n        primaryPhoneNumber {\n          number\n          areaCode\n          countryCode\n        }\n        primaryEmail {\n          email\n        }\n      }\n      studentIrePP {\n        medicalCard\n        travellerHeritage\n        languageSupportApplicant\n        borderIndicator\n        examNumber\n        previousSchoolRollNumber\n      }\n    }\n  }\n");
export var personalKeys = {
    all: ['people', 'student', 'personal'],
    aboutDetails: function (studentId) {
        return __spreadArray(__spreadArray([], personalKeys.all, true), ['about', studentId], false);
    },
};
var studentPersonalQuery = function (studentId) { return ({
    queryKey: personalKeys.aboutDetails(studentId),
    queryFn: function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, gqlClient.request(studentsPersonalById, {
                    filter: { partyIds: [studentId !== null && studentId !== void 0 ? studentId : 0] },
                })];
        });
    }); },
    staleTime: 1000 * 60 * 5,
}); };
export function getStudentPersonal(studentId) {
    return queryClient.fetchQuery(studentPersonalQuery(studentId));
}
export function useStudentPersonal(studentId) {
    return useQuery(__assign(__assign({}, studentPersonalQuery(studentId)), { select: function (_a) {
            var _b;
            var core_students = _a.core_students;
            var student = Array.isArray(core_students) && core_students.length > 0
                ? core_students[0]
                : null;
            if (!student)
                return null;
            return __assign(__assign({}, student), { personalInformation: __assign(__assign({}, student.personalInformation), { dateOfBirth: ((_b = student === null || student === void 0 ? void 0 : student.personalInformation) === null || _b === void 0 ? void 0 : _b.dateOfBirth)
                        ? dayjs(student.personalInformation.dateOfBirth)
                        : null }) });
        } }));
}
