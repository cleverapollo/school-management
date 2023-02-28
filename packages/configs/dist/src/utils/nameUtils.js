export var displayName = function (person) {
    if (person == null) {
        return "";
    }
    else {
        return "".concat(person.firstName, " ").concat(person.lastName);
    }
};
