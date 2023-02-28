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
import { Box } from '@mui/material';
import { Avatar, RouterLink } from '@tyro/core';
export function TableAvatar(_a) {
    var avatarUrl = _a.avatarUrl, name = _a.name, to = _a.to;
    return (_jsxs(Box, __assign({ display: "flex", alignItems: "center" }, { children: [_jsx(Avatar, { src: avatarUrl !== null && avatarUrl !== void 0 ? avatarUrl : undefined, name: name, sx: {
                    my: 1,
                    mr: 1.5,
                } }), _jsx(RouterLink, __assign({ sx: { fontWeight: 600 }, to: to }, { children: name }))] })));
}
