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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Button, Card, CardHeader, IconButton, Stack, Tooltip, Typography, } from '@mui/material';
import { AnimatePresence, m } from 'framer-motion';
import { ChevronRightIcon, ExternalLinkIcon, HouseLocationIcon, LabelsIcon, MailIcon, PhoneIcon, } from '@tyro/icons';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@tyro/i18n';
import { Avatar } from '@tyro/core';
import { useStudentsContacts } from '../../api/student/overview';
import { joinAddress } from '../../utils/join-address';
export function StudentContactsWidget(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    var studentId = _a.studentId;
    var _y = useState(0), contactIndex = _y[0], setContactIndex = _y[1];
    var t = useTranslation(['common', 'people', 'mail']).t;
    var _z = useStudentsContacts(studentId), data = _z.data, isLoading = _z.isLoading;
    var numberOfContacts = (_c = (_b = data === null || data === void 0 ? void 0 : data.contacts) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
    var contact = (_d = data === null || data === void 0 ? void 0 : data.contacts) === null || _d === void 0 ? void 0 : _d[contactIndex];
    var contactsRelationshipType = (_f = (_e = contact === null || contact === void 0 ? void 0 : contact.relationships) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.relationshipType;
    var nextContact = function () {
        var nextContactIndex = contactIndex + 1 >= numberOfContacts ? 0 : contactIndex + 1;
        setContactIndex(nextContactIndex);
    };
    return (_jsxs(Card, __assign({ variant: "outlined", sx: { maxWidth: 380, flex: 1 } }, { children: [_jsxs(Stack, __assign({ direction: "row", sx: {
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pl: 3,
                    pr: 2,
                    pt: 2.25,
                    pb: 1.25,
                } }, { children: [_jsx(CardHeader, { component: "h3", title: t('people:guardianContactInformation'), sx: { p: 0, m: 0 } }), (contact === null || contact === void 0 ? void 0 : contact.partyId) && (_jsx(IconButton, __assign({ component: Link, to: "/people/contacts/".concat(contact === null || contact === void 0 ? void 0 : contact.partyId) }, { children: _jsx(ExternalLinkIcon, { sx: { width: 20, height: 20 } }) })))] })), _jsxs(Stack, __assign({ direction: "row", sx: {
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    pl: 3,
                    pr: 2,
                    py: 1.5,
                    borderWidth: '1px 0',
                    borderStyle: 'solid',
                    borderColor: 'divider',
                } }, { children: [_jsx(Typography, __assign({ variant: "body1", sx: { color: 'text.secondary' } }, { children: _jsxs(_Fragment, { children: [t('common:guardian'), ' ', _jsxs(Box, __assign({ component: "span", fontWeight: 600 }, { children: [contactIndex + 1, "/", (_g = data === null || data === void 0 ? void 0 : data.contacts) === null || _g === void 0 ? void 0 : _g.length] }))] }) })), _jsx(Tooltip, __assign({ title: isLoading || numberOfContacts <= 1
                            ? t('people:nextContactDisabled', { count: numberOfContacts })
                            : '' }, { children: _jsx("span", { children: _jsx(Button, __assign({ disabled: isLoading || numberOfContacts <= 1, onClick: nextContact, endIcon: _jsx(ChevronRightIcon, {}), size: "small" }, { children: t('people:nextContact') })) }) }))] })), _jsx(AnimatePresence, __assign({ initial: false }, { children: _jsx(Box, __assign({ component: m.div, initial: { x: '100%', position: 'absolute' }, animate: { x: '0%', position: 'relative' }, exit: { x: '-100%', position: 'absolute' }, transition: { ease: 'easeInOut', duration: 0.3 }, sx: {
                        width: '100%',
                    } }, { children: _jsxs(Box, __assign({ sx: { px: 3, py: 2 } }, { children: [_jsxs(Stack, __assign({ direction: "row", spacing: 2 }, { children: [_jsx(Avatar, { name: "".concat((_j = (_h = contact === null || contact === void 0 ? void 0 : contact.person) === null || _h === void 0 ? void 0 : _h.firstName) !== null && _j !== void 0 ? _j : '', " ").concat((_l = (_k = contact === null || contact === void 0 ? void 0 : contact.person) === null || _k === void 0 ? void 0 : _k.lastName) !== null && _l !== void 0 ? _l : ''), src: (_o = (_m = contact === null || contact === void 0 ? void 0 : contact.person) === null || _m === void 0 ? void 0 : _m.avatarUrl) !== null && _o !== void 0 ? _o : undefined, sx: { width: 62, height: 62, fontSize: 20 } }), _jsxs(Stack, { children: [_jsxs(Typography, __assign({ variant: "h6" }, { children: [(_p = contact === null || contact === void 0 ? void 0 : contact.person) === null || _p === void 0 ? void 0 : _p.firstName, " ", (_q = contact === null || contact === void 0 ? void 0 : contact.person) === null || _q === void 0 ? void 0 : _q.lastName] })), _jsxs(Box, __assign({ component: "dl", sx: {
                                                    m: 0,
                                                    mt: 0.5,
                                                    display: 'grid',
                                                    gridTemplateColumns: 'min-content auto',
                                                    gridColumnGap: 8,
                                                } }, { children: [_jsx(Box, __assign({ component: "dt", sx: { color: 'slate.600' } }, { children: t('common:relationship') })), _jsx(Box, __assign({ component: "dd", sx: { m: 0 } }, { children: contactsRelationshipType
                                                            ? t("common:relationshipType.".concat(contactsRelationshipType))
                                                            : '-' })), _jsx(Box, __assign({ component: "dt", sx: { color: 'slate.600' } }, { children: t('common:language') })), _jsx(Box, __assign({ component: "dd", sx: { m: 0 } }, { children: "-" }))] }))] })] })), _jsxs(Stack, __assign({ direction: "row", spacing: 1, sx: { mt: 2, mb: 3 } }, { children: [_jsx(Button, __assign({ variant: "contained", sx: { flex: 1 }, onClick: function () { return console.log('open send sms modal'); } }, { children: "SMS" })), _jsx(Button, __assign({ variant: "contained", sx: { flex: 1 }, onClick: function () { return console.log('open send mail popup'); } }, { children: t('mail:sendMail') }))] })), _jsxs(Box, __assign({ component: "dl", sx: {
                                    m: 0,
                                    mt: 0.5,
                                } }, { children: [_jsxs(Box, __assign({ sx: {
                                            display: 'grid',
                                            gridTemplateColumns: 'min-content auto',
                                            gridColumnGap: 16,
                                            gridRowGap: 4,
                                        } }, { children: [_jsxs(Stack, __assign({ direction: "row", spacing: 0.75, alignItems: "center" }, { children: [_jsx(PhoneIcon, { sx: { color: 'slate.400', width: 20, height: 20 } }), _jsx(Box, __assign({ component: "dt", sx: { color: 'slate.600' } }, { children: t('common:phone') }))] })), _jsx(Box, __assign({ component: "dd", sx: { m: 0 } }, { children: (_t = (_s = (_r = contact === null || contact === void 0 ? void 0 : contact.personalInformation) === null || _r === void 0 ? void 0 : _r.primaryPhoneNumber) === null || _s === void 0 ? void 0 : _s.number) !== null && _t !== void 0 ? _t : '-' })), _jsxs(Stack, __assign({ direction: "row", spacing: 0.75, alignItems: "center" }, { children: [_jsx(MailIcon, { sx: { color: 'slate.400', width: 20, height: 20 } }), _jsx(Box, __assign({ component: "dt", sx: { color: 'slate.600' } }, { children: t('common:email') }))] })), _jsx(Box, __assign({ component: "dd", sx: { m: 0 } }, { children: (_w = (_v = (_u = contact === null || contact === void 0 ? void 0 : contact.personalInformation) === null || _u === void 0 ? void 0 : _u.primaryEmail) === null || _v === void 0 ? void 0 : _v.email) !== null && _w !== void 0 ? _w : '-' }))] })), _jsxs(Stack, { children: [_jsxs(Stack, __assign({ direction: "row", spacing: 0.75, alignItems: "center", mt: 2 }, { children: [_jsx(HouseLocationIcon, { sx: { color: 'slate.400', width: 20, height: 20 } }), _jsx(Box, __assign({ component: "dt", sx: { color: 'slate.600' } }, { children: t('people:addressLocation') }))] })), _jsx(Box, __assign({ component: "dd", sx: { m: 0 } }, { children: joinAddress((_x = contact === null || contact === void 0 ? void 0 : contact.personalInformation) === null || _x === void 0 ? void 0 : _x.primaryAddress) })), _jsxs(Stack, __assign({ direction: "row", spacing: 0.75, alignItems: "center", mt: 2 }, { children: [_jsx(LabelsIcon, { sx: { color: 'slate.400', width: 20, height: 20 } }), _jsx(Box, __assign({ component: "dt", sx: { color: 'slate.600' } }, { children: t('common:groups') }))] })), _jsx(Box, __assign({ component: "dd", sx: { m: 0 } }, { children: "-" }))] })] }))] })) }), contact === null || contact === void 0 ? void 0 : contact.partyId) }))] })));
}
