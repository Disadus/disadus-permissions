import { Db, MongoClient } from 'mongodb';
import { matchesPermissions } from './permissionMatcher';

export interface User {
  id: string,
  permissions: [],
}

export class PermissionsManager {
  client: MongoClient;
  databaseName: string;
  collectionName: string;
  db: Db;

  constructor(c: MongoClient, dn = '_DisadusPermissions', cn = 'Permissions') {
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

  addUserPermission = async (user: string, permission: string) => {
    const userData = await this.db
      .collection(this.collectionName)
      .findOne({ id: user });

    if (!userData) {
      await this.db.collection(this.collectionName).insertOne({
        id: user,
        permissions: [permission],
      });
    } else {
      await this.db.collection(this.collectionName).updateOne(
        {
          id: user,
        },
        {
          permissions: [...Array.from(new Set(userData.permissions.concat(permission)))],
        }
      );
    }
  };

  addUserPermissions = async (user: string, permissions: string[]) => {
    const userData = await this.db
      .collection(this.collectionName)
      .findOne({ id: user });

    if (!userData) {
      await this.db.collection(this.collectionName).insertOne({
        id: user,
        permissions: [...Array.from(new Set(permissions))],
      });
    } else {
      await this.db.collection(this.collectionName).updateOne(
        {
          id: user,
        },
        {
          permissions: [...Array.from(new Set(userData.permissions.concat(permissions)))],
        }
      );
    }
  };

  removeUserPermission = async (user: string, permission: string) => {
    const userData = await this.db
      .collection(this.collectionName)
      .findOne({ id: user });

    if (userData) {
      await this.db.collection(this.collectionName).updateOne(
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

  removeUserPermissions = async (user: string, permissions: string[]) => {
    const userData = await this.db
      .collection(this.collectionName)
      .findOne({ id: user });

    if (userData) {
      await this.db.collection(this.collectionName).updateOne(
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

  getUserPermissionsList = async (user: string): Promise<string[] | null> => {
    const userData = await this.db
      .collection(this.collectionName)
      .findOne({ id: user });

    if (!userData) {
      return null;
    }

    return userData.permissions;
  };

  setUserPermissions = async (user: string, permissions: string[]) => {
    const userData = await this.db.collection(this.collectionName).updateOne(
      {
        id: user,
      },
      {
        permissions: [...Array.from(new Set(permissions))],
      }
    );

    if (userData.modifiedCount == 0) {
      await this.db.collection(this.collectionName).insertOne({
        id: user,
        permissions: [...Array.from(new Set(permissions))],
      });
    }
  };

  removeUser = async (user: string) => {
    await this.db.collection(this.collectionName).deleteOne({ id: user });
  };

  userHasPermission = async (
    user: string,
    query: string,
    caseSensitive = true
  ): Promise<boolean> => {
    const userData = await this.db
      .collection(this.collectionName)
      .findOne({ id: user });

    if (!userData) {
      return false;
    }

    return matchesPermissions(query, userData.permissions, caseSensitive);
  };

  userHasPermissions = async (
    user: string,
    queries: string[],
    caseSensitive = true
  ): Promise<boolean> => {
    const userData = await this.db
      .collection(this.collectionName)
      .findOne({ id: user });

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
