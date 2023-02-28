import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
export function joinAddress(address, options) {
    var _a = options !== null && options !== void 0 ? options : {}, _b = _a.emptyValue, emptyValue = _b === void 0 ? '-' : _b, _c = _a.separator, separator = _c === void 0 ? ', ' : _c;
    if (!address) {
        return emptyValue;
    }
    var line1 = address.line1, line2 = address.line2, line3 = address.line3, city = address.city, country = address.country, postCode = address.postCode;
    var filteredAddress = [line1, line2, line3, city, country, postCode].filter(function (line) { return line; });
    if (typeof separator === 'string') {
        return filteredAddress.join(separator);
    }
    return filteredAddress.map(function (value, index) { return (_jsxs(Fragment, { children: [index !== 0 && separator, value] }, index)); });
}
