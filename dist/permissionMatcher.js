"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesPermissions = exports.matchesPermission = void 0;
var matchesPermission = function (query, permission, caseSensitive) {
    if (caseSensitive === void 0) { caseSensitive = true; }
    var queryPaths = caseSensitive ? query.split('.') : query.toLowerCase().split('.');
    var permissionPaths = caseSensitive ? permission.split('.') : permission.toLowerCase().split('.');
    // The shorter path will be queried because it will either not match or it will end in a *
    var shorterPath = queryPaths.length < permissionPaths.length ? queryPaths : permissionPaths;
    var longerPath = queryPaths.length >= permissionPaths.length ? queryPaths : permissionPaths;
    // Paths work in a way that you can do this.is.a.permission and it will get 
    // changed into ['this', 'is', 'a', 'permission'] and it can be matched with
    // the exact same list, or one could also use the *, so a query such as
    // this.is.a.* will be parsed as ['this', 'is', 'a', '*'] and will match not
    // only this.is.a.permission but also this.is.a.test or any any permission
    // which is a child of the main permission
    //
    // There are some edge cases to note:
    // 
    // First, if the query is something like this.is.a.permission but the user's
    // permission is this.is.a.permission.*, for the sake of security this will
    // return `false`, as they only have the children of this.is.a.permission
    // not this.is.a.permission
    //
    // Vice versa, if the user has this.is.a.permission and the query is
    // this.is.a.permission.*, this will also return `false` because the
    // query will only search the children of this.is.a.permission not
    // the actual permission this.is.a.permission
    for (var i = 0; i < shorterPath.length; i++) {
        // The shorter path ends with a *, which means that if it made it this far it matches the longerPath
        // If the shorter path and the longer path are equal then the longer path could have a * and the shorther path would match
        if (shorterPath[i] == '*' || longerPath[i] == "*") {
            return true;
        }
        else if (shorterPath[i] != longerPath[i]) {
            // If it does not match then, well... it does not match
            return false;
        }
        // Otherwise it matches and the search can continue
    }
    // If the entire thing matches return true
    return true;
};
exports.matchesPermission = matchesPermission;
var matchesPermissions = function (query, permissions, caseSensitive) {
    if (caseSensitive === void 0) { caseSensitive = true; }
    for (var _i = 0, permissions_1 = permissions; _i < permissions_1.length; _i++) {
        var permission = permissions_1[_i];
        if ((0, exports.matchesPermission)(query, permission, caseSensitive)) {
            return true;
        }
    }
    return false;
};
exports.matchesPermissions = matchesPermissions;
