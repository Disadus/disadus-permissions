"use strict";
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
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsManager = void 0;
var permissionMatcher_1 = require("./permissionMatcher");
var PermissionsManager = /** @class */ (function () {
    function PermissionsManager(c, dn, cn) {
        if (dn === void 0) { dn = '_DisadusPermissions'; }
        if (cn === void 0) { cn = 'Permissions'; }
        var _this = this;
        this.addUserPermission = function (user, permission) { return __awaiter(_this, void 0, void 0, function () {
            var userData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .collection(this.collectionName)
                            .findOne({ id: user })];
                    case 1:
                        userData = _a.sent();
                        if (!!userData) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.collection(this.collectionName).insertOne({
                                id: user,
                                permissions: [permission],
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.db.collection(this.collectionName).updateOne({
                            id: user,
                        }, {
                            permissions: __spreadArray([], Array.from(new Set(userData.permissions.concat(permission))), true),
                        })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.addUserPermissions = function (user, permissions) { return __awaiter(_this, void 0, void 0, function () {
            var userData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .collection(this.collectionName)
                            .findOne({ id: user })];
                    case 1:
                        userData = _a.sent();
                        if (!!userData) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.collection(this.collectionName).insertOne({
                                id: user,
                                permissions: __spreadArray([], Array.from(new Set(permissions)), true),
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.db.collection(this.collectionName).updateOne({
                            id: user,
                        }, {
                            permissions: __spreadArray([], Array.from(new Set(userData.permissions.concat(permissions))), true),
                        })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.removeUserPermission = function (user, permission) { return __awaiter(_this, void 0, void 0, function () {
            var userData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .collection(this.collectionName)
                            .findOne({ id: user })];
                    case 1:
                        userData = _a.sent();
                        if (!userData) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.collection(this.collectionName).updateOne({
                                id: user,
                            }, {
                                permissions: userData.permissions.filter(function (v) { return v != permission; }),
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.removeUserPermissions = function (user, permissions) { return __awaiter(_this, void 0, void 0, function () {
            var userData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .collection(this.collectionName)
                            .findOne({ id: user })];
                    case 1:
                        userData = _a.sent();
                        if (!userData) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.collection(this.collectionName).updateOne({
                                id: user,
                            }, {
                                permissions: userData.permissions.filter(function (v) { return permissions.indexOf(v) != -1; }),
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.getUserPermissionsList = function (user) { return __awaiter(_this, void 0, void 0, function () {
            var userData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .collection(this.collectionName)
                            .findOne({ id: user })];
                    case 1:
                        userData = _a.sent();
                        if (!userData) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, userData.permissions];
                }
            });
        }); };
        this.setUserPermissions = function (user, permissions) { return __awaiter(_this, void 0, void 0, function () {
            var userData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.collection(this.collectionName).updateOne({
                            id: user,
                        }, {
                            permissions: __spreadArray([], Array.from(new Set(permissions)), true),
                        })];
                    case 1:
                        userData = _a.sent();
                        if (!(userData.modifiedCount == 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.db.collection(this.collectionName).insertOne({
                                id: user,
                                permissions: __spreadArray([], Array.from(new Set(permissions)), true),
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.removeUser = function (user) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.collection(this.collectionName).deleteOne({ id: user })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.userHasPermission = function (user, query, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var userData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.db
                                .collection(this.collectionName)
                                .findOne({ id: user })];
                        case 1:
                            userData = _a.sent();
                            if (!userData) {
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/, (0, permissionMatcher_1.matchesPermissions)(query, userData.permissions, caseSensitive)];
                    }
                });
            });
        };
        this.userHasPermissions = function (user, queries, caseSensitive) {
            if (caseSensitive === void 0) { caseSensitive = true; }
            return __awaiter(_this, void 0, void 0, function () {
                var userData, _i, queries_1, query;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.db
                                .collection(this.collectionName)
                                .findOne({ id: user })];
                        case 1:
                            userData = _a.sent();
                            if (!userData) {
                                return [2 /*return*/, false];
                            }
                            // It has to match all of the queries
                            for (_i = 0, queries_1 = queries; _i < queries_1.length; _i++) {
                                query = queries_1[_i];
                                if (!(0, permissionMatcher_1.matchesPermissions)(query, userData.permissions, caseSensitive)) {
                                    return [2 /*return*/, false];
                                }
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        this.client = c;
        this.databaseName = dn;
        this.collectionName = cn;
        // Setup
        //
        // For some reason I cannot store the reference to the collection
        this.db = this.client.db(this.databaseName);
        if (!this.db.collection(this.collectionName).indexExists('id')) {
            this.db
                .collection(this.collectionName)
                .createIndexes([{ key: { id: 'hashed' }, name: 'id' }]);
        }
    }
    return PermissionsManager;
}());
exports.PermissionsManager = PermissionsManager;
exports.default = PermissionsManager;
