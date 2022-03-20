import { Db, MongoClient } from 'mongodb';
export interface User {
    id: string;
    permissions: [];
}
export declare class PermissionsManager {
    client: MongoClient;
    databaseName: string;
    globalCollectionName: string;
    db: Db;
    constructor(c: MongoClient, dn?: string, cn?: string);
    setup: () => Promise<void>;
    _authenticateScope: (scopeName: string) => Promise<void>;
    addUserPermission: (user: string, permission: string, scopeName?: string | undefined) => Promise<void>;
    addUserPermissions: (user: string, permissions: string[], scopeName?: string | undefined) => Promise<void>;
    removeUserPermission: (user: string, permission: string, scopeName?: string | undefined) => Promise<void>;
    removeUserPermissions: (user: string, permissions: string[], scopeName?: string | undefined) => Promise<void>;
    getUserPermissionsList: (user: string, scopeName?: string | undefined) => Promise<string[] | null>;
    setUserPermissions: (user: string, permissions: string[], scopeName?: string | undefined) => Promise<void>;
    removeUser: (user: string, scopeName?: string | undefined) => Promise<void>;
    userHasPermission: (user: string, query: string, caseSensitive?: boolean, scopeName?: string | undefined) => Promise<boolean>;
    userHasPermissions: (user: string, queries: string[], caseSensitive?: boolean, scopeName?: string | undefined) => Promise<boolean>;
}
export default PermissionsManager;
//# sourceMappingURL=PermissionsManager.d.ts.map