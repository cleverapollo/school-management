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
import { useTranslation } from '@tyro/i18n';
import { Box, Button, Stack } from '@mui/material';
import { CopyIcon } from '@tyro/icons';
import { useCopyToClipboard } from 'react-use';
import { useEffect } from 'react';
import { useToast } from '@tyro/core';
export function TyroId(_a) {
    var id = _a.id;
    var t = useTranslation(['people']).t;
    var _b = useCopyToClipboard(), state = _b[0], copyToClipboard = _b[1];
    var toast = useToast().toast;
    useEffect(function () {
        if (state.error) {
            toast(t('people:issueCopyingTyroId'), { variant: 'error' });
        }
        else if (state.value) {
            toast(t('people:tyroIdCopied'));
        }
    }, [state]);
    return (_jsxs(Stack, __assign({ spacing: 0.25 }, { children: [_jsx(Box, __assign({ component: "dt", sx: {
                    fontSize: '0.75rem',
                    px: 2,
                    color: 'slate.600',
                    lineHeight: 34 / 12,
                } }, { children: t('people:tyroId') })), _jsx(Box, __assign({ sx: {
                    px: 1,
                } }, { children: _jsx(Button, __assign({ size: "small", sx: {
                        fontSize: '0.75rem',
                        justifyContent: 'flex-start',
                        minWidth: 'auto',
                        px: 1,
                        '& .MuiButton-endIcon': {
                            opacity: 0,
                            transition: 'opacity 0.2s ease-in-out',
                        },
                        '&:hover .MuiButton-endIcon': {
                            opacity: 1,
                        },
                    }, "aria-label": t('people:tyroIdClickToCopy', { id: id }), onClick: function () { return copyToClipboard(String(id)); }, endIcon: _jsx(CopyIcon, { fontSize: "inherit" }) }, { children: id })) }))] })));
}
