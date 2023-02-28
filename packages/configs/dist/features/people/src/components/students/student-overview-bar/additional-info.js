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
import { Box, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { displayName } from '../../../../../../src/utils/nameUtils';
export function AdditionalInfo(_a) {
    var _b;
    var year = _a.year, classGroup = _a.classGroup, yearGroupLead = _a.yearGroupLead, tutor = _a.tutor;
    var t = useTranslation(['people']).t;
    var additionalInfoList = (_b = {},
        _b[t('people:year')] = year === null || year === void 0 ? void 0 : year.map(function (a) { return a.shortName; }),
        _b[t('people:class')] = classGroup === null || classGroup === void 0 ? void 0 : classGroup.name,
        _b[t('people:yearHead')] = displayName(yearGroupLead === null || yearGroupLead === void 0 ? void 0 : yearGroupLead.map(function (a) { return a; }).find(function (a) { return true; })),
        _b[t('people:tutor')] = displayName(tutor === null || tutor === void 0 ? void 0 : tutor.map(function (a) { return a; }).find(function (a) { return true; })),
        _b);
    return (_jsx(Stack, __assign({ component: "dl", direction: "row", sx: { my: 0 } }, { children: Object.entries(additionalInfoList).map(function (_a, index) {
            var label = _a[0], value = _a[1];
            return (_jsxs(Stack, { children: [_jsx(Box, __assign({ component: "dt", sx: {
                            fontSize: '0.75rem',
                            px: 2,
                            py: 0.5,
                            color: 'slate.600',
                            minHeight: 34,
                            display: 'flex',
                            alignItems: 'center',
                        } }, { children: label })), _jsx(Box, __assign({ component: "dd", sx: __assign({ fontSize: '0.75rem', ml: 0, py: 1, px: 2 }, (index < 2 && {
                            textAlign: 'center',
                        })) }, { children: value }))] }, label));
        }) })));
}
