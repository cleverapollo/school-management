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
/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { useMemo } from 'react';
import { Container, Typography } from '@mui/material';
import { Page, Table } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import set from 'lodash/set';
import { useBulkUpdateCoreStudent, useStudents } from '../../api/students';
import { TableAvatar } from '../../components/common/table-avatar';
var getStudentColumns = function (translate) { return [
    {
        field: 'person',
        headerName: translate('common:name'),
        valueGetter: function (_a) {
            var _b, _c, _d, _e;
            var data = _a.data;
            return "".concat((_c = (_b = data === null || data === void 0 ? void 0 : data.person) === null || _b === void 0 ? void 0 : _b.firstName) !== null && _c !== void 0 ? _c : '', " ").concat((_e = (_d = data === null || data === void 0 ? void 0 : data.person) === null || _d === void 0 ? void 0 : _d.lastName) !== null && _e !== void 0 ? _e : '');
        },
        cellRenderer: function (_a) {
            var _b, _c, _d;
            var data = _a.data;
            var person = data === null || data === void 0 ? void 0 : data.person;
            var name = "".concat((_b = person === null || person === void 0 ? void 0 : person.firstName) !== null && _b !== void 0 ? _b : '', " ").concat((_c = person === null || person === void 0 ? void 0 : person.lastName) !== null && _c !== void 0 ? _c : '');
            return (_jsx(TableAvatar, { name: name, avatarUrl: person === null || person === void 0 ? void 0 : person.avatarUrl, to: "./".concat((_d = data === null || data === void 0 ? void 0 : data.partyId) !== null && _d !== void 0 ? _d : '') }));
        },
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        lockVisible: true,
    },
    {
        field: 'classGroup.name',
        headerName: translate('people:class'),
    },
    {
        field: 'yearGroups',
        headerName: translate('common:year'),
        valueGetter: function (_a) {
            var data = _a.data;
            if (data && data.yearGroups.length > 0) {
                return data.yearGroups[0].name;
            }
        },
    },
    {
        field: 'tutors',
        headerName: translate('common:tutor'),
        valueGetter: function (_a) {
            var data = _a.data;
            if (data && data.tutors.length > 0) {
                return data.tutors
                    .map(function (tutor) { var _a, _b; return "".concat((_a = tutor === null || tutor === void 0 ? void 0 : tutor.firstName) !== null && _a !== void 0 ? _a : '', " ").concat((_b = tutor === null || tutor === void 0 ? void 0 : tutor.lastName) !== null && _b !== void 0 ? _b : ''); })
                    .join(', ');
            }
        },
    },
    {
        field: 'yearGroupLeads',
        headerName: translate('common:yearhead'),
        valueGetter: function (_a) {
            var data = _a.data;
            if (data && data.yearGroupLeads.length > 0) {
                return data.yearGroupLeads
                    .map(function (yearGroupLead) {
                    var _a, _b;
                    return "".concat((_a = yearGroupLead === null || yearGroupLead === void 0 ? void 0 : yearGroupLead.firstName) !== null && _a !== void 0 ? _a : '', " ").concat((_b = yearGroupLead === null || yearGroupLead === void 0 ? void 0 : yearGroupLead.lastName) !== null && _b !== void 0 ? _b : '');
                })
                    .join(', ');
            }
        },
    },
    {
        field: 'programmeStage',
        headerName: translate('common:programme'),
        valueGetter: function (_a) {
            var _b, _c;
            var data = _a.data;
            if ((data === null || data === void 0 ? void 0 : data.programmeStages) && data.programmeStages.length > 0) {
                return (_c = (_b = data.programmeStages[0]) === null || _b === void 0 ? void 0 : _b.programme) === null || _c === void 0 ? void 0 : _c.name;
            }
        },
    },
    {
        field: 'studentIrePP.examNumber',
        headerName: translate('people:personal.enrolmentHistory.examNumber'),
        editable: true,
        hide: true,
    },
    {
        field: 'personalInformation.preferredFirstName',
        headerName: translate('common:preferredFirstName'),
        editable: true,
        hide: true,
    },
    {
        field: 'personalInformation.primaryPhoneNumber.number',
        headerName: translate('common:phone'),
        editable: true,
        hide: true,
        cellEditor: 'agNumericCellEditor',
        valueSetter: function (_a) {
            var data = _a.data, newValue = _a.newValue;
            set(data !== null && data !== void 0 ? data : {}, 'personalInformation.primaryPhoneNumber.number', newValue);
            return true;
        },
    },
    {
        field: 'personalInformation.primaryEmail.email',
        headerName: translate('common:email'),
        editable: true,
        hide: true,
        cellEditor: 'agEmailCellEditor',
        valueSetter: function (_a) {
            var data = _a.data, newValue = _a.newValue;
            set(data !== null && data !== void 0 ? data : {}, 'personalInformation.primaryEmail.email', newValue);
            return true;
        },
    },
]; };
export default function StudentsListPage() {
    var t = useTranslation(['common', 'people']).t;
    var _a = useStudents(), students = _a.data, isLoading = _a.isLoading;
    var bulkSaveStudents = useBulkUpdateCoreStudent().mutateAsync;
    var studentColumns = useMemo(function () { return getStudentColumns(t); }, [t]);
    if (isLoading) {
        return null;
    }
    return (_jsx(Page, __assign({ title: t('people:students') }, { children: _jsxs(Container, __assign({ maxWidth: "xl" }, { children: [_jsx(Typography, __assign({ variant: "h3", component: "h1", paragraph: true }, { children: t('people:students') })), _jsx(Table, { rowData: students !== null && students !== void 0 ? students : [], columnDefs: studentColumns, rowSelection: "multiple", rowHeight: 56, getRowId: function (_a) {
                        var data = _a.data;
                        return String(data === null || data === void 0 ? void 0 : data.partyId);
                    }, onBulkSave: bulkSaveStudents })] })) })));
}
