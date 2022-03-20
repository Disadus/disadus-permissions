import { Db, MongoClient } from 'mongodb';
export interface User {
    id: string;
    permissions: [];
}
export declare class PermissionsManager {
    client: MongoClient;
    databaseName: string;
    collectionName: string;
    db: Db;
    constructor(c: MongoClient, dn?: string, cn?: string);
    addUserPermission: (user: string, permission: string) => Promise<void>;
    addUserPermissions: (user: string, permissions: string[]) => Promise<void>;
    removeUserPermission: (user: string, permission: string) => Promise<void>;
    removeUserPermissions: (user: string, permissions: string[]) => Promise<void>;
    getUserPermissionsList: (user: string) => Promise<string[] | null>;
    setUserPermissions: (user: string, permissions: string[]) => Promise<void>;
    removeUser: (user: string) => Promise<void>;
    userHasPermission: (user: string, query: string, caseSensitive?: boolean) => Promise<boolean>;
    userHasPermissions: (user: string, queries: string[], caseSensitive?: boolean) => Promise<boolean>;
}
export default PermissionsManager;
//# sourceMappingURL=PermissionsManager.d.ts.map