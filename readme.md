## Disadus Permissions

Easy to use permissions library which allows you to store and match permissions!

### How Permissions Work

Permissions work in a way that you can do `this.is.a.permission` and it will get
parsed into `['this', 'is', 'a', 'permission']`. That way, it can be matched with
the same list, or one could also use a `*`.

The `\*` causes that query or permission to match all of its children, so a query of
`this.is.a.\*` would not only match `this.is.a.permission` but also `this.is.a.test`, and a
permission of `this.is.a.\*` would match a query of `this.is.a.permission`. This also makes
the permission and query `\*` match everything

There are some edge cases to note:

First, if the query is something like `this.is.a.permission` but the user's
permission is `this.is.a.permission.\*`, for the sake of security this will
return `false`, as they only have the children of `this.is.a.permission`
not `this.is.a.permission`

Vice versa, if the user has `this.is.a.permission` and the query is
`this.is.a.permission.\*`, this will also return `false` because the
query will only search the children of `this.is.a.permission` not
the actual permission `this.is.a.permission`

### Setup

To set up `disadus-permissions` you can create a `PermissionsManager` by passing in a `mongodb.MongoClient`

```ts
import { MongoClient } from 'mongodb';
import PermissionsManager from '@disadus/disadus-permissions';

const client: mongoDB.MongoClient = new mongoDB.MongoClient(
  process.env.DB_CONN_STRING
);
const Manager = new PermissionsManager(
  client
  // You can also pass in a databaseName argument for a specific name for the database, default "_DisadusPermissions"
  // You can also pass in a collectionName argument for a specific name for the collection, default "Permissions"
);
```

And simple as that, it will create and set up the permission database if it has not been set up before!

### Using `PermissionsMaganer`

The `PermissionsManager`'s main purpose is to allow you to manipulate the permissions of users, as per its name.
Here are the functions it has to help you do that:

#### `async addUserPermission(user: string, permission: string)`

Allows you to add permissions to a user, and will create a user if the user does not exist. This will remove duplicate permissions.

The `user` argument is the id of the user you are attempting to modify.

The `permission` argument is the permission you want to add to the user.

```ts
await Manager.addUserPermission("K8OJF", "this.is.a.permission")
```

#### `async addUserPermissions(user: string, permissions: string[])`

Very similar to `addUserPermission` but instead will add multiple permissions at the same time, this will also create a user if it does not exist. This will remove duplicate permissions.

The `user` argument is the id of the user you are attempting to modify.

The `permissions` argument is the list of permissions you want to add to the user.

```ts
await Manager.addUserPermissions("K8OJF", ["this.is.a.permission", "this.is.a.test"])
```

#### `async removeUserPermission(user: string, permission: string)`

This will remove all instances of a specific permission from a user, this will not create a user and it will not remove duplicate permissions.

The `user` argument is the id of the user you are attempting to modify.

The `permission` argument is the permission you want to remove from the user.

Note: This currently does not allow selecting permissions based on a permission query.

```ts
await Manager.removeUserPermission("K8OJF", "this.is.a.permission")
```

#### `async removeUserPermissions(user: string, permission: string[])`

This will remove all instances of a specific set of permissions from a user, this will not create a user and it will not remove duplicate permissions.

The `user` argument is the id of the user you are attempting to modify.

The `permissions` argument is the permissions you want to remove from the user.

Note: This currently does not allow selecting permissions based on a permission query.

```ts
await Manager.removeUserPermissions("K8OJF", ["this.is.a.permission", "this.is.a.test"])
```

#### `async getUserPermissionsList(user: string): Promise<string[] | null>`

This will get all of the permissions associated with a user, if the user does not exist it will instead return `null`

The `user` argument is the id of the user you are attempting to find.

```ts
await Manager.getUserPermissionsList("K8OJF")
```

#### `async setUserPermissions(user: string, permissions: string[])`

This will set a user's permissions to a specific array, this will create a new user if they do not exist and will remove duplicates.

The `user` argument is the id of the user you are attempting to modify.

The `permissions` argument is the permissions you want to give the user.

```ts
await Manager.setUserPermissions("K8OJF", ["this.is.a.permission", "this.is.another.permission", "this.is.a.test"])
```

#### `async removeUser(user: string)`

This will remove a user from the collection of users.

The `user` argument is the id of the user you are attempting to remove.

```ts
await Manager.removeUser("K8OJF")
```

#### `async userHasPermissions = (user: string, query: string, caseSensitive = true): Promise<boolean>`

This will check if a user has a certain permission given a certain query string (See [How Permissions Work](#how-permissions-work)).

The `user` argument is the id of the user you are attempting to query.

The `query` argument is the query string you will be using to search through the permissions.

The `caseSensitive` argument indicates whether the query is case sensitive (Default `true`).

```ts
await Manager.userHasPermissions("K8OJF", "this.is.a.*")
await Manager.userHasPermissions("K8OJF", "this.is.a.CaseInsensitivePermission", false)
```

#### `async userHasPermissions = (user: string, queries: string[], caseSensitive = true): Promise<boolean>`

This will check if a user has all of the permissions requested given the query strings passed in (See [How Permissions Work](#how-permissions-work)).

The `user` argument is the id of the user you are attempting to query.

The `queries` argument is the list of query strings you will be using to search through the permissions.

The `caseSensitive` argument indicates whether the query is case sensitive (Default `true`).

```ts
await Manager.userHasPermissions("K8OJF", ["this.is.a.permission", "this.is.another.*"])
```