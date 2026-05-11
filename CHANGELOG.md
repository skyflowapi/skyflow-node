# Changelog

All notable changes to this project will be documented as part of the release notes. 

See  [Github](https://github.com/skyflowapi/skyflow-node/releases) or [npm](https://www.npmjs.com/package/skyflow-node?activeTab=versions) for more details on each released version.

## [Unreleased] — Public Interface Cleanup (v2)

### Breaking Changes

#### Credential field renames
The credentials JSON object now uses camelCase keys. The old ALL_CAPS variants are accepted for backward compatibility but will be removed in a future release.

| Old key | New key |
|---|---|
| `clientID` | `clientId` |
| `keyID` | `keyId` |
| `tokenURI` | `tokenUri` |

**Migration:**
```diff
- { clientID: '...', keyID: '...', tokenURI: '...' }
+ { clientId: '...', keyId: '...', tokenUri: '...' }
```

#### `BearerTokenOptions.roleIDs` → `roleIds`
```diff
- generateBearerToken(path, { roleIDs: ['role1'] })
+ generateBearerToken(path, { roleIds: ['role1'] })
```

#### `SkyflowError.error.request_ID` → `requestId`
```diff
- error.error.request_ID
+ error.error.requestId
```

#### `FileUploadRequest` — `skyflowId` removed from constructor
`skyflowId` is no longer a positional argument. Set it via `FileUploadOptions.setSkyflowId()` instead.
```diff
- new FileUploadRequest(table, skyflowId, columnName)
+ const req = new FileUploadRequest(table, columnName)
+ const opts = new FileUploadOptions()
+ opts.setSkyflowId(skyflowId)
```

#### `DetokenizeOptions` / `GetOptions` — `downloadURL` → `downloadUrl`
```diff
- options.setDownloadURL(true)
+ options.setDownloadUrl(true)
```

#### `Bleep` — `start_padding` / `stop_padding` → `startPadding` / `stopPadding`
```diff
- bleep.setStartPadding(start_padding)
- bleep.setStopPadding(stop_padding)
+ bleep.setStartPadding(startPadding)
+ bleep.setStopPadding(stopPadding)
```

### Behavior Changes

- **`insertedFields` always array**: `InsertResponse.insertedFields` is now `Array<InsertResponseType>` (never `null`). An empty array is returned when there are no successful records.
- **Fail-fast validation**: `insert()` now throws `SkyflowError` (EMPTY_FIELD) before any network call when a record field value is `null`, `undefined`, or `""`. Values `0`, `false`, and `0.0` remain valid.
- **`errors` always present**: All response objects (`Insert`, `Update`, `Get`, `Delete`, `Query`, `Tokenize`, `DeidentifyText`, `DeidentifyFile`) always include an `errors` field — `null` when there are no errors, never absent.
