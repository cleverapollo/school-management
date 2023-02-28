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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Card, CardHeader, Chip, Stack, Typography, } from '@mui/material';
import { useNumber } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { UserGroupTwoIcon } from '@tyro/icons';
import { useParams } from 'react-router-dom';
import { joinAddress } from '../../../utils/join-address';
import { useStudentPersonal } from '../../../api/student/personal';
var getAboutDataWithLabels = function (data, t) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var _l = data !== null && data !== void 0 ? data : {}, partyId = _l.partyId, personalInformation = _l.personalInformation;
    return _a = {},
        _a[t('people:personal.about.preferredName')] = (_b = personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.preferredFirstName) !== null && _b !== void 0 ? _b : '-',
        _a[t('people:personal.about.forename')] = (_c = personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.firstName) !== null && _c !== void 0 ? _c : '-',
        _a[t('people:personal.about.surname')] = (_d = personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.lastName) !== null && _d !== void 0 ? _d : '-',
        _a[t('people:personal.about.dateOfBirth')] = (personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.dateOfBirth)
            ? personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.dateOfBirth.format('DD/MM/YYYY')
            : '-',
        _a[t('people:personal.about.ppsNumber')] = (_f = (_e = personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.ire) === null || _e === void 0 ? void 0 : _e.ppsNumber) !== null && _f !== void 0 ? _f : '-',
        _a[t('people:personal.about.departmentId')] = '-',
        _a[t('people:personal.about.gender.title')] = (personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.gender)
            ? t("people:personal.about.gender.".concat(personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.gender))
            : '-',
        _a[t('people:personal.about.birthCertForename')] = '-',
        _a[t('people:personal.about.birthCertSurname')] = '-',
        _a[t('people:tyroId')] = partyId !== null && partyId !== void 0 ? partyId : '-',
        _a[t('people:personal.about.countryOfBirth')] = (_h = (_g = personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.ire) === null || _g === void 0 ? void 0 : _g.countryOfBirth) !== null && _h !== void 0 ? _h : '-',
        _a[t('people:personal.about.nationality')] = (_j = personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.nationality) !== null && _j !== void 0 ? _j : '-',
        _a[t('people:personal.about.mothersMaidenName')] = (_k = personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.mothersMaidenName) !== null && _k !== void 0 ? _k : '-',
        _a[t('people:personal.about.motherTongue')] = '-',
        _a[t('people:personal.about.ethnicityAndCulturalBackground')] = '-',
        _a;
};
var getEnrolmentDataWithLabels = function (data, t) {
    var _a;
    var i18nPrefix = 'people:personal.enrolmentHistory';
    return _a = {},
        _a[t('common:academicYear')] = '-',
        _a[t("".concat(i18nPrefix, ".enrolmentDate"))] = '-',
        _a[t("".concat(i18nPrefix, ".programme"))] = '-',
        _a[t("".concat(i18nPrefix, ".programmeYear"))] = '-',
        _a[t("".concat(i18nPrefix, ".classGroup"))] = '-',
        _a[t("".concat(i18nPrefix, ".classTutor"))] = '-',
        _a[t("".concat(i18nPrefix, ".yearHead"))] = '-',
        _a[t("".concat(i18nPrefix, ".lockerNumber"))] = '-',
        _a[t("".concat(i18nPrefix, ".examNumber"))] = '-',
        _a[t("".concat(i18nPrefix, ".examEntrant"))] = '-',
        _a[t("".concat(i18nPrefix, ".repeatOfYearIndicator"))] = '-',
        _a[t("".concat(i18nPrefix, ".boarderIndicator"))] = '-',
        _a[t("".concat(i18nPrefix, ".boarderDays"))] = '-',
        _a[t("".concat(i18nPrefix, ".shortTermPupil"))] = '-',
        _a[t("".concat(i18nPrefix, ".numberOfWeeks"))] = '-',
        _a[t("".concat(i18nPrefix, ".pupilSource"))] = '-',
        _a[t("".concat(i18nPrefix, ".repeatLeavingCertificateFeesPayable"))] = '-',
        _a[t("".concat(i18nPrefix, ".previousSchoolName"))] = '-',
        _a[t("".concat(i18nPrefix, ".previousSchoolType"))] = '-',
        _a[t("".concat(i18nPrefix, ".previousSchoolRollNumber"))] = '-',
        _a[t("".concat(i18nPrefix, ".leftEarly"))] = '-',
        _a[t("".concat(i18nPrefix, ".dateOfLeaving"))] = '-',
        _a;
};
export default function StudentProfilePersonalPage() {
    var _a, _b, _c;
    var id = useParams().id;
    var idNumber = useNumber(id);
    var t = useTranslation(['people', 'common']).t;
    var data = useStudentPersonal(idNumber).data;
    var aboutDataWithLabels = getAboutDataWithLabels(data !== null && data !== void 0 ? data : null, t);
    var enrolmentDataWithLabels = getEnrolmentDataWithLabels(data !== null && data !== void 0 ? data : null, t);
    var _d = (_a = data === null || data === void 0 ? void 0 : data.personalInformation) !== null && _a !== void 0 ? _a : {}, primaryEmail = _d.primaryEmail, primaryPhoneNumber = _d.primaryPhoneNumber, primaryAddress = _d.primaryAddress;
    console.log({ data: data });
    return (_jsxs(Stack, __assign({ my: 3, spacing: 3 }, { children: [_jsxs(Card, __assign({ variant: "outlined" }, { children: [_jsx(CardHeader, { title: t('people:personal.about.title') }), _jsx(Box, __assign({ component: "dl", sx: {
                            p: 3,
                            m: 0,
                            display: 'grid',
                            gridRowGap: '2rem',
                            gridColumnGap: '4rem',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        } }, { children: Object.entries(aboutDataWithLabels).map(function (_a) {
                            var label = _a[0], value = _a[1];
                            return (_jsxs(Box, { children: [_jsx(Typography, __assign({ component: "dt", variant: "subtitle1" }, { children: label })), _jsx(Typography, __assign({ component: "dd", variant: "body1" }, { children: value }))] }, label));
                        }) })), _jsxs(Box, __assign({ sx: {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            px: 3,
                            pb: 3,
                        } }, { children: [_jsx(UserGroupTwoIcon, { sx: { color: 'slate.500', mr: 1 } }), _jsx(Typography, __assign({ variant: "body1", sx: { color: 'slate.600' } }, { children: t('common:siblings') })), _jsx(Chip, { label: t('common:noSiblingsRegisteredAtThisSchool'), sx: { ml: 1.5 } })] }))] })), _jsxs(Stack, __assign({ direction: { sm: 'column', md: 'row' }, spacing: 3 }, { children: [_jsxs(Card, __assign({ variant: "outlined", sx: { flex: 1 } }, { children: [_jsx(CardHeader, { title: "Student's contact details" }), _jsxs(Box, __assign({ component: "dl", sx: {
                                    p: 3,
                                    m: 0,
                                    display: 'grid',
                                    gridRowGap: '2rem',
                                    gridColumnGap: '4rem',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                } }, { children: [_jsxs(Box, { children: [_jsx(Typography, __assign({ component: "dt", variant: "subtitle1" }, { children: t('common:address') })), _jsx(Typography, __assign({ component: "dd", variant: "body1" }, { children: joinAddress(primaryAddress, { separator: _jsx("br", {}) }) }))] }), _jsxs(Box, { children: [_jsx(Typography, __assign({ component: "dt", variant: "subtitle1" }, { children: t('common:phone') })), _jsx(Typography, __assign({ component: "dd", variant: "body1" }, { children: (_b = primaryPhoneNumber === null || primaryPhoneNumber === void 0 ? void 0 : primaryPhoneNumber.number) !== null && _b !== void 0 ? _b : '-' }))] }), _jsxs(Box, { children: [_jsx(Typography, __assign({ component: "dt", variant: "subtitle1" }, { children: t('common:email') })), _jsx(Typography, __assign({ component: "dd", variant: "body1" }, { children: (_c = primaryEmail === null || primaryEmail === void 0 ? void 0 : primaryEmail.email) !== null && _c !== void 0 ? _c : '-' }))] })] }))] })), _jsxs(Card, __assign({ variant: "outlined", sx: { flex: 1 } }, { children: [_jsx(CardHeader, { title: t('people:personal.enrolmentHistory.title') }), _jsx(Box, __assign({ component: "dl", sx: {
                                    p: 3,
                                    m: 0,
                                    display: 'grid',
                                    gridRowGap: '2rem',
                                    gridColumnGap: '4rem',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                } }, { children: Object.entries(enrolmentDataWithLabels).map(function (_a) {
                                    var label = _a[0], value = _a[1];
                                    return (_jsxs(Box, { children: [_jsx(Typography, __assign({ component: "dt", variant: "subtitle1" }, { children: label })), _jsx(Typography, __assign({ component: "dd", variant: "body1" }, { children: value }))] }, label));
                                }) }))] }))] }))] })));
}
