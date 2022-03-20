import { Db, MongoClient } from 'mongodb';
import { matchesPermissions } from './permissionMatcher';

export interface User {
  id: string;
  permissions: [];
}

export class PermissionsManager {
  client: MongoClient;
  databaseName: string;
  globalCollectionName: string;
  db: Db;

  constructor(
    c: MongoClient,
    dn = '_DisadusPermissions',
    cn = 'GlobalPermissions'
  ) {
    this.client = c;
    this.databaseName = dn;
    this.globalCollectionName = cn;
    this.db = this.client.db(this.databaseName);
  }

  setup = async () => {
    await this._authenticateScope(this.globalCollectionName)
  }

  _authenticateScope = async (scopeName: string) => {
    if ((await this.db.listCollections({ name: scopeName }).toArray()).length == 0)
      await this.db.createCollection(scopeName);
    if (!this.db.collection(scopeName).indexExists('id')) {
      this.db
        .collection(scopeName)
        .createIndexes([{ key: { id: 'hashed' }, name: 'id' }]);
    }
  };

  addUserPermission = async (
    user: string,
    permission: string,
    scopeName?: string
  ) => {
    if (scopeName) this._authenticateScope(scopeName);

    const collection = scopeName ?? this.globalCollectionName;

    const userData = await this.db.collection(collection).findOne({ id: user });

    if (!userData) {
      await this.db.collection(collection).insertOne({
        id: user,
        permissions: [permission],
      });
    } else {
      await this.db.collection(collection).updateOne(
        {
          id: user,
        },
        {
          permissions: [
            ...Array.from(new Set(userData.permissions.concat(permission))),
          ],
        }
      );
    }
  };

  addUserPermissions = async (
    user: string,
    permissions: string[],
    scopeName?: string
  ) => {
    if (scopeName) this._authenticateScope(scopeName);

    const collection = scopeName ?? this.globalCollectionName;

    const userData = await this.db.collection(collection).findOne({ id: user });

    if (!userData) {
      await this.db.collection(collection).insertOne({
        id: user,
        permissions: [...Array.from(new Set(permissions))],
      });
    } else {
      await this.db.collection(collection).updateOne(
        {
          id: user,
        },
        {
          permissions: [
            ...Array.from(new Set(userData.permissions.concat(permissions))),
          ],
        }
      );
    }
  };

  removeUserPermission = async (
    user: string,
    permission: string,
    scopeName?: string
  ) => {
    if (scopeName) this._authenticateScope(scopeName);

    const collection = scopeName ?? this.globalCollectionName;

    const userData = await this.db.collection(collection).findOne({ id: user });

    if (userData) {
      await this.db.collection(collection).updateOne(
        {
          id: user,
        },
        {
          permissions: userData.permissions.filter(
            (v: string) => v != permission
          ),
        }
      );
    }
  };

  removeUserPermissions = async (
    user: string,
    permissions: string[],
    scopeName?: string
  ) => {
    if (scopeName) this._authenticateScope(scopeName);

    const collection = scopeName ?? this.globalCollectionName;

    const userData = await this.db.collection(collection).findOne({ id: user });

    if (userData) {
      await this.db.collection(collection).updateOne(
        {
          id: user,
        },
        {
          permissions: userData.permissions.filter(
            (v: string) => permissions.indexOf(v) != -1
          ),
        }
      );
    }
  };

  getUserPermissionsList = async (
    user: string,
    scopeName?: string
  ): Promise<string[] | null> => {
    if (scopeName) this._authenticateScope(scopeName);

    const collection = scopeName ?? this.globalCollectionName;

    const userData = await this.db.collection(collection).findOne({ id: user });

    if (!userData) {
      return null;
    }

    return userData.permissions;
  };

  setUserPermissions = async (
    user: string,
    permissions: string[],
    scopeName?: string
  ) => {
    if (scopeName) this._authenticateScope(scopeName);

    const collection = scopeName ?? this.globalCollectionName;

    const userData = await this.db.collection(collection).updateOne(
      {
        id: user,
      },
      {
        permissions: [...Array.from(new Set(permissions))],
      }
    );

    if (userData.modifiedCount == 0) {
      await this.db.collection(collection).insertOne({
        id: user,
        permissions: [...Array.from(new Set(permissions))],
      });
    }
  };

  removeUser = async (user: string, scopeName?: string) => {
    if (scopeName) this._authenticateScope(scopeName);

    const collection = scopeName ?? this.globalCollectionName;

    await this.db.collection(collection).deleteOne({ id: user });
  };

  userHasPermission = async (
    user: string,
    query: string,
    caseSensitive = true,
    scopeName?: string
  ): Promise<boolean> => {
    if (scopeName) this._authenticateScope(scopeName);

    const collection = scopeName ?? this.globalCollectionName;

    const userData = await this.db.collection(collection).findOne({ id: user });

    if (!userData) {
      return false;
    }

    return matchesPermissions(query, userData.permissions, caseSensitive);
  };

  userHasPermissions = async (
    user: string,
    queries: string[],
    caseSensitive = true,
    scopeName?: string
  ): Promise<boolean> => {
    if (scopeName) this._authenticateScope(scopeName);

    const collection = scopeName ?? this.globalCollectionName;

    const userData = await this.db.collection(collection).findOne({ id: user });

    if (!userData) {
      return false;
    }

    // It has to match all of the queries
    for (let query of queries) {
      if (!matchesPermissions(query, userData.permissions, caseSensitive)) {
        return false;
      }
    }

    return true;
  };
}

export default PermissionsManager;
