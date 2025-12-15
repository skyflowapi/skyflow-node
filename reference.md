# Reference

## Accounts

<details><summary><code>client.accounts.<a href="/src/api/resources/accounts/client/Client.ts">accountServiceListAccounts</a>({ ...params }) -> Skyflow.V1ListAccountsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists accounts that the user can access.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.accounts.accountServiceListAccounts({
    userEmail: "userEmail",
    name: "name",
    status: "NONE",
    offset: "offset",
    limit: "limit",
    accountID: "accountID",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.AccountServiceListAccountsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Accounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.accounts.<a href="/src/api/resources/accounts/client/Client.ts">accountServiceGetAccount</a>(id) -> Skyflow.V1GetAccountResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns an account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.accounts.accountServiceGetAccount("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the account.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Accounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.accounts.<a href="/src/api/resources/accounts/client/Client.ts">accountServiceUpdateAccount</a>(id, { ...params }) -> Skyflow.V1UpdateAccountResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.accounts.accountServiceUpdateAccount("ID", {
    account: {
        name: "ld9to",
        displayName: "ut sit non",
        description: "ullamco labore nulla irure enim",
        ID: "ad fugiat sed veli",
        namespace: "cons",
        contactAddress: {
            streetAddress: "officia sint velit",
            city: "laborum ex deserunt nisi Excepteur",
            state: "occaecat voluptate enim",
            country: "occaecat",
            zip: -82629808,
        },
        BasicAudit: {
            CreatedBy: "reprehenderit Lorem velit exercitation deserunt",
            LastModifiedBy: "velit nisi",
            CreatedOn: "proident",
            LastModifiedOn: "aliquip nisi esse",
        },
        status: "NONE",
        tenantType: "NONE_TYPE",
        accountType: "TYPE_NONE",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the account.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.AccountServiceUpdateAccountBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Accounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.accounts.<a href="/src/api/resources/accounts/client/Client.ts">accountServiceListRegions</a>(accountId) -> Skyflow.V1ListRegionsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List regions availble to an account. You can <a href='#WorkspaceService_CreateWorkspace'>create workspaces</a> in available regions.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.accounts.accountServiceListRegions("accountID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**accountId:** `string` — ID of the account.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Accounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.accounts.<a href="/src/api/resources/accounts/client/Client.ts">accountServiceListResources</a>({ ...params }) -> Skyflow.V1ListResourcesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List resources under a given resource.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.accounts.accountServiceListResources({
    "resource.ID": "resource.ID",
    "resource.type": "NONE",
    "resource.name": "resource.name",
    "resource.namespace": "resource.namespace",
    "resource.description": "resource.description",
    "resource.status": "NONE",
    "resource.displayName": "resource.displayName",
    offset: "offset",
    limit: "limit",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.AccountServiceListResourcesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Accounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Pipelines

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">accountServiceListPipelineEncryptionKeys</a>(accountId) -> Skyflow.V1ListPipelineEncryptionKeysResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets public encryption keys for the specified account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.accountServiceListPipelineEncryptionKeys("accountID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**accountId:** `string` — ID of the account.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">accountServiceCreatePipelineEncryptionKey</a>(accountId, { ...params }) -> Skyflow.V1CreatePipelineEncryptionKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a PGP encryption key to use in a pipeline.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.accountServiceCreatePipelineEncryptionKey("accountID", {
    encryptionProtocol: "NONE_PROTOCOL",
    pgpKey: {
        privateKey: "aliqua",
        passphrase: "sunt in sint ut",
        publicKey: "e",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**accountId:** `string` — ID of the account.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.AccountServiceCreatePipelineEncryptionKeyBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">accountServiceGetPipelineEncryptionKey</a>(accountId, id) -> Skyflow.V1GetPipelineEncryptionKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets the specified public encryption key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.accountServiceGetPipelineEncryptionKey("accountID", "ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**accountId:** `string` — ID of the account.

</dd>
</dl>

<dl>
<dd>

**id:** `string` — ID of the key.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">accountServiceDeletePipelineEncryptionKey</a>(accountId, id) -> Skyflow.V1DeletePipelineEncryptionKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the encryption key pair for the specified pipeline.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.accountServiceDeletePipelineEncryptionKey("accountID", "ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**accountId:** `string` — ID of the account.

</dd>
</dl>

<dl>
<dd>

**id:** `string` — ID of the key.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">accountServiceRotatePipelineEncryptionKey</a>(accountId, id, { ...params }) -> Skyflow.V1RotatePipelineEncryptionKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Rotates the encryption key pair for the specified pipeline.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.accountServiceRotatePipelineEncryptionKey("accountID", "ID", {
    encryptionProtocol: "NONE_PROTOCOL",
    pgpKey: {
        privateKey: "officia",
        passphrase: "qui",
        publicKey: "dolore et",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**accountId:** `string` — ID of the account.

</dd>
</dl>

<dl>
<dd>

**id:** `string` — ID of the key.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.AccountServiceRotatePipelineEncryptionKeyBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">pipelineServiceListPipelines</a>({ ...params }) -> Skyflow.V1ListPipelinesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the pipelines you can access.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.pipelineServiceListPipelines({
    vaultID: "vaultID",
    "filterOps.name": "filterOps.name",
    "filterOps.runTrigger": "TRIGGER_NONE",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: 1000000,
    limit: 1000000,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.PipelineServiceListPipelinesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">pipelineServiceCreatePipeline</a>({ ...params }) -> Skyflow.V1CreatePipelineResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a pipeline.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.pipelineServiceCreatePipeline({
    name: "eu adipisicing consectetur eiusmod velit",
    displayName: "id commodo",
    description: "nulla",
    vaultID: "cupidatat incididunt deserunt",
    source: {
        dataFormat: "CSV",
        fileNameRegexes: ["elit Ut id dolor ea", "in amet", "dolor elit nulla aliquip adipisicing"],
        encryptionProtocol: "NONE_PROTOCOL",
        encryptionKeyID: "sit deserunt est fugiat",
        ftpServer: {
            transferProtocol: "FTPS",
            plainText: {
                hostname: "cupidatat nostrud dolor Du",
                port: "sint do anim in cillum",
                username: "id do irure exercitation consequat",
                password: "ea",
                sshKeyID: "ad Excepteur",
            },
            encrypted: {
                nostrud_4: "dolor ex",
                encryptedCredentials: "non ad aute fugiat",
            },
            skyflowHosted: true,
        },
        s3Bucket: {
            name: "tempor incididunt in",
            region: "amet Ut ",
            assumedRoleARN: "elit dolore",
        },
        fileSystem: {
            inputDirectory: "tempor nisi qui",
            outputDirectory: "dolor exercitation",
        },
    },
    destination: {
        dataFormat: "CSV",
        fileNameRegexes: ["sit esse irure sed culp", "ullamc", "tempor dolor"],
        encryptionProtocol: "NONE_PROTOCOL",
        encryptionKeyID: "incididunt",
        ftpServer: {
            transferProtocol: "FTPS",
            plainText: {
                hostname: "ut",
                port: "minim dolor elit laboris",
                username: "sunt commodo incididunt",
                password: "adipisicing cupidatat labore",
                sshKeyID: "in Duis",
            },
            encrypted: {
                encryptedCredentials: "ad sunt occaecat",
            },
            skyflowHosted: false,
        },
        s3Bucket: {
            name: "aliqua enim ullamco nulla in",
            region: "ut ullamco dolore laboris",
            assumedRoleARN: "adi",
        },
        fileSystem: {
            inputDirectory: "minim labore irure esse",
            outputDirectory: "id commodo quis",
        },
    },
    dataMappings: [
        {
            tableName: "ipsum enim anim sed ut",
            primaryKey: "officia do dolore",
            fieldMapping: [
                {
                    sourceField: {
                        columnName: "incididunt nisi magna",
                        jsonFieldName: "voluptate",
                        regularExpression: "est dolor nisi in",
                        tokenColumnName: "dolore ipsum aute mollit voluptate",
                        fixedWidthField: {
                            value: {
                                positionFirst: 98987597,
                                positionLast: -8425045,
                                trimWhitespace: false,
                            },
                            matchLines: {
                                positionFirst: 90860125,
                                positionLast: -26762926,
                                regex: "elit",
                            },
                        },
                    },
                    columnName: "veniam ut eu",
                    condition: {
                        sourceField: {
                            columnName: "est velit eiusmod",
                            jsonFieldName: "esse ut do",
                            regularExpression: "dolore",
                            tokenColumnName: "incididunt occaecat cupidatat labore nostrud",
                            fixedWidthField: {
                                value: {
                                    positionFirst: 39971605,
                                    positionLast: -95696699,
                                    trimWhitespace: true,
                                },
                                matchLines: {
                                    positionFirst: -90716334,
                                    positionLast: -74453305,
                                    regex: "reprehenderit",
                                },
                            },
                        },
                        value: "dolore amet",
                        comparator: "NONE_COMPARATOR",
                    },
                },
                {
                    sourceField: {
                        columnName: "nisi",
                        jsonFieldName: "in sit ipsum",
                        regularExpression: "mollit et veniam officia",
                        tokenColumnName: "magna proident ad",
                        fixedWidthField: {
                            value: {
                                positionFirst: 43144378,
                                positionLast: 47935885,
                                trimWhitespace: false,
                            },
                            matchLines: {
                                positionFirst: 57122483,
                                positionLast: 36541906,
                                regex: "incididunt ",
                            },
                        },
                    },
                    columnName: "",
                    condition: {
                        sourceField: {
                            columnName: "Ut sint anim",
                            jsonFieldName: "adipisicing",
                            regularExpression: "sunt",
                            tokenColumnName: "elit non",
                            fixedWidthField: {
                                value: {
                                    positionFirst: -92049090,
                                    positionLast: 10913852,
                                    trimWhitespace: false,
                                },
                                matchLines: {
                                    positionFirst: -5152405,
                                    positionLast: 21968645,
                                    regex: "enim Duis",
                                },
                            },
                        },
                        value: "nostrud est amet dolor proident",
                        comparator: "NONE_COMPARATOR",
                    },
                },
                {
                    sourceField: {
                        columnName: "mini",
                        jsonFieldName: "voluptate",
                        regularExpression: "consequat",
                        tokenColumnName: "tempor ",
                        fixedWidthField: {
                            value: {
                                positionFirst: 83247821,
                                positionLast: -35152964,
                                trimWhitespace: false,
                            },
                            matchLines: {
                                positionFirst: 57673593,
                                positionLast: 33226841,
                                regex: "adipisicing nisi Duis Excepteur Ut",
                            },
                        },
                    },
                    columnName: "ullamco",
                    condition: {
                        sourceField: {
                            columnName: "culpa veniam incididunt",
                            jsonFieldName: "velit Ut",
                            regularExpression: "ea ex nulla",
                            tokenColumnName: "dolore",
                            fixedWidthField: {
                                value: {
                                    positionFirst: -79757285,
                                    positionLast: -85654917,
                                    trimWhitespace: false,
                                },
                                matchLines: {
                                    positionFirst: -22195160,
                                    positionLast: -35982689,
                                    regex: "in",
                                },
                            },
                        },
                        value: "ut",
                        comparator: "NONE_COMPARATOR",
                    },
                },
            ],
        },
        {
            tableName: "",
            primaryKey: "consectetur cupidatat eu voluptate ullamco",
            fieldMapping: [
                {
                    sourceField: {
                        columnName: "cupidatat et",
                        jsonFieldName: "deserunt en",
                        regularExpression: "in eiusmod tempor",
                        tokenColumnName: "velit",
                        fixedWidthField: {
                            value: {
                                positionFirst: 10752238,
                                positionLast: 26992085,
                                trimWhitespace: false,
                            },
                            matchLines: {
                                positionFirst: 61678895,
                                positionLast: -56768917,
                                regex: "veniam",
                            },
                        },
                    },
                    columnName: "nisi",
                    condition: {
                        sourceField: {
                            columnName: "veniam",
                            jsonFieldName: "magna nulla aliquip pariatur",
                            regularExpression: "velit",
                            tokenColumnName: "ullamco in eiusmod qui",
                            fixedWidthField: {
                                value: {
                                    positionFirst: 47679416,
                                    positionLast: -52170528,
                                    trimWhitespace: true,
                                },
                                matchLines: {
                                    positionFirst: -21344384,
                                    positionLast: -73279463,
                                    regex: "occaecat pariatur",
                                },
                            },
                        },
                        value: "Ut incididunt minim",
                        comparator: "NONE_COMPARATOR",
                    },
                },
                {
                    sourceField: {
                        columnName: "dolor tempor consectetur",
                        jsonFieldName: "mollit ut",
                        regularExpression: "nulla occaecat sed re",
                        tokenColumnName: "et enim",
                        fixedWidthField: {
                            value: {
                                positionFirst: 92144522,
                                positionLast: -56350683,
                                trimWhitespace: false,
                            },
                            matchLines: {
                                positionFirst: 43826376,
                                positionLast: -16155347,
                                regex: "proident do non",
                            },
                        },
                    },
                    columnName: "am",
                    condition: {
                        sourceField: {
                            columnName: "quis sit nulla",
                            jsonFieldName: "esse voluptate culpa",
                            regularExpression: "aliqua",
                            tokenColumnName: "adipisicing eu magna sunt in",
                            fixedWidthField: {
                                value: {
                                    positionFirst: -61494257,
                                    positionLast: 99661735,
                                    trimWhitespace: false,
                                },
                                matchLines: {
                                    positionFirst: -31825741,
                                    positionLast: 6766704,
                                    regex: "esse culpa",
                                },
                            },
                        },
                        value: "pariatur",
                        comparator: "NONE_COMPARATOR",
                    },
                },
                {
                    sourceField: {
                        columnName: "Ut ad reprehenderit",
                        jsonFieldName: "in laboris pariatur nostrud",
                        regularExpression: "culpa velit sit des",
                        tokenColumnName: "ullamco occaecat minim ad aliqui",
                        fixedWidthField: {
                            value: {
                                positionFirst: 83166721,
                                positionLast: 3506664,
                                trimWhitespace: false,
                            },
                            matchLines: {
                                positionFirst: 55697280,
                                positionLast: 59896642,
                                regex: "Ut fugiat cillum commodo ul",
                            },
                        },
                    },
                    columnName: "consequat qui officia",
                    condition: {
                        sourceField: {
                            columnName: "in",
                            jsonFieldName: "nostrud minim",
                            regularExpression: "amet",
                            tokenColumnName: "qui tempor quis aliqua",
                            fixedWidthField: {
                                value: {
                                    positionFirst: -78009289,
                                    positionLast: 45738073,
                                    trimWhitespace: false,
                                },
                                matchLines: {
                                    positionFirst: -37466360,
                                    positionLast: 54260523,
                                    regex: "Excepteur",
                                },
                            },
                        },
                        value: "Ut labore eiusmod nostrud",
                        comparator: "NONE_COMPARATOR",
                    },
                },
            ],
        },
        {
            tableName: "officia dolore fugia",
            primaryKey: "ipsum cillum ad",
            fieldMapping: [
                {
                    sourceField: {
                        columnName: "et dolore incididunt nulla Lorem",
                        jsonFieldName: "dolor de",
                        regularExpression: "voluptate sint",
                        tokenColumnName: "elit fugiat no",
                        fixedWidthField: {
                            value: {
                                positionFirst: -67530395,
                                positionLast: 19188687,
                                trimWhitespace: true,
                            },
                            matchLines: {
                                positionFirst: -59089711,
                                positionLast: 5519803,
                                regex: "nulla ut consequat tempor minim",
                            },
                        },
                    },
                    columnName: "minim sed",
                    condition: {
                        sourceField: {
                            columnName: "consequat aliquip sunt sed non",
                            jsonFieldName: "consequat",
                            regularExpression: "in Ut Excepteur est",
                            tokenColumnName: "nisi",
                            fixedWidthField: {
                                value: {
                                    positionFirst: 5118720,
                                    positionLast: -62591073,
                                    trimWhitespace: true,
                                },
                                matchLines: {
                                    positionFirst: 56612108,
                                    positionLast: 27607916,
                                    regex: "nulla in in",
                                },
                            },
                        },
                        value: "c",
                        comparator: "NONE_COMPARATOR",
                    },
                },
                {
                    sourceField: {
                        columnName: "voluptate ",
                        jsonFieldName: "quis",
                        regularExpression: "magna laborum do officia",
                        tokenColumnName: "amet",
                        fixedWidthField: {
                            value: {
                                positionFirst: -29573511,
                                positionLast: 20456212,
                                trimWhitespace: true,
                            },
                            matchLines: {
                                positionFirst: 17828093,
                                positionLast: 29612404,
                                regex: "adipisicing ex eiusmod Duis",
                            },
                        },
                    },
                    columnName: "laboris",
                    condition: {
                        sourceField: {
                            columnName: "ea aliquip eiusmod",
                            jsonFieldName: "magn",
                            regularExpression: "ut",
                            tokenColumnName: "sit commodo Lorem Ut qui",
                            fixedWidthField: {
                                value: {
                                    positionFirst: 71357691,
                                    positionLast: 84344217,
                                    trimWhitespace: false,
                                },
                                matchLines: {
                                    positionFirst: -53656740,
                                    positionLast: -25953433,
                                    regex: "adipisicing minim non",
                                },
                            },
                        },
                        value: "est et reprehenderit mollit",
                        comparator: "NONE_COMPARATOR",
                    },
                },
                {
                    sourceField: {
                        columnName: "qui laboris dolor",
                        jsonFieldName: "ut ex ad irure",
                        regularExpression: "occaecat qui ex in nisi",
                        tokenColumnName: "cillum magna",
                        fixedWidthField: {
                            value: {
                                positionFirst: -52236350,
                                positionLast: 45105528,
                                trimWhitespace: false,
                            },
                            matchLines: {
                                positionFirst: 59452180,
                                positionLast: -97750884,
                                regex: "exercitation ea nisi consectetur sit",
                            },
                        },
                    },
                    columnName: "laborum culpa",
                    condition: {
                        sourceField: {
                            columnName: "consectetur fugiat in",
                            jsonFieldName: "aliquip",
                            regularExpression: "laboris culpa voluptate ut occaecat",
                            tokenColumnName: "elit proident ullamco nisi",
                            fixedWidthField: {
                                value: {
                                    positionFirst: 60903317,
                                    positionLast: -48444023,
                                    trimWhitespace: false,
                                },
                                matchLines: {
                                    positionFirst: 45477935,
                                    positionLast: 50124003,
                                    regex: "aute Ut do aliquip",
                                },
                            },
                        },
                        value: "irure nostrud ad",
                        comparator: "NONE_COMPARATOR",
                    },
                },
            ],
        },
    ],
    action: "NONE_PROTOCOL",
    runTriggers: ["TRIGGER_NONE", "TRIGGER_NONE", "TRIGGER_NONE"],
    primaryKey: "mollit voluptate Duis reprehenderit ullamco",
    reportOptions: {
        recordIdentifiers: ["ullamco ut mollit", "irure ullamco dolore", "nulla ad id"],
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.CreatePipelineRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">pipelineServiceGetPipeline</a>(id) -> Skyflow.V1GetPipelineResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified pipeline.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.pipelineServiceGetPipeline("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the pipeline.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">pipelineServiceDeletePipeline</a>(id) -> Skyflow.V1DeletePipelineResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified pipeline and the entities it contains.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.pipelineServiceDeletePipeline("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the pipeline.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">pipelineServiceRunPipeline</a>(id, { ...params }) -> Skyflow.V1RunPipelineResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Runs the specified pipeline.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.pipelineServiceRunPipeline("ID", {
    fileNameRegexes: ["et exercitation velit", "mollit proident", "dolore"],
    exportDirectory: "ullamco incididunt irure culpa velit",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the pipeline.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.V1PipelineServiceRunPipelineBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">pipelineServiceStopPipelineRun</a>(id, runId, { ...params }) -> Skyflow.V1StopPipelineRunResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Stops the specified pipeline run.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.pipelineServiceStopPipelineRun("ID", "runID", {
    nisic12: "occaecat consectetur",
    voluptate_ab_: 28200642.516746923,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the pipeline.

</dd>
</dl>

<dl>
<dd>

**runId:** `string` — ID of the pipeline run.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.V1PipelineServiceStopPipelineRunBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">pipelineServiceListPipelineRuns</a>(pipelineId, { ...params }) -> Skyflow.V1ListPipelineRunsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists runs of the specified pipeline.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.pipelineServiceListPipelineRuns("pipelineID", {
    "filterOps.state": "NONE_STATE",
    offset: 1000000,
    limit: 1000000,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**pipelineId:** `string` — ID of the pipeline.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.PipelineServiceListPipelineRunsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pipelines.<a href="/src/api/resources/pipelines/client/Client.ts">pipelineServiceGetPipelineRun</a>(pipelineId, id) -> Skyflow.V1GetPipelineRunResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified pipeline run.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pipelines.pipelineServiceGetPipelineRun("pipelineID", "ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**pipelineId:** `string` — ID of the pipeline.

</dd>
</dl>

<dl>
<dd>

**id:** `string` — ID of the pipeline run.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Pipelines.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Audit

<details><summary><code>client.audit.<a href="/src/api/resources/audit/client/Client.ts">auditServiceListAuditEvents</a>({ ...params }) -> Skyflow.V1AuditResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists audit events that match query parameters.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.audit.auditServiceListAuditEvents({
    "filterOps.context.changeID": "filterOps.context.changeID",
    "filterOps.context.requestID": "filterOps.context.requestID",
    "filterOps.context.traceID": "filterOps.context.traceID",
    "filterOps.context.sessionID": "filterOps.context.sessionID",
    "filterOps.context.actor": "filterOps.context.actor",
    "filterOps.context.actorType": "NONE",
    "filterOps.context.accessType": "ACCESS_NONE",
    "filterOps.context.ipAddress": "filterOps.context.ipAddress",
    "filterOps.context.origin": "filterOps.context.origin",
    "filterOps.context.authMode": "AUTH_NONE",
    "filterOps.context.jwtID": "filterOps.context.jwtID",
    "filterOps.context.bearerTokenContextID": "filterOps.context.bearerTokenContextID",
    "filterOps.parentAccountID": "filterOps.parentAccountID",
    "filterOps.accountID": "filterOps.accountID",
    "filterOps.workspaceID": "filterOps.workspaceID",
    "filterOps.vaultID": "filterOps.vaultID",
    "filterOps.resourceIDs": "filterOps.resourceIDs",
    "filterOps.actionType": "NONE",
    "filterOps.resourceType": "NONE_API",
    "filterOps.tags": "filterOps.tags",
    "filterOps.responseCode": 1,
    "filterOps.startTime": "filterOps.startTime",
    "filterOps.endTime": "filterOps.endTime",
    "filterOps.apiName": "filterOps.apiName",
    "filterOps.responseMessage": "filterOps.responseMessage",
    "filterOps.httpMethod": "filterOps.httpMethod",
    "filterOps.httpURI": "filterOps.httpURI",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    "afterOps.timestamp": "afterOps.timestamp",
    "afterOps.changeID": "afterOps.changeID",
    limit: 1000000,
    offset: 1000000,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.AuditServiceListAuditEventsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Audit.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Authentication

<details><summary><code>client.authentication.<a href="/src/api/resources/authentication/client/Client.ts">authenticationServiceGetAuthToken</a>({ ...params }) -> Skyflow.V1GetAuthTokenResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

<p>Generates a Bearer Token to authenticate with Skyflow. This method doesn't require the <code>Authorization</code> header.</p><p><b>Note:</b> For recommended ways to authenticate, see <a href='/api-authentication/'>API authentication</a>.</p>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.authentication.authenticationServiceGetAuthToken({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion:
        "eyLhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaXNzIjoiY29tcGFueSIsImV4cCI6MTYxNTE5MzgwNywiaWF0IjoxNjE1MTY1MDQwLCJhdWQiOiKzb21lYXVkaWVuY2UifQ.4pcPyMDQ9o1PSyXnrXCjTwXyr4BSezdI1AVTmud2fU3",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1GetAuthTokenRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Authentication.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## TokenExchange

<details><summary><code>client.tokenExchange.<a href="/src/api/resources/tokenExchange/client/Client.ts">authenticationServiceGetStsToken</a>({ ...params }) -> Skyflow.V1GetStsTokenResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

<p>Generates a Bearer Token to authenticate with Skyflow. This method doesn't require the <code>Authorization</code> header.</p>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tokenExchange.authenticationServiceGetStsToken({
    grant_type: "grant_type",
    subject_token: "subject_token",
    subject_token_type: "subject_token_type",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1GetStsTokenRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TokenExchange.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tokenExchange.<a href="/src/api/resources/tokenExchange/client/Client.ts">tokenExchangeServiceListStsConfigs</a>({ ...params }) -> Skyflow.V1ListStsConfigResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists STS configurations for given account

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tokenExchange.tokenExchangeServiceListStsConfigs({
    offset: "offset",
    limit: "limit",
    name: "name",
    accountID: "accountID",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.TokenExchangeServiceListStsConfigsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TokenExchange.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tokenExchange.<a href="/src/api/resources/tokenExchange/client/Client.ts">tokenExchangeServiceCreateStsConfig</a>({ ...params }) -> Skyflow.V1CreateStsConfigResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new STS configuration

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tokenExchange.tokenExchangeServiceCreateStsConfig({
    issuer: "issuer",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1CreateStsConfigRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TokenExchange.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tokenExchange.<a href="/src/api/resources/tokenExchange/client/Client.ts">tokenExchangeServiceGetStsConfig</a>(id) -> Skyflow.V1StsConfig</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Fetches an STS configuration by ID

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tokenExchange.tokenExchangeServiceGetStsConfig("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the STS config to retrieve

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TokenExchange.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tokenExchange.<a href="/src/api/resources/tokenExchange/client/Client.ts">tokenExchangeServiceUpdateStsConfig</a>(id, { ...params }) -> Skyflow.V1StsConfig</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates an existing STS configuration

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tokenExchange.tokenExchangeServiceUpdateStsConfig("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the STS config to update

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.TokenExchangeServiceUpdateStsConfigBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TokenExchange.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.tokenExchange.<a href="/src/api/resources/tokenExchange/client/Client.ts">tokenExchangeServiceDeleteStsConfig</a>(id) -> Skyflow.V1DeleteStsConfigResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes an STS configuration

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.tokenExchange.tokenExchangeServiceDeleteStsConfig("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the STS config to delete

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TokenExchange.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Data Types

<details><summary><code>client.dataTypes.<a href="/src/api/resources/dataTypes/client/Client.ts">baseDataTypeServiceListBaseDataTypes</a>() -> Skyflow.V1ListBaseDataTypesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the base data types supported in vault schema.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dataTypes.baseDataTypeServiceListBaseDataTypes();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `DataTypes.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dataTypes.<a href="/src/api/resources/dataTypes/client/Client.ts">fieldTemplateServiceListFieldTemplates</a>({ ...params }) -> Skyflow.V1ListFieldTemplatesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns availble Skyflow Data Types.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dataTypes.fieldTemplateServiceListFieldTemplates({
    accountID: "accountID",
    offset: 1000000,
    limit: 1000000,
    "filterOps.name": "filterOps.name",
    "filterOps.status": "NONE",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.FieldTemplateServiceListFieldTemplatesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DataTypes.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.dataTypes.<a href="/src/api/resources/dataTypes/client/Client.ts">fieldTemplateServiceGetFieldTemplate</a>(id) -> Skyflow.V1GetFieldTemplateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified Skyflow Data Type.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.dataTypes.fieldTemplateServiceGetFieldTemplate("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — Unique ID of the Skyflow Data Type.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DataTypes.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Key Management

<details><summary><code>client.keyManagement.<a href="/src/api/resources/keyManagement/client/Client.ts">objectVaultServiceGetCloudProviderDetails</a>({ ...params }) -> Skyflow.V1GetCloudProviderDetailsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets details of cloud providers for key management workflows.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.keyManagement.objectVaultServiceGetCloudProviderDetails({
    workspaceID: "workspaceID",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.ObjectVaultServiceGetCloudProviderDetailsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KeyManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.keyManagement.<a href="/src/api/resources/keyManagement/client/Client.ts">objectVaultServiceGetMasterKeyImportParams</a>({ ...params }) -> Skyflow.V1GetMasterKeyImportResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets parameters to import an external master key into a workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.keyManagement.objectVaultServiceGetMasterKeyImportParams({
    workspaceID: "workspaceID",
    primaryRegionImportToken: "primaryRegionImportToken",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.ObjectVaultServiceGetMasterKeyImportParamsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KeyManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.keyManagement.<a href="/src/api/resources/keyManagement/client/Client.ts">objectVaultServiceImportMasterKey</a>({ ...params }) -> Skyflow.V1ImportMasterKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Imports external master key ciphertext into a workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.keyManagement.objectVaultServiceImportMasterKey({
    ciphertext: "occaecat in anim",
    importParams: {
        publicKey: "eu",
        importToken: "voluptate elit ex",
        region: "laboris cillum amet ipsum",
    },
    workspaceID: "Duis exercitation et ",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1ImportMasterKeyRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KeyManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.keyManagement.<a href="/src/api/resources/keyManagement/client/Client.ts">objectVaultServiceGetMasterKeyMetadata</a>(vaultId, { ...params }) -> Skyflow.V1GetMasterKeyMetadataResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Gets metadata associated with a vault's master key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.keyManagement.objectVaultServiceGetMasterKeyMetadata("vaultID", {
    workspaceID: "workspaceID",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**vaultId:** `string` — ID of the vault.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.ObjectVaultServiceGetMasterKeyMetadataRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KeyManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.keyManagement.<a href="/src/api/resources/keyManagement/client/Client.ts">objectVaultServiceRotateMasterKey</a>(vaultId, { ...params }) -> Skyflow.V1RotateMasterKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Rotates a vault's master key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.keyManagement.objectVaultServiceRotateMasterKey("vaultID", {
    workspaceID: "tempor",
    masterKey: {
        ID: "aliqua in",
        type: "INVALID",
    },
    pendingWindowInDays: 0,
    rotationReminderRecipients: [
        {
            name: "anim cupidatat in Ut",
            email: "aute cupidatat irure dolore",
        },
        {
            name: "elit laboris an",
            email: "aliquip ex ea consequat laboris",
        },
        {
            name: "sunt in cillum laboris dolore",
            email: "esse",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**vaultId:** `string` — ID of the vault.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.ObjectVaultServiceRotateMasterKeyBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `KeyManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Detect Configurations

<details><summary><code>client.detectConfigurations.<a href="/src/api/resources/detectConfigurations/client/Client.ts">listDetectConfigurations</a>({ ...params }) -> Skyflow.ListDetectConfigurationsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve all available Detect configurations.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.detectConfigurations.listDetectConfigurations({
    vault_id: "f4b3b3b33b3b3b3b3b3b3b3b3b3b3b3b",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.ListDetectConfigurationsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DetectConfigurations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.detectConfigurations.<a href="/src/api/resources/detectConfigurations/client/Client.ts">createDetectConfiguration</a>({ ...params }) -> Skyflow.CreateDetectConfigurationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create a new configuration to manage tokenization, transformations, regex filters, entity-to-column mappings, and more.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.detectConfigurations.createDetectConfiguration({
    vault_id: "f4b3b3b33b3b3b3b3b3b3b3b3b3b3b3b",
    entity_types: ["all"],
    token_type: {
        default: "vault_token",
        vault_token: ["ssn", "name"],
        entity_unq_counter: ["name_family", "url"],
        entity_only: ["date"],
    },
    allow_regex: ["Alice"],
    restrict_regex: ["DOB"],
    transformations: {
        shift_dates: {
            max_days: 10,
            min_days: 1,
            entity_types: ["date"],
        },
    },
    audio: {
        output_processed_audio: true,
        output_transcription: "diarized_transcription",
        bleep_gain: -30,
        bleep_frequency: 20,
        bleep_start_padding: 0,
        bleep_stop_padding: 0,
    },
    document: {
        pdf: {
            density: 100,
            max_resolution: 3000,
        },
    },
    image: {
        output_processed_image: true,
        output_ocr_text: true,
        masking_method: "blur",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.DetectConfiguration`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DetectConfigurations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.detectConfigurations.<a href="/src/api/resources/detectConfigurations/client/Client.ts">getDetectConfiguration</a>(configurationId) -> Skyflow.GetDetectConfigurationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a configuration by its unique identifier.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.detectConfigurations.getDetectConfiguration("f4b3b3b33b3b3b3b3b3b3b3b3b3b3b3b");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**configurationId:** `string` — Unique ID of the configuration.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DetectConfigurations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.detectConfigurations.<a href="/src/api/resources/detectConfigurations/client/Client.ts">updateDetectConfiguration</a>(configurationId, { ...params }) -> Skyflow.DetectConfiguration</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update an existing Detect configuration. Fields omitted in the request body are removed from the configuration.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.detectConfigurations.updateDetectConfiguration("f4b3b3b33b3b3b3b3b3b3b3b3b3b3b3b", {
    vault_id: "f4b3b3b33b3b3b3b3b3b3b3b3b3b3b3b",
    entity_types: ["all"],
    token_type: {
        default: "vault_token",
        vault_token: ["ssn", "name"],
        entity_unq_counter: ["name_family", "url"],
        entity_only: ["date"],
    },
    allow_regex: ["Alice"],
    restrict_regex: ["DOB"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**configurationId:** `string` — Unique ID of the configuration.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.DetectConfiguration`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DetectConfigurations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.detectConfigurations.<a href="/src/api/resources/detectConfigurations/client/Client.ts">deleteDetectConfiguration</a>(configurationId) -> Record<string, unknown></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Delete a configuration

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.detectConfigurations.deleteDetectConfiguration("f4b3b3b33b3b3b3b3b3b3b3b3b3b3b3b");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**configurationId:** `string` — Unique ID of the configuration.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `DetectConfigurations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Functions

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceGetFunctionConfig</a>() -> Skyflow.V1GetFunctionConfigResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified function configuration.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceGetFunctionConfig();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceListFunctionDeployment</a>({ ...params }) -> Skyflow.V1ListFunctionDeploymentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all function deployments in the account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceListFunctionDeployment({
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: "offset",
    limit: "limit",
    functionID: "functionID",
    functionEnvironmentID: "functionEnvironmentID",
    versionTag: "versionTag",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceListFunctionDeploymentRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceCreateFunctionDeployment</a>({ ...params }) -> Skyflow.V1CreateFunctionDeploymentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new deployment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceCreateFunctionDeployment({
    name: "consectetur ut et Ut exercita",
    description: "consectetur do qui occaecat laboris",
    functionID: "nulla",
    versionTag: "consequat minim pariatur",
    functionEnvironmentID: "reprehenderit",
    regionID: "eu",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1CreateFunctionDeploymentRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceGetFunctionDeployment</a>(id, { ...params }) -> Skyflow.V1GetFunctionDeploymentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified function deployment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceGetFunctionDeployment("ID", {
    verbose: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the function deployment.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceGetFunctionDeploymentRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceUpdateFunctionDeployment</a>(id, { ...params }) -> Skyflow.V1UpdateFunctionDeploymentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified function deployment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceUpdateFunctionDeployment("ID", {
    name: "reprehenderit",
    description: "cupidatat in esse ipsum",
    functionID: "enim dolore dolor aliquip",
    versionTag: "est adipisicing",
    functionEnvironmentID: "dolor laboris enim ea",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the deployment.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceUpdateFunctionDeploymentBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceDeleteFunctionDeployment</a>(id) -> Skyflow.V1DeleteFunctionDeploymentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified function deployment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceDeleteFunctionDeployment("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the function deployment.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceGetFunctionDeploymentLogs</a>(id, { ...params }) -> Skyflow.V1GetFunctionDeploymentLogsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Return function deployment logs.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceGetFunctionDeploymentLogs("ID", {
    methodName: "methodName",
    startTime: "startTime",
    filter: "filter",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the function deployment.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceGetFunctionDeploymentLogsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceListFunctionEnvironment</a>({ ...params }) -> Skyflow.V1ListFunctionEnvironmentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all function environments in the account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceListFunctionEnvironment({
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: "offset",
    limit: "limit",
    "filterOps.isDefault": true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceListFunctionEnvironmentRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceCreateFunctionEnvironment</a>({ ...params }) -> Skyflow.V1CreateFunctionEnvironmentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceCreateFunctionEnvironment({
    name: "aute non adipisicing eiusmod",
    variables: [
        {
            name: "adipisicing voluptate exercitation nisi ullamco",
            value: "magna dolor aliqua",
            type: "NONE",
        },
        {
            name: "incididunt",
            value: "anim exercitation",
            type: "NONE",
        },
        {
            name: "aliquip cup",
            value: "labore",
            type: "NONE",
        },
    ],
    description: "aliqua do qui consectetur sed",
    isDefault: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1CreateFunctionEnvironmentRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceGetFunctionEnvironment</a>(id) -> Skyflow.V1GetFunctionEnvironmentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified function environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceGetFunctionEnvironment("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the environment.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceUpdateFunctionEnvironment</a>(id, { ...params }) -> Skyflow.V1UpdateFunctionEnvironmentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified function environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceUpdateFunctionEnvironment("ID", {
    name: "laborum enim aliqua fugiat culpa",
    variables: [
        {
            name: "mollit cillum",
            value: "deserunt non occaecat Excepteur aliqua",
            type: "NONE",
        },
        {
            name: "in ullamco ex do",
            value: "irure culpa",
            type: "NONE",
        },
        {
            name: "eiusmod ipsum exercitation veniam quis",
            value: "Lorem officia amet irure",
            type: "NONE",
        },
    ],
    description: "qui ut non",
    isDefault: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the environment.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceUpdateFunctionEnvironmentBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceDeleteFunctionEnvironment</a>(id) -> Skyflow.V1DeleteFunctionEnvironmentResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified function environment.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceDeleteFunctionEnvironment("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the environment.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceUpdateFunctionEnvironmentVariable</a>(id, { ...params }) -> Skyflow.V1UpdateFunctionEnvironmentVariableResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified function environment variable.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceUpdateFunctionEnvironmentVariable("ID", {
    name: "elit aliquip",
    value: "consequat commodo",
    type: "NONE",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the environmement.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceUpdateFunctionEnvironmentVariableBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceDeleteFunctionEnvironmentVariable</a>(id, { ...params }) -> Skyflow.V1DeleteFunctionEnvironmentVariableResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified function environment variable.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceDeleteFunctionEnvironmentVariable("ID", {
    name: "Ut id",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the environment.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceDeleteFunctionEnvironmentVariableBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceListAllFunctionTags</a>({ ...params }) -> Skyflow.V1ListAllFunctionTagsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all function tags for all accounts.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceListAllFunctionTags({
    "filterOps.status": "NONE",
    "filterOps.functionID": "filterOps.functionID",
    "filterOps.accountID": "filterOps.accountID",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: "offset",
    limit: "limit",
    daysToRetrieve: "daysToRetrieve",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceListAllFunctionTagsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceUpdateFunctionTag</a>({ ...params }) -> Skyflow.V1UpdateFunctionTagResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified function tag.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceUpdateFunctionTag({
    ID: "ea sint magna dolor",
    status: "NONE",
    message: "veniam",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1UpdateFunctionTagRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceListFunction</a>({ ...params }) -> Skyflow.V1ListFunctionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all functions in the account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceListFunction({
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: "offset",
    limit: "limit",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceListFunctionRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceCreateFunction</a>({ ...params }) -> Skyflow.V1CreateFunctionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new function. Requires the <code>INTEROP</code> role.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceCreateFunction({
    name: "exercitation velit",
    description: "non in ut commodo ipsum",
    code: "dolore mollit",
    functionConfigs: [
        {
            handlerName: "reprehenderit id do ullamco",
            methodName: "amet Excepteur nisi dolore enim",
            variables: [
                {
                    name: "Ut ad nulla commodo",
                    value: "ad eiusmod",
                    type: "NONE",
                },
                {
                    name: "ullamco aliquip sit",
                    value: "qu",
                    type: "NONE",
                },
                {
                    name: "irure",
                    value: "nulla voluptate est",
                    type: "NONE",
                },
            ],
            resourceConfig: {
                timeout: -9565061,
                memory: 33475922,
            },
            numberOfWarmInstances: -95061544,
        },
        {
            handlerName: "",
            methodName: "magna dolor Duis",
            variables: [
                {
                    name: "proident",
                    value: "tempor occaecat mollit",
                    type: "NONE",
                },
                {
                    name: "et fugiat incididunt",
                    value: "in",
                    type: "NONE",
                },
                {
                    name: "ad ut consectetur do ipsum",
                    value: "veniam tempor dolore ea",
                    type: "NONE",
                },
            ],
            resourceConfig: {
                timeout: 25178660,
                memory: -94985779,
            },
            numberOfWarmInstances: 77344281,
        },
        {
            handlerName: "reprehenderit ut sed quis off",
            methodName: "culpa id quis pariatur",
            variables: [
                {
                    name: "reprehenderit",
                    value: "commodo reprehenderit consectetur Lorem in",
                    type: "NONE",
                },
                {
                    name: "dolore",
                    value: "aliquip sint laborum",
                    type: "NONE",
                },
                {
                    name: "ea et enim ad amet",
                    value: "ad quis aliqua consequat nostrud",
                    type: "NONE",
                },
            ],
            resourceConfig: {
                timeout: 30590744,
                memory: 98286963,
            },
            numberOfWarmInstances: -40007065,
        },
    ],
    functionDeployment: {
        deploy: true,
        functionEnvironmentID: "cupidatat sunt pariatur consequat",
        regionID: "non in sit aliquip",
        functionDeploymentName: "ea elit",
        functionDeploymentDescription: "nulla in incididunt",
    },
    language: {
        languageName: "LANGUAGE_NOT_DEFINED",
        languageVersion: "consectetur dolor culpa aute quis",
    },
    dependencies: ["velit", "voluptate", "culpa amet laborum nisi ea"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1CreateFunctionRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceGetFunction</a>(id) -> Skyflow.V1GetFunctionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified function.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceGetFunction("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the function.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceUpdateFunction</a>(id, { ...params }) -> Skyflow.V1UpdateFunctionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified function.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceUpdateFunction("ID", {
    name: "veniam id enim ut tempor",
    description: "sit labore",
    code: "aute",
    functionConfigs: [
        {
            handlerName: "consectetur mollit",
            methodName: "ad in",
            variables: [
                {
                    name: "consequat",
                    value: "laboris mollit veniam deserunt pariatur",
                    type: "NONE",
                },
                {
                    name: "sint officia irure Lorem Ut",
                    value: "sunt laborum et",
                    type: "NONE",
                },
                {
                    name: "laborum",
                    value: "sit do labore tempor",
                    type: "NONE",
                },
            ],
            resourceConfig: {
                timeout: 78105389,
                memory: -77146941,
            },
            numberOfWarmInstances: -23769579,
        },
        {
            handlerName: "est ven",
            methodName: "fugiat dolor Duis aliqua",
            variables: [
                {
                    name: "est deserunt Lorem",
                    value: "aliquip sit deserunt in",
                    type: "NONE",
                },
                {
                    name: "aliqua pariatur Excepteur",
                    value: "commodo aliquip dolor",
                    type: "NONE",
                },
                {
                    name: "voluptate minim",
                    value: "amet culpa",
                    type: "NONE",
                },
            ],
            resourceConfig: {
                timeout: -62010697,
                memory: 2251862,
            },
            numberOfWarmInstances: 58524072,
        },
        {
            handlerName: "ea proi",
            methodName: "ut nulla ipsum Excepteur",
            variables: [
                {
                    name: "sit cillum",
                    value: "ipsum anim consectetur laboris enim",
                    type: "NONE",
                },
                {
                    name: "cupidatat ut consectetur",
                    value: "elit officia aute ea",
                    type: "NONE",
                },
                {
                    name: "aliqua laboris irure mollit",
                    value: "mollit ex ut ad",
                    type: "NONE",
                },
            ],
            resourceConfig: {
                timeout: -23357207,
                memory: -56585675,
            },
            numberOfWarmInstances: 86244839,
        },
    ],
    functionDeployment: {
        deploy: true,
        functionEnvironmentID: "in",
        regionID: "ea",
        functionDeploymentName: "eiusmod officia commodo",
        functionDeploymentDescription: "sed adipisicing magna officia",
    },
    language: {
        languageName: "LANGUAGE_NOT_DEFINED",
        languageVersion: "mollit enim",
    },
    dependencies: ["proident aute occaecat incididunt in", "aute sunt nisi", "commodo veniam Lorem"],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the function.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceUpdateFunctionBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceDeleteFunction</a>(id) -> Skyflow.V1DeleteFunctionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified function.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceDeleteFunction("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the function.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceListVersionTags</a>(id, { ...params }) -> Skyflow.V1ListFunctionTagsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns all tags for the specified function.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceListVersionTags("ID", {
    "filterOps.status": "NONE",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: "offset",
    limit: "limit",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the function.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceListVersionTagsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.functions.<a href="/src/api/resources/functions/client/Client.ts">functionServiceGetVersionTag</a>(id, versionTag, { ...params }) -> Skyflow.V1GetFunctionTagResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified function tag.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.functions.functionServiceGetVersionTag("ID", "versionTag", {
    downloadURL: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the function.

</dd>
</dl>

<dl>
<dd>

**versionTag:** `string` — Name of the function tag.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.FunctionServiceGetVersionTagRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Functions.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Connections

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceListInboundIntegration</a>({ ...params }) -> Skyflow.V1ListIntegrationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

List inbound connections for the specified vault.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceListInboundIntegration({
    offset: "offset",
    limit: "limit",
    vaultID: "vaultID",
    fetchIDonly: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.IntegrationServiceListInboundIntegrationRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceCreateInboundIntegration</a>({ ...params }) -> Skyflow.V1CreateIntegrationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates an inbound connection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceCreateInboundIntegration({
    ID: "ex ea no",
    name: "ut laboris",
    baseURL: "aute nisi",
    vaultID: "esse laboris labore velit in",
    routes: [
        {
            path: "cillum tempor ullamco",
            method: "consectetur exercitation eiusmod voluptat",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "l",
                    table: "nostrud consequat",
                    column: "",
                    dataSelector: "id velit ipsum Duis cupidatat",
                    dataSelectorRegex: "eiusmod qui",
                    transformFormat: "commodo occaecat Ut",
                    encryptionType: "est et ad officia",
                    redaction: "DEFAULT",
                    sourceRegex: "Excepteur do",
                    transformedRegex: "consectetur commodo aliquip aliqua Lorem",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "aliqua sunt occaecat dolor nisi",
                    table: "ad",
                    column: "laboris velit pariatur",
                    dataSelector: "labore minim",
                    dataSelectorRegex: "minim co",
                    transformFormat: "consequat velit enim aute nisi",
                    encryptionType: "sint quis cillum aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "nisi",
                    transformedRegex: "nostrud labore ex sunt r",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "Lorem",
                    table: "sed",
                    column: "quis ut sed esse nostrud",
                    dataSelector: "consequat pariatur dolore",
                    dataSelectorRegex: "voluptate",
                    transformFormat: "ea dolore",
                    encryptionType: "ex Duis",
                    redaction: "DEFAULT",
                    sourceRegex: "consequat",
                    transformedRegex: "voluptate Excepteur et enim eu",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "mollit",
                    table: "anim in velit non",
                    column: "deserunt amet par",
                    dataSelector: "nulla Lorem nisi eu ipsum",
                    dataSelectorRegex: "dolor ali",
                    transformFormat: "dolore ullamco",
                    encryptionType: "consectetur aliqua Ut anim",
                    redaction: "DEFAULT",
                    sourceRegex: "esse ea et",
                    transformedRegex: "esse dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "qui si",
                    table: "laborum ea culpa",
                    column: "consequat elit in",
                    dataSelector: "laborum Excepteur tempor ad irure",
                    dataSelectorRegex: "ipsum ad commodo",
                    transformFormat: "dolor",
                    encryptionType: "anim",
                    redaction: "DEFAULT",
                    sourceRegex: "fugiat do",
                    transformedRegex: "nulla",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sed aliqua non fugiat",
                    table: "aliqua",
                    column: "do dolore officia ad",
                    dataSelector: "esse minim",
                    dataSelectorRegex: "consequat eiusmod commodo est",
                    transformFormat: "in qui",
                    encryptionType: "dolor est",
                    redaction: "DEFAULT",
                    sourceRegex: "labore",
                    transformedRegex: "si",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ut sint veniam",
                    table: "veniam pari",
                    column: "sit mollit",
                    dataSelector: "veniam",
                    dataSelectorRegex: "rep",
                    transformFormat: "ut dolore mollit eu Excepteur",
                    encryptionType: "ut ut",
                    redaction: "DEFAULT",
                    sourceRegex: "aute",
                    transformedRegex: "fugiat proident commodo nisi",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "eu do nulla dolore",
                    table: "tempor culpa",
                    column: "pariatur Duis adipisicing in",
                    dataSelector: "labore dolore eiusmod Ut",
                    dataSelectorRegex: "sed irure aliquip dolore",
                    transformFormat: "labore ex minim elit ea",
                    encryptionType: "incididunt",
                    redaction: "DEFAULT",
                    sourceRegex: "et cupidatat deserunt irure",
                    transformedRegex: "aliquip consectetur labore",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "reprehenderit cillum fu",
                    table: "esse cupidatat laborum",
                    column: "nostrud consequat",
                    dataSelector: "enim minim ullamco eiusmod",
                    dataSelectorRegex: "voluptate laboris",
                    transformFormat: "esse aute",
                    encryptionType: "ut eu",
                    redaction: "DEFAULT",
                    sourceRegex: "sunt labore aliq",
                    transformedRegex: "mollit sunt in Lorem est",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "minim Duis et Ut in",
                    table: "ut consectetur consequat tempor",
                    column: "fugiat do voluptate ut",
                    dataSelector: "dolor cupidatat",
                    dataSelectorRegex: "ut",
                    transformFormat: "dolore ullamco adipisicing aliqua",
                    encryptionType: "consequat sint",
                    redaction: "DEFAULT",
                    sourceRegex: "cupidatat Ut occaecat",
                    transformedRegex: "dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "consequat dolore dolor aute",
                    table: "nisi officia tempor sint",
                    column: "dolore adipisicing quis",
                    dataSelector: "aliqua laborum",
                    dataSelectorRegex: "reprehenderit consequat ",
                    transformFormat: "culpa aliqua ad",
                    encryptionType: "eiusmod",
                    redaction: "DEFAULT",
                    sourceRegex: "nostrud proident Excepteur",
                    transformedRegex: "dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sit",
                    table: "fugiat amet tempor",
                    column: "nulla",
                    dataSelector: "in",
                    dataSelectorRegex: "dolore amet laborum cupidatat",
                    transformFormat: "dolor",
                    encryptionType: "exercitation fugiat aliquip amet",
                    redaction: "DEFAULT",
                    sourceRegex: "Excepteur labore exercitation",
                    transformedRegex: "Duis",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "conseq",
                    table: "reprehenderi",
                    column: "aute",
                    dataSelector: "occaecat voluptate esse Excepteur culpa",
                    dataSelectorRegex: "officia tempor ut Ut enim",
                    transformFormat: "commodo officia dolore",
                    encryptionType: "ullamco dolore ut",
                    redaction: "DEFAULT",
                    sourceRegex: "consequat reprehenderit sit irure",
                    transformedRegex: "voluptate",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ut ex",
                    table: "laborum in nostrud",
                    column: "enim in con",
                    dataSelector: "ullamco adipisicing dolor",
                    dataSelectorRegex: "deserunt",
                    transformFormat: "Duis",
                    encryptionType: "in do veniam",
                    redaction: "DEFAULT",
                    sourceRegex: "in irure reprehenderit elit",
                    transformedRegex: "Lorem",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "amet elit ad in id",
                    table: "cillum",
                    column: "cillum",
                    dataSelector: "do reprehenderit sunt minim quis",
                    dataSelectorRegex: "id cillum Excepteur deserunt u",
                    transformFormat: "dolor",
                    encryptionType: "laboris nulla labore ",
                    redaction: "DEFAULT",
                    sourceRegex: "amet",
                    transformedRegex: "cillum laboris dolo",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "exercitation adipisicing do",
                    table: "qui ",
                    column: "adipisicing Ut aliquip occaecat velit",
                    dataSelector: "ea fug",
                    dataSelectorRegex: "est dolor",
                    transformFormat: "Lorem velit do nisi",
                    encryptionType: "qui",
                    redaction: "DEFAULT",
                    sourceRegex: "aliqua ut labore",
                    transformedRegex: "est ut tempor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "incididunt",
                    table: "officia mollit",
                    column: "laborum",
                    dataSelector: "id",
                    dataSelectorRegex: "occaecat magna velit est",
                    transformFormat: "veniam velit",
                    encryptionType: "proident voluptate",
                    redaction: "DEFAULT",
                    sourceRegex: "in aute",
                    transformedRegex: "fugiat proident ",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco eu mollit exercitation",
                    table: "ea proident Ut",
                    column: "tempor quis ullamco",
                    dataSelector: "amet esse",
                    dataSelectorRegex: "nulla ea culpa irure",
                    transformFormat: "sint sunt",
                    encryptionType: "est elit ullamco dolore id",
                    redaction: "DEFAULT",
                    sourceRegex: "fugiat dolor aliqu",
                    transformedRegex: "pariatur eiusmod",
                },
            ],
            name: "consequat in aliqua",
            description: "in anim",
            soapAction: "reprehenderit",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "dolore nulla non sunt",
                    keyEncryptionAlgo: "Lorem commodo reprehenderit et aute",
                    contentEncryptionAlgo: "nulla",
                    signatureAlgorithm: "quis dolor ut Duis",
                    sourceRegex: "Duis amet",
                    transformedRegex: "do",
                    target: "mollit velit",
                },
                {
                    type: "NOACTION",
                    action: "tempor",
                    keyEncryptionAlgo: "nisi mollit velit",
                    contentEncryptionAlgo: "mollit",
                    signatureAlgorithm: "laboris exercitation",
                    sourceRegex: "occaecat sit qui ex sed",
                    transformedRegex: "exercitation sed",
                    target: "sunt",
                },
                {
                    type: "NOACTION",
                    action: "proident et",
                    keyEncryptionAlgo: "sit Except",
                    contentEncryptionAlgo: "in nulla dolore",
                    signatureAlgorithm: "magna",
                    sourceRegex: "qui exercitation sed",
                    transformedRegex: "magna pariatur voluptate",
                    target: "officia dolor veniam reprehenderit dolor",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "cupidatat",
                    keyEncryptionAlgo: "occaecat id aliqua aliquip ullamco",
                    contentEncryptionAlgo: "aliquip",
                    signatureAlgorithm: "nulla reprehenderit",
                    sourceRegex: "",
                    transformedRegex: "labore veniam",
                    target: "Lo",
                },
                {
                    type: "NOACTION",
                    action: "laborum in dolor",
                    keyEncryptionAlgo: "qui deserunt exercitation dolor",
                    contentEncryptionAlgo: "magna",
                    signatureAlgorithm: "id laborum sint veniam",
                    sourceRegex: "deserunt",
                    transformedRegex: "ipsum",
                    target: "occaecat sed",
                },
                {
                    type: "NOACTION",
                    action: "mini",
                    keyEncryptionAlgo: "esse officia",
                    contentEncryptionAlgo: "ad minim aliquip dolor Lorem",
                    signatureAlgorithm: "nostrud occaecat sed pariatur",
                    sourceRegex: "velit commodo eu",
                    transformedRegex: "magna occaecat in tempor eu",
                    target: "tempor voluptate sed",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "anim dolore ex",
                    keyEncryptionAlgo: "irure consectetur",
                    contentEncryptionAlgo: "pariatur nisi Excepteur irure",
                    signatureAlgorithm: "voluptate cupidatat nulla dolore",
                    sourceRegex: "sed",
                    transformedRegex: "Duis",
                    target: "labore",
                },
                {
                    type: "NOACTION",
                    action: "laborum eu",
                    keyEncryptionAlgo: "mollit culpa adipisicing veniam",
                    contentEncryptionAlgo: "eu",
                    signatureAlgorithm: "elit aliquip sed",
                    sourceRegex: "et exercitation eu voluptate",
                    transformedRegex: "non ea officia",
                    target: "incididunt nostrud anim consectetur nisi",
                },
                {
                    type: "NOACTION",
                    action: "id consectetur dolor",
                    keyEncryptionAlgo: "ut in",
                    contentEncryptionAlgo: "anim sit in qui pariatur",
                    signatureAlgorithm: "amet",
                    sourceRegex: "occaecat elit in",
                    transformedRegex: "in amet",
                    target: "ullamco reprehenderit fugiat nulla voluptate",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "id",
                    keyEncryptionAlgo: "ut ea aliquip",
                    contentEncryptionAlgo: "consectetur minim Lorem cupidatat",
                    signatureAlgorithm: "cupidatat pariatur labore Lorem",
                    sourceRegex: "voluptate ex incididunt sint",
                    transformedRegex: "in in velit",
                    target: "cillum",
                },
                {
                    type: "NOACTION",
                    action: "non",
                    keyEncryptionAlgo: "do voluptate in laborum",
                    contentEncryptionAlgo: "sunt in",
                    signatureAlgorithm: "elit a",
                    sourceRegex: "tempor reprehenderit commodo ex",
                    transformedRegex: "sunt sint ad elit ut",
                    target: "laboris qui amet fugiat",
                },
                {
                    type: "NOACTION",
                    action: "esse dolore do sed",
                    keyEncryptionAlgo: "dolore ut",
                    contentEncryptionAlgo: "eu velit",
                    signatureAlgorithm: "Ut sint",
                    sourceRegex: "magna amet",
                    transformedRegex: "deserunt quis Duis nulla tempor",
                    target: "occaecat aliqua exercitation laboris",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "nulla exer",
                    column: "ut adipisicing",
                },
                {
                    table: "sint nostrud et aliqua",
                    column: "reprehenderit ex",
                },
                {
                    table: "sunt elit",
                    column: "ea",
                },
            ],
        },
        {
            path: "dolor id labore",
            method: "ea voluptate magna",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "officia laborum esse laboris Ut",
                    table: "incididunt nulla",
                    column: "est",
                    dataSelector: "tempor quis do",
                    dataSelectorRegex: "officia veniam",
                    transformFormat: "minim adipisicing cillum ea",
                    encryptionType: "occaecat mollit eiusmod",
                    redaction: "DEFAULT",
                    sourceRegex: "irure dolore reprehen",
                    transformedRegex: "pariatur laborum cillum enim laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "tempor",
                    table: "in",
                    column: "irure reprehenderit nulla Excepteur do",
                    dataSelector: "labore dolore irure id",
                    dataSelectorRegex: "ipsum cillum esse mollit",
                    transformFormat: "mollit Excepteur",
                    encryptionType: "esse Duis magna ea",
                    redaction: "DEFAULT",
                    sourceRegex: "ea",
                    transformedRegex: "ea Ut ven",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "aliquip",
                    table: "est anim adipisicing tempor qui",
                    column: "ut",
                    dataSelector: "ali",
                    dataSelectorRegex: "esse cupidatat",
                    transformFormat: "exercitation",
                    encryptionType: "adipisicing fugiat magna",
                    redaction: "DEFAULT",
                    sourceRegex: "Lorem proident consectetur ex labore",
                    transformedRegex: "ex",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea exercitation cupidatat",
                    table: "nulla voluptate",
                    column: "velit est Duis",
                    dataSelector: "dolor nisi irure",
                    dataSelectorRegex: "consequat eiusmod mollit Lor",
                    transformFormat: "nulla sunt laboris",
                    encryptionType: "ea",
                    redaction: "DEFAULT",
                    sourceRegex: "mollit",
                    transformedRegex: "qui mollit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ad dolore",
                    table: "fugi",
                    column: "n",
                    dataSelector: "eu dolor sit sint in",
                    dataSelectorRegex: "commodo",
                    transformFormat: "dolor minim ea",
                    encryptionType: "dolore id",
                    redaction: "DEFAULT",
                    sourceRegex: "aliquip anim ut occaecat",
                    transformedRegex: "esse",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "adipisicing ex officia dolor aliqua",
                    table: "quis dolor reprehenderit",
                    column: "ad est commodo",
                    dataSelector: "Duis",
                    dataSelectorRegex: "consectetur ipsum s",
                    transformFormat: "sint nulla dolor laborum",
                    encryptionType: "voluptate dolore",
                    redaction: "DEFAULT",
                    sourceRegex: "ut cillum esse commodo",
                    transformedRegex: "consequat exercitation est",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "m",
                    table: "ipsum enim eu ut",
                    column: "nostrud cillum enim eu Duis",
                    dataSelector: "nulla eiusmod",
                    dataSelectorRegex: "enim cillum do",
                    transformFormat: "eiusmod ad voluptate non",
                    encryptionType: "reprehen",
                    redaction: "DEFAULT",
                    sourceRegex: "sit ",
                    transformedRegex: "cupidatat laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco adipisicing sit et incididunt",
                    table: "est cillum laboris",
                    column: "adipisicing Ut ullamco",
                    dataSelector: "laboris Excepteur aliquip aliqua ipsum",
                    dataSelectorRegex: "Ut reprehenderit eiusmod in",
                    transformFormat: "tempor Excepteur nostrud reprehenderit",
                    encryptionType: "fugiat tempor reprehenderit",
                    redaction: "DEFAULT",
                    sourceRegex: "ad id",
                    transformedRegex: "anim reprehenderit amet",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "laborum do incididunt",
                    table: "irure velit Ut commodo",
                    column: "minim adipisicing elit cupidatat incididunt",
                    dataSelector: "ut in anim",
                    dataSelectorRegex: "Excepteur quis sint",
                    transformFormat: "ir",
                    encryptionType: "incididunt proident pariatur qui",
                    redaction: "DEFAULT",
                    sourceRegex: "commodo",
                    transformedRegex: "irure amet",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "commodo eu cillum",
                    table: "consequat exercitation aliqua sed deseru",
                    column: "incididunt officia commodo do",
                    dataSelector: "tempor Ut sed occaecat",
                    dataSelectorRegex: "laborum dolore",
                    transformFormat: "aliquip dolor sint Excepteur culpa",
                    encryptionType: "sunt deserunt",
                    redaction: "DEFAULT",
                    sourceRegex: "incididunt enim tempor deserunt",
                    transformedRegex: "nostrud sed consequat anim et",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "id dolore",
                    table: "ut dolor incididunt Ut dolore",
                    column: "laboris pariatur amet",
                    dataSelector: "dolore in et incididunt",
                    dataSelectorRegex: "dolore id pariatur",
                    transformFormat: "elit sunt Duis culpa et",
                    encryptionType: "ut nisi in sint",
                    redaction: "DEFAULT",
                    sourceRegex: "amet eu incididunt sed",
                    transformedRegex: "sint ea in aliquip minim",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "consectetur",
                    table: "dolor voluptate occaecat adipisicing culpa",
                    column: "dolor",
                    dataSelector: "cupidatat laborum anim",
                    dataSelectorRegex: "in laboris",
                    transformFormat: "Ut eu voluptate sunt incididun",
                    encryptionType: "do sunt exercitation dolor",
                    redaction: "DEFAULT",
                    sourceRegex: "adipisicing proident dolor fugiat",
                    transformedRegex: "consequat amet id Ut dolor",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "Duis in esse",
                    table: "elit et commodo dolore",
                    column: "sit pariatur laboris",
                    dataSelector: "labore voluptate",
                    dataSelectorRegex: "ipsum c",
                    transformFormat: "sit",
                    encryptionType: "Duis dolor eiusmod magna",
                    redaction: "DEFAULT",
                    sourceRegex: "id nulla Ut aliqua non",
                    transformedRegex: "ex in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "Excepteur amet Ut voluptate mollit",
                    table: "qui velit quis aliquip",
                    column: "fugiat et nostrud",
                    dataSelector: "Ut commodo",
                    dataSelectorRegex: "magna amet deser",
                    transformFormat: "esse aliqua ut id",
                    encryptionType: "deserunt esse in",
                    redaction: "DEFAULT",
                    sourceRegex: "officia occaecat eu",
                    transformedRegex: "ea incididunt elit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "est",
                    table: "commodo",
                    column: "ad mollit",
                    dataSelector: "consectetu",
                    dataSelectorRegex: "fugiat commodo officia reprehenderit",
                    transformFormat: "pariatur l",
                    encryptionType: "ut",
                    redaction: "DEFAULT",
                    sourceRegex: "ani",
                    transformedRegex: "laboris elit laborum",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea",
                    table: "elit",
                    column: "sed ex ut fugiat qui",
                    dataSelector: "enim",
                    dataSelectorRegex: "amet ullamco in",
                    transformFormat: "commodo Excepteur",
                    encryptionType: "minim commodo est ea Excepteur",
                    redaction: "DEFAULT",
                    sourceRegex: "Lorem cillum tempor sit",
                    transformedRegex: "et eu in ut e",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "voluptate laborum laboris",
                    table: "ipsum ut occaecat aute laborum",
                    column: "esse",
                    dataSelector: "dolore Excepteur nostrud adipi",
                    dataSelectorRegex: "eu nisi culpa",
                    transformFormat: "enim aute exercitation in dolor",
                    encryptionType: "in ipsum aute",
                    redaction: "DEFAULT",
                    sourceRegex: "elit",
                    transformedRegex: "ex Duis",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco",
                    table: "eu nisi do",
                    column: "deserunt cup",
                    dataSelector: "sit ullamco eiusmod aliqua occaecat",
                    dataSelectorRegex: "dolore tempor cupidatat",
                    transformFormat: "minim in",
                    encryptionType: "sunt dolore ut",
                    redaction: "DEFAULT",
                    sourceRegex: "nisi",
                    transformedRegex: "amet nostrud labore",
                },
            ],
            name: "ea labore dolor in do",
            description: "commodo adipisicing eiusmod consequat esse",
            soapAction: "occaecat proident consectetur exerci",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "in est commodo quis",
                    keyEncryptionAlgo: "elit",
                    contentEncryptionAlgo: "occaecat culpa ea",
                    signatureAlgorithm: "cupidatat laboris",
                    sourceRegex: "mollit sed cupidatat",
                    transformedRegex: "in",
                    target: "elit commodo ",
                },
                {
                    type: "NOACTION",
                    action: "mollit veniam consequ",
                    keyEncryptionAlgo: "elit in",
                    contentEncryptionAlgo: "occaecat est fugiat",
                    signatureAlgorithm: "laborum",
                    sourceRegex: "amet cillum",
                    transformedRegex: "eu ut ad",
                    target: "velit ipsum",
                },
                {
                    type: "NOACTION",
                    action: "adipisicing laborum id",
                    keyEncryptionAlgo: "mollit ex",
                    contentEncryptionAlgo: "dolor tempor",
                    signatureAlgorithm: "cupidatat officia",
                    sourceRegex: "sed proident esse tempor",
                    transformedRegex: "dolore adipisicing veniam",
                    target: "incididunt",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "anim sunt enim ad",
                    keyEncryptionAlgo: "ut consectetur sit mollit commodo",
                    contentEncryptionAlgo: "incididunt aliqua",
                    signatureAlgorithm: "tempor deserunt Excepteur consectetur magna",
                    sourceRegex: "laboris veniam",
                    transformedRegex: "ullamco",
                    target: "do consequat",
                },
                {
                    type: "NOACTION",
                    action: "consectetur",
                    keyEncryptionAlgo: "mollit amet officia",
                    contentEncryptionAlgo: "Excepteur",
                    signatureAlgorithm: "irure cillum anim Ut mollit",
                    sourceRegex: "ir",
                    transformedRegex: "anim",
                    target: "ma",
                },
                {
                    type: "NOACTION",
                    action: "dolore in",
                    keyEncryptionAlgo: "magna irure labore veniam eu",
                    contentEncryptionAlgo: "amet",
                    signatureAlgorithm: "fugiat in",
                    sourceRegex: "dolor Duis pariatur tempor sint",
                    transformedRegex: "eiusmod exercitation",
                    target: "dolor in en",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "laboris esse tempor veniam",
                    keyEncryptionAlgo: "laboris in non esse",
                    contentEncryptionAlgo: "proident n",
                    signatureAlgorithm: "dolore minim velit",
                    sourceRegex: "occaecat enim reprehenderit irure",
                    transformedRegex: "adipisicing",
                    target: "voluptate ni",
                },
                {
                    type: "NOACTION",
                    action: "in eu occaecat dolor",
                    keyEncryptionAlgo: "occaecat laboris proident aute",
                    contentEncryptionAlgo: "non eu ",
                    signatureAlgorithm: "esse",
                    sourceRegex: "anim ",
                    transformedRegex: "vol",
                    target: "consequat reprehenderit cillum",
                },
                {
                    type: "NOACTION",
                    action: "irure",
                    keyEncryptionAlgo: "sed voluptate dolor",
                    contentEncryptionAlgo: "ea quis",
                    signatureAlgorithm: "pariatur ullamco Duis",
                    sourceRegex: "nisi tempo",
                    transformedRegex: "labore sint",
                    target: "reprehenderit pariatur",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "cupidatat pariatur commodo amet",
                    keyEncryptionAlgo: "cillum",
                    contentEncryptionAlgo: "mol",
                    signatureAlgorithm: "Lorem ut",
                    sourceRegex: "laboris commodo do minim et",
                    transformedRegex: "sed ipsum pro",
                    target: "laborum officia in",
                },
                {
                    type: "NOACTION",
                    action: "laboris est",
                    keyEncryptionAlgo: "dolor fugiat culpa est",
                    contentEncryptionAlgo: "d",
                    signatureAlgorithm: "dolor nisi ut quis",
                    sourceRegex: "dolor nulla mollit aliquip tempor",
                    transformedRegex: "ut dolore",
                    target: "Ut nostrud ut cillum",
                },
                {
                    type: "NOACTION",
                    action: "consequat laborum dolore",
                    keyEncryptionAlgo: "ut fugiat consectetur Excepteur",
                    contentEncryptionAlgo: "ut ex ipsum s",
                    signatureAlgorithm: "anim eu in Duis",
                    sourceRegex: "sunt dolore laboris ipsum commodo",
                    transformedRegex: "eiusmod aute irure",
                    target: "est incididunt irure voluptate",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "dolore minim",
                    column: "",
                },
                {
                    table: "deserunt in adipisicing consequat",
                    column: "eiusmod",
                },
                {
                    table: "i",
                    column: "est amet ipsum ut exercitation",
                },
            ],
        },
        {
            path: "est aute dolore pariatur",
            method: "velit proident",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "cillum",
                    table: "incididunt exerc",
                    column: "dolor",
                    dataSelector: "enim",
                    dataSelectorRegex: "Duis irure",
                    transformFormat: "mollit nulla",
                    encryptionType: "et adipisicing",
                    redaction: "DEFAULT",
                    sourceRegex: "ex",
                    transformedRegex: "ullamco in dolor elit velit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "est do",
                    table: "ullamco velit",
                    column: "veniam cupidatat sint",
                    dataSelector: "sit dolore",
                    dataSelectorRegex: "ad mollit",
                    transformFormat: "amet eu velit in officia",
                    encryptionType: "nostrud",
                    redaction: "DEFAULT",
                    sourceRegex: "quis Ut deserunt proident adipisicing",
                    transformedRegex: "pariatur ea aute",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "quis deserunt esse Lorem occaecat",
                    table: "Duis",
                    column: "fugiat",
                    dataSelector: "do aute proident reprehe",
                    dataSelectorRegex: "fugiat dolore cupidatat enim",
                    transformFormat: "adipisicing occaeca",
                    encryptionType: "Duis in nisi laboris sint",
                    redaction: "DEFAULT",
                    sourceRegex: "in",
                    transformedRegex: "labore",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "nulla labo",
                    table: "Excepteur aute ullamco",
                    column: "ea",
                    dataSelector: "in",
                    dataSelectorRegex: "voluptate minim ut",
                    transformFormat: "et",
                    encryptionType: "ad occaecat sint",
                    redaction: "DEFAULT",
                    sourceRegex: "enim qui",
                    transformedRegex: "laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea exercitation et nisi",
                    table: "irure sed",
                    column: "consequat laboris",
                    dataSelector: "eu Duis",
                    dataSelectorRegex: "eu sint veniam incidid",
                    transformFormat: "dolore deserunt",
                    encryptionType: "tempor amet et culpa",
                    redaction: "DEFAULT",
                    sourceRegex: "in",
                    transformedRegex: "in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "officia",
                    table: "qui nostrud laboris et",
                    column: "cupidatat laboris Lorem",
                    dataSelector: "eu cillum veniam sed Ut",
                    dataSelectorRegex: "mollit commodo id anim",
                    transformFormat: "inci",
                    encryptionType: "nulla ut non",
                    redaction: "DEFAULT",
                    sourceRegex: "occaecat qui cillum aute",
                    transformedRegex: "do minim consequat irure ut",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "sed in labore sunt",
                    table: "elit",
                    column: "quis magna cillum",
                    dataSelector: "ullamco reprehenderit Lorem in",
                    dataSelectorRegex: "amet officia id sed",
                    transformFormat: "eiusmod in",
                    encryptionType: "ullamco ",
                    redaction: "DEFAULT",
                    sourceRegex: "qui ut",
                    transformedRegex: "sed veniam consectetur eiusmod",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "",
                    table: "et anim",
                    column: "qui exerc",
                    dataSelector: "consectetur Lorem in labore sed",
                    dataSelectorRegex: "laborum pariatur in sed Excepteur",
                    transformFormat: "anim consectetur occaecat eiusmod qui",
                    encryptionType: "Duis dolor ad aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "",
                    transformedRegex: "in nulla ea do",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolor incididunt",
                    table: "dolore quis laborum ad cillum",
                    column: "culpa c",
                    dataSelector: "non",
                    dataSelectorRegex: "proident",
                    transformFormat: "nulla Excepteur",
                    encryptionType: "reprehenderit",
                    redaction: "DEFAULT",
                    sourceRegex: "in dolor id cupidatat elit",
                    transformedRegex: "ipsum dolor eu veniam",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "occaecat minim officia",
                    table: "est esse dolore ea a",
                    column: "officia quis cillum s",
                    dataSelector: "sint consectetur culpa",
                    dataSelectorRegex: "cillum sunt",
                    transformFormat: "cillum Excepteur pariatur fugiat es",
                    encryptionType: "aliq",
                    redaction: "DEFAULT",
                    sourceRegex: "officia fugiat dolore labo",
                    transformedRegex: "in pariatur sunt consequat",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolor eu minim",
                    table: "non ipsum sit",
                    column: "ad esse et commodo exercitation",
                    dataSelector: "minim nostrud",
                    dataSelectorRegex: "proident molli",
                    transformFormat: "amet Duis ut",
                    encryptionType: "in ullamco aliquip ",
                    redaction: "DEFAULT",
                    sourceRegex: "eiusmod Lorem mollit deserunt",
                    transformedRegex: "in ut magna laborum",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "incididunt cillum sint qui",
                    table: "nisi aliqua",
                    column: "dolor anim",
                    dataSelector: "nostrud consectetur",
                    dataSelectorRegex: "laborum s",
                    transformFormat: "ullamco reprehenderit culpa id Duis",
                    encryptionType: "ut aliquip et laboris",
                    redaction: "DEFAULT",
                    sourceRegex: "id min",
                    transformedRegex: "ex ea Ut",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "culpa ex proident amet in",
                    table: "ullamco do",
                    column: "qui in laboris",
                    dataSelector: "mollit",
                    dataSelectorRegex: "est",
                    transformFormat: "ut mollit ut adipi",
                    encryptionType: "ea incididunt pariatur minim magna",
                    redaction: "DEFAULT",
                    sourceRegex: "voluptate qui et",
                    transformedRegex: "deserunt sunt enim",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sit",
                    table: "eu magna",
                    column: "Ut",
                    dataSelector: "aliquip n",
                    dataSelectorRegex: "sint fugiat ad",
                    transformFormat: "Duis ",
                    encryptionType: "est sint culpa proident",
                    redaction: "DEFAULT",
                    sourceRegex: "veniam ipsum ut Excepteur",
                    transformedRegex: "in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolore",
                    table: "ut non",
                    column: "ullamco ex ut",
                    dataSelector: "pariatur id",
                    dataSelectorRegex: "in magna non Duis",
                    transformFormat: "aliquip labore eu",
                    encryptionType: "velit",
                    redaction: "DEFAULT",
                    sourceRegex: "veniam ullamco",
                    transformedRegex: "dolore Duis aliqua",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "sint nisi",
                    table: "commodo Duis aute anim nulla",
                    column: "eiusmod ut",
                    dataSelector: "fugiat qui anim sed",
                    dataSelectorRegex: "minim ",
                    transformFormat: "tempor aliqua commodo ex",
                    encryptionType: "",
                    redaction: "DEFAULT",
                    sourceRegex: "",
                    transformedRegex: "nostrud officia",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "culpa",
                    table: "dolore elit",
                    column: "labore Excepteur sit in fugiat",
                    dataSelector: "ut est tempor",
                    dataSelectorRegex: "proident",
                    transformFormat: "do in esse",
                    encryptionType: "tempor dolore",
                    redaction: "DEFAULT",
                    sourceRegex: "occaecat eu Ut",
                    transformedRegex: "reprehenderit ea dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "adipisicing dolor",
                    table: "ipsum consequat",
                    column: "nostrud cupidatat Duis in esse",
                    dataSelector: "Excepteur do velit amet",
                    dataSelectorRegex: "consequat",
                    transformFormat: "commodo dolore cupidatat",
                    encryptionType: "Duis aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "qui",
                    transformedRegex: "labore cons",
                },
            ],
            name: "sint",
            description: "velit eiusmod si",
            soapAction: "consectetur tempor nostrud",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "elit",
                    keyEncryptionAlgo: "exercitation ipsum consectetur",
                    contentEncryptionAlgo: "nisi",
                    signatureAlgorithm: "Lorem mollit amet dolor",
                    sourceRegex: "sed",
                    transformedRegex: "aliquip offi",
                    target: "",
                },
                {
                    type: "NOACTION",
                    action: "velit est Ut ullam",
                    keyEncryptionAlgo: "ipsum esse consequat laborum",
                    contentEncryptionAlgo: "adipisicing",
                    signatureAlgorithm: "eiusmod sed aliquip sit quis",
                    sourceRegex: "sit",
                    transformedRegex: "do",
                    target: "ut id eiusmod",
                },
                {
                    type: "NOACTION",
                    action: "ea culpa nisi Ut in",
                    keyEncryptionAlgo: "Duis quis qui Lorem nostr",
                    contentEncryptionAlgo: "et",
                    signatureAlgorithm: "aliqua aliquip consequ",
                    sourceRegex: "ipsum aliqua sunt",
                    transformedRegex: "sit eiusmod aliquip",
                    target: "laboris ex",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "do dolor laboris veniam",
                    keyEncryptionAlgo: "anim veniam",
                    contentEncryptionAlgo: "sint",
                    signatureAlgorithm: "Ut velit mollit",
                    sourceRegex: "dolor",
                    transformedRegex: "aliquip magna",
                    target: "enim Duis",
                },
                {
                    type: "NOACTION",
                    action: "ex reprehenderi",
                    keyEncryptionAlgo: "cupidatat",
                    contentEncryptionAlgo: "cillum labore deserunt sit",
                    signatureAlgorithm: "et in eu consectetur labore",
                    sourceRegex: "ut",
                    transformedRegex: "labore",
                    target: "elit officia",
                },
                {
                    type: "NOACTION",
                    action: "in eiusmod qui magna",
                    keyEncryptionAlgo: "nulla dolore reprehenderit ipsum",
                    contentEncryptionAlgo: "laboris nis",
                    signatureAlgorithm: "ipsum consequat",
                    sourceRegex: "magna",
                    transformedRegex: "magna minim Excepteur proident sint",
                    target: "qui",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "officia sunt ut",
                    keyEncryptionAlgo: "nisi anim ullamco co",
                    contentEncryptionAlgo: "non nostrud ut",
                    signatureAlgorithm: "elit irure",
                    sourceRegex: "laborum sed pariatur",
                    transformedRegex: "dolor aliqua commodo aliq",
                    target: "mollit exercitation sit laborum",
                },
                {
                    type: "NOACTION",
                    action: "commodo ea in anim",
                    keyEncryptionAlgo: "r",
                    contentEncryptionAlgo: "officia amet",
                    signatureAlgorithm: "in Duis eu v",
                    sourceRegex: "exercitation culpa",
                    transformedRegex: "veniam",
                    target: "in id aliqua",
                },
                {
                    type: "NOACTION",
                    action: "non consequat amet dolor mollit",
                    keyEncryptionAlgo: "tempor ex ut velit aliquip",
                    contentEncryptionAlgo: "culpa officia",
                    signatureAlgorithm: "Ut proident aliqua nostrud in",
                    sourceRegex: "laborum sint",
                    transformedRegex: "in dolore fugiat sunt occaecat",
                    target: "proident",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "exercitation eius",
                    keyEncryptionAlgo: "id eu",
                    contentEncryptionAlgo: "aliqua nostrud cons",
                    signatureAlgorithm: "voluptate nisi elit",
                    sourceRegex: "exercitation sint enim labore commo",
                    transformedRegex: "qui ex",
                    target: "incididunt fugiat voluptate Lorem eu",
                },
                {
                    type: "NOACTION",
                    action: "eu",
                    keyEncryptionAlgo: "nulla",
                    contentEncryptionAlgo: "esse",
                    signatureAlgorithm: "et aliquip minim qui",
                    sourceRegex: "ex aute ad enim i",
                    transformedRegex: "aliqua incididunt commodo Dui",
                    target: "magna id",
                },
                {
                    type: "NOACTION",
                    action: "sit incididu",
                    keyEncryptionAlgo: "et dolor aliquip",
                    contentEncryptionAlgo: "aliquip Ut dolor",
                    signatureAlgorithm: "ipsum mollit consequat aliquip amet",
                    sourceRegex: "velit eiusmod pariatur",
                    transformedRegex: "dolor magna Ut",
                    target: "ea sit est",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "mollit",
                    column: "dolor magna ut id sed",
                },
                {
                    table: "magna et",
                    column: "eu ad in voluptate quis",
                },
                {
                    table: "Duis voluptate Excepteur ipsum",
                    column: "commodo ut nisi",
                },
            ],
        },
    ],
    authMode: "NOAUTH",
    description: "repreh",
    BasicAudit: {
        CreatedBy: "adipisicing non elit quis",
        LastModifiedBy: "enim ut reprehenderit",
        CreatedOn: "in elit et sed",
        LastModifiedOn: "incididunt laborum labore pariatur",
    },
    denyPassThrough: true,
    formEncodedKeysPassThrough: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1RelayMappings`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceGetInboundIntegration</a>(id) -> Skyflow.V1RelayMappings</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified inbound connection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceGetInboundIntegration("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the connection.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceUpdateInboundIntegration</a>(id, { ...params }) -> Skyflow.V1UpdateIntegrationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified inbound connection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceUpdateInboundIntegration("ID", {
    ID: "ex ea no",
    name: "ut laboris",
    baseURL: "aute nisi",
    vaultID: "esse laboris labore velit in",
    routes: [
        {
            path: "cillum tempor ullamco",
            method: "consectetur exercitation eiusmod voluptat",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "l",
                    table: "nostrud consequat",
                    column: "",
                    dataSelector: "id velit ipsum Duis cupidatat",
                    dataSelectorRegex: "eiusmod qui",
                    transformFormat: "commodo occaecat Ut",
                    encryptionType: "est et ad officia",
                    redaction: "DEFAULT",
                    sourceRegex: "Excepteur do",
                    transformedRegex: "consectetur commodo aliquip aliqua Lorem",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "aliqua sunt occaecat dolor nisi",
                    table: "ad",
                    column: "laboris velit pariatur",
                    dataSelector: "labore minim",
                    dataSelectorRegex: "minim co",
                    transformFormat: "consequat velit enim aute nisi",
                    encryptionType: "sint quis cillum aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "nisi",
                    transformedRegex: "nostrud labore ex sunt r",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "Lorem",
                    table: "sed",
                    column: "quis ut sed esse nostrud",
                    dataSelector: "consequat pariatur dolore",
                    dataSelectorRegex: "voluptate",
                    transformFormat: "ea dolore",
                    encryptionType: "ex Duis",
                    redaction: "DEFAULT",
                    sourceRegex: "consequat",
                    transformedRegex: "voluptate Excepteur et enim eu",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "mollit",
                    table: "anim in velit non",
                    column: "deserunt amet par",
                    dataSelector: "nulla Lorem nisi eu ipsum",
                    dataSelectorRegex: "dolor ali",
                    transformFormat: "dolore ullamco",
                    encryptionType: "consectetur aliqua Ut anim",
                    redaction: "DEFAULT",
                    sourceRegex: "esse ea et",
                    transformedRegex: "esse dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "qui si",
                    table: "laborum ea culpa",
                    column: "consequat elit in",
                    dataSelector: "laborum Excepteur tempor ad irure",
                    dataSelectorRegex: "ipsum ad commodo",
                    transformFormat: "dolor",
                    encryptionType: "anim",
                    redaction: "DEFAULT",
                    sourceRegex: "fugiat do",
                    transformedRegex: "nulla",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sed aliqua non fugiat",
                    table: "aliqua",
                    column: "do dolore officia ad",
                    dataSelector: "esse minim",
                    dataSelectorRegex: "consequat eiusmod commodo est",
                    transformFormat: "in qui",
                    encryptionType: "dolor est",
                    redaction: "DEFAULT",
                    sourceRegex: "labore",
                    transformedRegex: "si",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ut sint veniam",
                    table: "veniam pari",
                    column: "sit mollit",
                    dataSelector: "veniam",
                    dataSelectorRegex: "rep",
                    transformFormat: "ut dolore mollit eu Excepteur",
                    encryptionType: "ut ut",
                    redaction: "DEFAULT",
                    sourceRegex: "aute",
                    transformedRegex: "fugiat proident commodo nisi",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "eu do nulla dolore",
                    table: "tempor culpa",
                    column: "pariatur Duis adipisicing in",
                    dataSelector: "labore dolore eiusmod Ut",
                    dataSelectorRegex: "sed irure aliquip dolore",
                    transformFormat: "labore ex minim elit ea",
                    encryptionType: "incididunt",
                    redaction: "DEFAULT",
                    sourceRegex: "et cupidatat deserunt irure",
                    transformedRegex: "aliquip consectetur labore",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "reprehenderit cillum fu",
                    table: "esse cupidatat laborum",
                    column: "nostrud consequat",
                    dataSelector: "enim minim ullamco eiusmod",
                    dataSelectorRegex: "voluptate laboris",
                    transformFormat: "esse aute",
                    encryptionType: "ut eu",
                    redaction: "DEFAULT",
                    sourceRegex: "sunt labore aliq",
                    transformedRegex: "mollit sunt in Lorem est",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "minim Duis et Ut in",
                    table: "ut consectetur consequat tempor",
                    column: "fugiat do voluptate ut",
                    dataSelector: "dolor cupidatat",
                    dataSelectorRegex: "ut",
                    transformFormat: "dolore ullamco adipisicing aliqua",
                    encryptionType: "consequat sint",
                    redaction: "DEFAULT",
                    sourceRegex: "cupidatat Ut occaecat",
                    transformedRegex: "dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "consequat dolore dolor aute",
                    table: "nisi officia tempor sint",
                    column: "dolore adipisicing quis",
                    dataSelector: "aliqua laborum",
                    dataSelectorRegex: "reprehenderit consequat ",
                    transformFormat: "culpa aliqua ad",
                    encryptionType: "eiusmod",
                    redaction: "DEFAULT",
                    sourceRegex: "nostrud proident Excepteur",
                    transformedRegex: "dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sit",
                    table: "fugiat amet tempor",
                    column: "nulla",
                    dataSelector: "in",
                    dataSelectorRegex: "dolore amet laborum cupidatat",
                    transformFormat: "dolor",
                    encryptionType: "exercitation fugiat aliquip amet",
                    redaction: "DEFAULT",
                    sourceRegex: "Excepteur labore exercitation",
                    transformedRegex: "Duis",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "conseq",
                    table: "reprehenderi",
                    column: "aute",
                    dataSelector: "occaecat voluptate esse Excepteur culpa",
                    dataSelectorRegex: "officia tempor ut Ut enim",
                    transformFormat: "commodo officia dolore",
                    encryptionType: "ullamco dolore ut",
                    redaction: "DEFAULT",
                    sourceRegex: "consequat reprehenderit sit irure",
                    transformedRegex: "voluptate",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ut ex",
                    table: "laborum in nostrud",
                    column: "enim in con",
                    dataSelector: "ullamco adipisicing dolor",
                    dataSelectorRegex: "deserunt",
                    transformFormat: "Duis",
                    encryptionType: "in do veniam",
                    redaction: "DEFAULT",
                    sourceRegex: "in irure reprehenderit elit",
                    transformedRegex: "Lorem",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "amet elit ad in id",
                    table: "cillum",
                    column: "cillum",
                    dataSelector: "do reprehenderit sunt minim quis",
                    dataSelectorRegex: "id cillum Excepteur deserunt u",
                    transformFormat: "dolor",
                    encryptionType: "laboris nulla labore ",
                    redaction: "DEFAULT",
                    sourceRegex: "amet",
                    transformedRegex: "cillum laboris dolo",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "exercitation adipisicing do",
                    table: "qui ",
                    column: "adipisicing Ut aliquip occaecat velit",
                    dataSelector: "ea fug",
                    dataSelectorRegex: "est dolor",
                    transformFormat: "Lorem velit do nisi",
                    encryptionType: "qui",
                    redaction: "DEFAULT",
                    sourceRegex: "aliqua ut labore",
                    transformedRegex: "est ut tempor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "incididunt",
                    table: "officia mollit",
                    column: "laborum",
                    dataSelector: "id",
                    dataSelectorRegex: "occaecat magna velit est",
                    transformFormat: "veniam velit",
                    encryptionType: "proident voluptate",
                    redaction: "DEFAULT",
                    sourceRegex: "in aute",
                    transformedRegex: "fugiat proident ",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco eu mollit exercitation",
                    table: "ea proident Ut",
                    column: "tempor quis ullamco",
                    dataSelector: "amet esse",
                    dataSelectorRegex: "nulla ea culpa irure",
                    transformFormat: "sint sunt",
                    encryptionType: "est elit ullamco dolore id",
                    redaction: "DEFAULT",
                    sourceRegex: "fugiat dolor aliqu",
                    transformedRegex: "pariatur eiusmod",
                },
            ],
            name: "consequat in aliqua",
            description: "in anim",
            soapAction: "reprehenderit",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "dolore nulla non sunt",
                    keyEncryptionAlgo: "Lorem commodo reprehenderit et aute",
                    contentEncryptionAlgo: "nulla",
                    signatureAlgorithm: "quis dolor ut Duis",
                    sourceRegex: "Duis amet",
                    transformedRegex: "do",
                    target: "mollit velit",
                },
                {
                    type: "NOACTION",
                    action: "tempor",
                    keyEncryptionAlgo: "nisi mollit velit",
                    contentEncryptionAlgo: "mollit",
                    signatureAlgorithm: "laboris exercitation",
                    sourceRegex: "occaecat sit qui ex sed",
                    transformedRegex: "exercitation sed",
                    target: "sunt",
                },
                {
                    type: "NOACTION",
                    action: "proident et",
                    keyEncryptionAlgo: "sit Except",
                    contentEncryptionAlgo: "in nulla dolore",
                    signatureAlgorithm: "magna",
                    sourceRegex: "qui exercitation sed",
                    transformedRegex: "magna pariatur voluptate",
                    target: "officia dolor veniam reprehenderit dolor",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "cupidatat",
                    keyEncryptionAlgo: "occaecat id aliqua aliquip ullamco",
                    contentEncryptionAlgo: "aliquip",
                    signatureAlgorithm: "nulla reprehenderit",
                    sourceRegex: "",
                    transformedRegex: "labore veniam",
                    target: "Lo",
                },
                {
                    type: "NOACTION",
                    action: "laborum in dolor",
                    keyEncryptionAlgo: "qui deserunt exercitation dolor",
                    contentEncryptionAlgo: "magna",
                    signatureAlgorithm: "id laborum sint veniam",
                    sourceRegex: "deserunt",
                    transformedRegex: "ipsum",
                    target: "occaecat sed",
                },
                {
                    type: "NOACTION",
                    action: "mini",
                    keyEncryptionAlgo: "esse officia",
                    contentEncryptionAlgo: "ad minim aliquip dolor Lorem",
                    signatureAlgorithm: "nostrud occaecat sed pariatur",
                    sourceRegex: "velit commodo eu",
                    transformedRegex: "magna occaecat in tempor eu",
                    target: "tempor voluptate sed",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "anim dolore ex",
                    keyEncryptionAlgo: "irure consectetur",
                    contentEncryptionAlgo: "pariatur nisi Excepteur irure",
                    signatureAlgorithm: "voluptate cupidatat nulla dolore",
                    sourceRegex: "sed",
                    transformedRegex: "Duis",
                    target: "labore",
                },
                {
                    type: "NOACTION",
                    action: "laborum eu",
                    keyEncryptionAlgo: "mollit culpa adipisicing veniam",
                    contentEncryptionAlgo: "eu",
                    signatureAlgorithm: "elit aliquip sed",
                    sourceRegex: "et exercitation eu voluptate",
                    transformedRegex: "non ea officia",
                    target: "incididunt nostrud anim consectetur nisi",
                },
                {
                    type: "NOACTION",
                    action: "id consectetur dolor",
                    keyEncryptionAlgo: "ut in",
                    contentEncryptionAlgo: "anim sit in qui pariatur",
                    signatureAlgorithm: "amet",
                    sourceRegex: "occaecat elit in",
                    transformedRegex: "in amet",
                    target: "ullamco reprehenderit fugiat nulla voluptate",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "id",
                    keyEncryptionAlgo: "ut ea aliquip",
                    contentEncryptionAlgo: "consectetur minim Lorem cupidatat",
                    signatureAlgorithm: "cupidatat pariatur labore Lorem",
                    sourceRegex: "voluptate ex incididunt sint",
                    transformedRegex: "in in velit",
                    target: "cillum",
                },
                {
                    type: "NOACTION",
                    action: "non",
                    keyEncryptionAlgo: "do voluptate in laborum",
                    contentEncryptionAlgo: "sunt in",
                    signatureAlgorithm: "elit a",
                    sourceRegex: "tempor reprehenderit commodo ex",
                    transformedRegex: "sunt sint ad elit ut",
                    target: "laboris qui amet fugiat",
                },
                {
                    type: "NOACTION",
                    action: "esse dolore do sed",
                    keyEncryptionAlgo: "dolore ut",
                    contentEncryptionAlgo: "eu velit",
                    signatureAlgorithm: "Ut sint",
                    sourceRegex: "magna amet",
                    transformedRegex: "deserunt quis Duis nulla tempor",
                    target: "occaecat aliqua exercitation laboris",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "nulla exer",
                    column: "ut adipisicing",
                },
                {
                    table: "sint nostrud et aliqua",
                    column: "reprehenderit ex",
                },
                {
                    table: "sunt elit",
                    column: "ea",
                },
            ],
        },
        {
            path: "dolor id labore",
            method: "ea voluptate magna",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "officia laborum esse laboris Ut",
                    table: "incididunt nulla",
                    column: "est",
                    dataSelector: "tempor quis do",
                    dataSelectorRegex: "officia veniam",
                    transformFormat: "minim adipisicing cillum ea",
                    encryptionType: "occaecat mollit eiusmod",
                    redaction: "DEFAULT",
                    sourceRegex: "irure dolore reprehen",
                    transformedRegex: "pariatur laborum cillum enim laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "tempor",
                    table: "in",
                    column: "irure reprehenderit nulla Excepteur do",
                    dataSelector: "labore dolore irure id",
                    dataSelectorRegex: "ipsum cillum esse mollit",
                    transformFormat: "mollit Excepteur",
                    encryptionType: "esse Duis magna ea",
                    redaction: "DEFAULT",
                    sourceRegex: "ea",
                    transformedRegex: "ea Ut ven",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "aliquip",
                    table: "est anim adipisicing tempor qui",
                    column: "ut",
                    dataSelector: "ali",
                    dataSelectorRegex: "esse cupidatat",
                    transformFormat: "exercitation",
                    encryptionType: "adipisicing fugiat magna",
                    redaction: "DEFAULT",
                    sourceRegex: "Lorem proident consectetur ex labore",
                    transformedRegex: "ex",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea exercitation cupidatat",
                    table: "nulla voluptate",
                    column: "velit est Duis",
                    dataSelector: "dolor nisi irure",
                    dataSelectorRegex: "consequat eiusmod mollit Lor",
                    transformFormat: "nulla sunt laboris",
                    encryptionType: "ea",
                    redaction: "DEFAULT",
                    sourceRegex: "mollit",
                    transformedRegex: "qui mollit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ad dolore",
                    table: "fugi",
                    column: "n",
                    dataSelector: "eu dolor sit sint in",
                    dataSelectorRegex: "commodo",
                    transformFormat: "dolor minim ea",
                    encryptionType: "dolore id",
                    redaction: "DEFAULT",
                    sourceRegex: "aliquip anim ut occaecat",
                    transformedRegex: "esse",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "adipisicing ex officia dolor aliqua",
                    table: "quis dolor reprehenderit",
                    column: "ad est commodo",
                    dataSelector: "Duis",
                    dataSelectorRegex: "consectetur ipsum s",
                    transformFormat: "sint nulla dolor laborum",
                    encryptionType: "voluptate dolore",
                    redaction: "DEFAULT",
                    sourceRegex: "ut cillum esse commodo",
                    transformedRegex: "consequat exercitation est",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "m",
                    table: "ipsum enim eu ut",
                    column: "nostrud cillum enim eu Duis",
                    dataSelector: "nulla eiusmod",
                    dataSelectorRegex: "enim cillum do",
                    transformFormat: "eiusmod ad voluptate non",
                    encryptionType: "reprehen",
                    redaction: "DEFAULT",
                    sourceRegex: "sit ",
                    transformedRegex: "cupidatat laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco adipisicing sit et incididunt",
                    table: "est cillum laboris",
                    column: "adipisicing Ut ullamco",
                    dataSelector: "laboris Excepteur aliquip aliqua ipsum",
                    dataSelectorRegex: "Ut reprehenderit eiusmod in",
                    transformFormat: "tempor Excepteur nostrud reprehenderit",
                    encryptionType: "fugiat tempor reprehenderit",
                    redaction: "DEFAULT",
                    sourceRegex: "ad id",
                    transformedRegex: "anim reprehenderit amet",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "laborum do incididunt",
                    table: "irure velit Ut commodo",
                    column: "minim adipisicing elit cupidatat incididunt",
                    dataSelector: "ut in anim",
                    dataSelectorRegex: "Excepteur quis sint",
                    transformFormat: "ir",
                    encryptionType: "incididunt proident pariatur qui",
                    redaction: "DEFAULT",
                    sourceRegex: "commodo",
                    transformedRegex: "irure amet",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "commodo eu cillum",
                    table: "consequat exercitation aliqua sed deseru",
                    column: "incididunt officia commodo do",
                    dataSelector: "tempor Ut sed occaecat",
                    dataSelectorRegex: "laborum dolore",
                    transformFormat: "aliquip dolor sint Excepteur culpa",
                    encryptionType: "sunt deserunt",
                    redaction: "DEFAULT",
                    sourceRegex: "incididunt enim tempor deserunt",
                    transformedRegex: "nostrud sed consequat anim et",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "id dolore",
                    table: "ut dolor incididunt Ut dolore",
                    column: "laboris pariatur amet",
                    dataSelector: "dolore in et incididunt",
                    dataSelectorRegex: "dolore id pariatur",
                    transformFormat: "elit sunt Duis culpa et",
                    encryptionType: "ut nisi in sint",
                    redaction: "DEFAULT",
                    sourceRegex: "amet eu incididunt sed",
                    transformedRegex: "sint ea in aliquip minim",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "consectetur",
                    table: "dolor voluptate occaecat adipisicing culpa",
                    column: "dolor",
                    dataSelector: "cupidatat laborum anim",
                    dataSelectorRegex: "in laboris",
                    transformFormat: "Ut eu voluptate sunt incididun",
                    encryptionType: "do sunt exercitation dolor",
                    redaction: "DEFAULT",
                    sourceRegex: "adipisicing proident dolor fugiat",
                    transformedRegex: "consequat amet id Ut dolor",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "Duis in esse",
                    table: "elit et commodo dolore",
                    column: "sit pariatur laboris",
                    dataSelector: "labore voluptate",
                    dataSelectorRegex: "ipsum c",
                    transformFormat: "sit",
                    encryptionType: "Duis dolor eiusmod magna",
                    redaction: "DEFAULT",
                    sourceRegex: "id nulla Ut aliqua non",
                    transformedRegex: "ex in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "Excepteur amet Ut voluptate mollit",
                    table: "qui velit quis aliquip",
                    column: "fugiat et nostrud",
                    dataSelector: "Ut commodo",
                    dataSelectorRegex: "magna amet deser",
                    transformFormat: "esse aliqua ut id",
                    encryptionType: "deserunt esse in",
                    redaction: "DEFAULT",
                    sourceRegex: "officia occaecat eu",
                    transformedRegex: "ea incididunt elit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "est",
                    table: "commodo",
                    column: "ad mollit",
                    dataSelector: "consectetu",
                    dataSelectorRegex: "fugiat commodo officia reprehenderit",
                    transformFormat: "pariatur l",
                    encryptionType: "ut",
                    redaction: "DEFAULT",
                    sourceRegex: "ani",
                    transformedRegex: "laboris elit laborum",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea",
                    table: "elit",
                    column: "sed ex ut fugiat qui",
                    dataSelector: "enim",
                    dataSelectorRegex: "amet ullamco in",
                    transformFormat: "commodo Excepteur",
                    encryptionType: "minim commodo est ea Excepteur",
                    redaction: "DEFAULT",
                    sourceRegex: "Lorem cillum tempor sit",
                    transformedRegex: "et eu in ut e",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "voluptate laborum laboris",
                    table: "ipsum ut occaecat aute laborum",
                    column: "esse",
                    dataSelector: "dolore Excepteur nostrud adipi",
                    dataSelectorRegex: "eu nisi culpa",
                    transformFormat: "enim aute exercitation in dolor",
                    encryptionType: "in ipsum aute",
                    redaction: "DEFAULT",
                    sourceRegex: "elit",
                    transformedRegex: "ex Duis",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco",
                    table: "eu nisi do",
                    column: "deserunt cup",
                    dataSelector: "sit ullamco eiusmod aliqua occaecat",
                    dataSelectorRegex: "dolore tempor cupidatat",
                    transformFormat: "minim in",
                    encryptionType: "sunt dolore ut",
                    redaction: "DEFAULT",
                    sourceRegex: "nisi",
                    transformedRegex: "amet nostrud labore",
                },
            ],
            name: "ea labore dolor in do",
            description: "commodo adipisicing eiusmod consequat esse",
            soapAction: "occaecat proident consectetur exerci",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "in est commodo quis",
                    keyEncryptionAlgo: "elit",
                    contentEncryptionAlgo: "occaecat culpa ea",
                    signatureAlgorithm: "cupidatat laboris",
                    sourceRegex: "mollit sed cupidatat",
                    transformedRegex: "in",
                    target: "elit commodo ",
                },
                {
                    type: "NOACTION",
                    action: "mollit veniam consequ",
                    keyEncryptionAlgo: "elit in",
                    contentEncryptionAlgo: "occaecat est fugiat",
                    signatureAlgorithm: "laborum",
                    sourceRegex: "amet cillum",
                    transformedRegex: "eu ut ad",
                    target: "velit ipsum",
                },
                {
                    type: "NOACTION",
                    action: "adipisicing laborum id",
                    keyEncryptionAlgo: "mollit ex",
                    contentEncryptionAlgo: "dolor tempor",
                    signatureAlgorithm: "cupidatat officia",
                    sourceRegex: "sed proident esse tempor",
                    transformedRegex: "dolore adipisicing veniam",
                    target: "incididunt",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "anim sunt enim ad",
                    keyEncryptionAlgo: "ut consectetur sit mollit commodo",
                    contentEncryptionAlgo: "incididunt aliqua",
                    signatureAlgorithm: "tempor deserunt Excepteur consectetur magna",
                    sourceRegex: "laboris veniam",
                    transformedRegex: "ullamco",
                    target: "do consequat",
                },
                {
                    type: "NOACTION",
                    action: "consectetur",
                    keyEncryptionAlgo: "mollit amet officia",
                    contentEncryptionAlgo: "Excepteur",
                    signatureAlgorithm: "irure cillum anim Ut mollit",
                    sourceRegex: "ir",
                    transformedRegex: "anim",
                    target: "ma",
                },
                {
                    type: "NOACTION",
                    action: "dolore in",
                    keyEncryptionAlgo: "magna irure labore veniam eu",
                    contentEncryptionAlgo: "amet",
                    signatureAlgorithm: "fugiat in",
                    sourceRegex: "dolor Duis pariatur tempor sint",
                    transformedRegex: "eiusmod exercitation",
                    target: "dolor in en",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "laboris esse tempor veniam",
                    keyEncryptionAlgo: "laboris in non esse",
                    contentEncryptionAlgo: "proident n",
                    signatureAlgorithm: "dolore minim velit",
                    sourceRegex: "occaecat enim reprehenderit irure",
                    transformedRegex: "adipisicing",
                    target: "voluptate ni",
                },
                {
                    type: "NOACTION",
                    action: "in eu occaecat dolor",
                    keyEncryptionAlgo: "occaecat laboris proident aute",
                    contentEncryptionAlgo: "non eu ",
                    signatureAlgorithm: "esse",
                    sourceRegex: "anim ",
                    transformedRegex: "vol",
                    target: "consequat reprehenderit cillum",
                },
                {
                    type: "NOACTION",
                    action: "irure",
                    keyEncryptionAlgo: "sed voluptate dolor",
                    contentEncryptionAlgo: "ea quis",
                    signatureAlgorithm: "pariatur ullamco Duis",
                    sourceRegex: "nisi tempo",
                    transformedRegex: "labore sint",
                    target: "reprehenderit pariatur",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "cupidatat pariatur commodo amet",
                    keyEncryptionAlgo: "cillum",
                    contentEncryptionAlgo: "mol",
                    signatureAlgorithm: "Lorem ut",
                    sourceRegex: "laboris commodo do minim et",
                    transformedRegex: "sed ipsum pro",
                    target: "laborum officia in",
                },
                {
                    type: "NOACTION",
                    action: "laboris est",
                    keyEncryptionAlgo: "dolor fugiat culpa est",
                    contentEncryptionAlgo: "d",
                    signatureAlgorithm: "dolor nisi ut quis",
                    sourceRegex: "dolor nulla mollit aliquip tempor",
                    transformedRegex: "ut dolore",
                    target: "Ut nostrud ut cillum",
                },
                {
                    type: "NOACTION",
                    action: "consequat laborum dolore",
                    keyEncryptionAlgo: "ut fugiat consectetur Excepteur",
                    contentEncryptionAlgo: "ut ex ipsum s",
                    signatureAlgorithm: "anim eu in Duis",
                    sourceRegex: "sunt dolore laboris ipsum commodo",
                    transformedRegex: "eiusmod aute irure",
                    target: "est incididunt irure voluptate",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "dolore minim",
                    column: "",
                },
                {
                    table: "deserunt in adipisicing consequat",
                    column: "eiusmod",
                },
                {
                    table: "i",
                    column: "est amet ipsum ut exercitation",
                },
            ],
        },
        {
            path: "est aute dolore pariatur",
            method: "velit proident",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "cillum",
                    table: "incididunt exerc",
                    column: "dolor",
                    dataSelector: "enim",
                    dataSelectorRegex: "Duis irure",
                    transformFormat: "mollit nulla",
                    encryptionType: "et adipisicing",
                    redaction: "DEFAULT",
                    sourceRegex: "ex",
                    transformedRegex: "ullamco in dolor elit velit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "est do",
                    table: "ullamco velit",
                    column: "veniam cupidatat sint",
                    dataSelector: "sit dolore",
                    dataSelectorRegex: "ad mollit",
                    transformFormat: "amet eu velit in officia",
                    encryptionType: "nostrud",
                    redaction: "DEFAULT",
                    sourceRegex: "quis Ut deserunt proident adipisicing",
                    transformedRegex: "pariatur ea aute",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "quis deserunt esse Lorem occaecat",
                    table: "Duis",
                    column: "fugiat",
                    dataSelector: "do aute proident reprehe",
                    dataSelectorRegex: "fugiat dolore cupidatat enim",
                    transformFormat: "adipisicing occaeca",
                    encryptionType: "Duis in nisi laboris sint",
                    redaction: "DEFAULT",
                    sourceRegex: "in",
                    transformedRegex: "labore",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "nulla labo",
                    table: "Excepteur aute ullamco",
                    column: "ea",
                    dataSelector: "in",
                    dataSelectorRegex: "voluptate minim ut",
                    transformFormat: "et",
                    encryptionType: "ad occaecat sint",
                    redaction: "DEFAULT",
                    sourceRegex: "enim qui",
                    transformedRegex: "laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea exercitation et nisi",
                    table: "irure sed",
                    column: "consequat laboris",
                    dataSelector: "eu Duis",
                    dataSelectorRegex: "eu sint veniam incidid",
                    transformFormat: "dolore deserunt",
                    encryptionType: "tempor amet et culpa",
                    redaction: "DEFAULT",
                    sourceRegex: "in",
                    transformedRegex: "in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "officia",
                    table: "qui nostrud laboris et",
                    column: "cupidatat laboris Lorem",
                    dataSelector: "eu cillum veniam sed Ut",
                    dataSelectorRegex: "mollit commodo id anim",
                    transformFormat: "inci",
                    encryptionType: "nulla ut non",
                    redaction: "DEFAULT",
                    sourceRegex: "occaecat qui cillum aute",
                    transformedRegex: "do minim consequat irure ut",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "sed in labore sunt",
                    table: "elit",
                    column: "quis magna cillum",
                    dataSelector: "ullamco reprehenderit Lorem in",
                    dataSelectorRegex: "amet officia id sed",
                    transformFormat: "eiusmod in",
                    encryptionType: "ullamco ",
                    redaction: "DEFAULT",
                    sourceRegex: "qui ut",
                    transformedRegex: "sed veniam consectetur eiusmod",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "",
                    table: "et anim",
                    column: "qui exerc",
                    dataSelector: "consectetur Lorem in labore sed",
                    dataSelectorRegex: "laborum pariatur in sed Excepteur",
                    transformFormat: "anim consectetur occaecat eiusmod qui",
                    encryptionType: "Duis dolor ad aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "",
                    transformedRegex: "in nulla ea do",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolor incididunt",
                    table: "dolore quis laborum ad cillum",
                    column: "culpa c",
                    dataSelector: "non",
                    dataSelectorRegex: "proident",
                    transformFormat: "nulla Excepteur",
                    encryptionType: "reprehenderit",
                    redaction: "DEFAULT",
                    sourceRegex: "in dolor id cupidatat elit",
                    transformedRegex: "ipsum dolor eu veniam",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "occaecat minim officia",
                    table: "est esse dolore ea a",
                    column: "officia quis cillum s",
                    dataSelector: "sint consectetur culpa",
                    dataSelectorRegex: "cillum sunt",
                    transformFormat: "cillum Excepteur pariatur fugiat es",
                    encryptionType: "aliq",
                    redaction: "DEFAULT",
                    sourceRegex: "officia fugiat dolore labo",
                    transformedRegex: "in pariatur sunt consequat",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolor eu minim",
                    table: "non ipsum sit",
                    column: "ad esse et commodo exercitation",
                    dataSelector: "minim nostrud",
                    dataSelectorRegex: "proident molli",
                    transformFormat: "amet Duis ut",
                    encryptionType: "in ullamco aliquip ",
                    redaction: "DEFAULT",
                    sourceRegex: "eiusmod Lorem mollit deserunt",
                    transformedRegex: "in ut magna laborum",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "incididunt cillum sint qui",
                    table: "nisi aliqua",
                    column: "dolor anim",
                    dataSelector: "nostrud consectetur",
                    dataSelectorRegex: "laborum s",
                    transformFormat: "ullamco reprehenderit culpa id Duis",
                    encryptionType: "ut aliquip et laboris",
                    redaction: "DEFAULT",
                    sourceRegex: "id min",
                    transformedRegex: "ex ea Ut",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "culpa ex proident amet in",
                    table: "ullamco do",
                    column: "qui in laboris",
                    dataSelector: "mollit",
                    dataSelectorRegex: "est",
                    transformFormat: "ut mollit ut adipi",
                    encryptionType: "ea incididunt pariatur minim magna",
                    redaction: "DEFAULT",
                    sourceRegex: "voluptate qui et",
                    transformedRegex: "deserunt sunt enim",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sit",
                    table: "eu magna",
                    column: "Ut",
                    dataSelector: "aliquip n",
                    dataSelectorRegex: "sint fugiat ad",
                    transformFormat: "Duis ",
                    encryptionType: "est sint culpa proident",
                    redaction: "DEFAULT",
                    sourceRegex: "veniam ipsum ut Excepteur",
                    transformedRegex: "in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolore",
                    table: "ut non",
                    column: "ullamco ex ut",
                    dataSelector: "pariatur id",
                    dataSelectorRegex: "in magna non Duis",
                    transformFormat: "aliquip labore eu",
                    encryptionType: "velit",
                    redaction: "DEFAULT",
                    sourceRegex: "veniam ullamco",
                    transformedRegex: "dolore Duis aliqua",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "sint nisi",
                    table: "commodo Duis aute anim nulla",
                    column: "eiusmod ut",
                    dataSelector: "fugiat qui anim sed",
                    dataSelectorRegex: "minim ",
                    transformFormat: "tempor aliqua commodo ex",
                    encryptionType: "",
                    redaction: "DEFAULT",
                    sourceRegex: "",
                    transformedRegex: "nostrud officia",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "culpa",
                    table: "dolore elit",
                    column: "labore Excepteur sit in fugiat",
                    dataSelector: "ut est tempor",
                    dataSelectorRegex: "proident",
                    transformFormat: "do in esse",
                    encryptionType: "tempor dolore",
                    redaction: "DEFAULT",
                    sourceRegex: "occaecat eu Ut",
                    transformedRegex: "reprehenderit ea dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "adipisicing dolor",
                    table: "ipsum consequat",
                    column: "nostrud cupidatat Duis in esse",
                    dataSelector: "Excepteur do velit amet",
                    dataSelectorRegex: "consequat",
                    transformFormat: "commodo dolore cupidatat",
                    encryptionType: "Duis aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "qui",
                    transformedRegex: "labore cons",
                },
            ],
            name: "sint",
            description: "velit eiusmod si",
            soapAction: "consectetur tempor nostrud",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "elit",
                    keyEncryptionAlgo: "exercitation ipsum consectetur",
                    contentEncryptionAlgo: "nisi",
                    signatureAlgorithm: "Lorem mollit amet dolor",
                    sourceRegex: "sed",
                    transformedRegex: "aliquip offi",
                    target: "",
                },
                {
                    type: "NOACTION",
                    action: "velit est Ut ullam",
                    keyEncryptionAlgo: "ipsum esse consequat laborum",
                    contentEncryptionAlgo: "adipisicing",
                    signatureAlgorithm: "eiusmod sed aliquip sit quis",
                    sourceRegex: "sit",
                    transformedRegex: "do",
                    target: "ut id eiusmod",
                },
                {
                    type: "NOACTION",
                    action: "ea culpa nisi Ut in",
                    keyEncryptionAlgo: "Duis quis qui Lorem nostr",
                    contentEncryptionAlgo: "et",
                    signatureAlgorithm: "aliqua aliquip consequ",
                    sourceRegex: "ipsum aliqua sunt",
                    transformedRegex: "sit eiusmod aliquip",
                    target: "laboris ex",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "do dolor laboris veniam",
                    keyEncryptionAlgo: "anim veniam",
                    contentEncryptionAlgo: "sint",
                    signatureAlgorithm: "Ut velit mollit",
                    sourceRegex: "dolor",
                    transformedRegex: "aliquip magna",
                    target: "enim Duis",
                },
                {
                    type: "NOACTION",
                    action: "ex reprehenderi",
                    keyEncryptionAlgo: "cupidatat",
                    contentEncryptionAlgo: "cillum labore deserunt sit",
                    signatureAlgorithm: "et in eu consectetur labore",
                    sourceRegex: "ut",
                    transformedRegex: "labore",
                    target: "elit officia",
                },
                {
                    type: "NOACTION",
                    action: "in eiusmod qui magna",
                    keyEncryptionAlgo: "nulla dolore reprehenderit ipsum",
                    contentEncryptionAlgo: "laboris nis",
                    signatureAlgorithm: "ipsum consequat",
                    sourceRegex: "magna",
                    transformedRegex: "magna minim Excepteur proident sint",
                    target: "qui",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "officia sunt ut",
                    keyEncryptionAlgo: "nisi anim ullamco co",
                    contentEncryptionAlgo: "non nostrud ut",
                    signatureAlgorithm: "elit irure",
                    sourceRegex: "laborum sed pariatur",
                    transformedRegex: "dolor aliqua commodo aliq",
                    target: "mollit exercitation sit laborum",
                },
                {
                    type: "NOACTION",
                    action: "commodo ea in anim",
                    keyEncryptionAlgo: "r",
                    contentEncryptionAlgo: "officia amet",
                    signatureAlgorithm: "in Duis eu v",
                    sourceRegex: "exercitation culpa",
                    transformedRegex: "veniam",
                    target: "in id aliqua",
                },
                {
                    type: "NOACTION",
                    action: "non consequat amet dolor mollit",
                    keyEncryptionAlgo: "tempor ex ut velit aliquip",
                    contentEncryptionAlgo: "culpa officia",
                    signatureAlgorithm: "Ut proident aliqua nostrud in",
                    sourceRegex: "laborum sint",
                    transformedRegex: "in dolore fugiat sunt occaecat",
                    target: "proident",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "exercitation eius",
                    keyEncryptionAlgo: "id eu",
                    contentEncryptionAlgo: "aliqua nostrud cons",
                    signatureAlgorithm: "voluptate nisi elit",
                    sourceRegex: "exercitation sint enim labore commo",
                    transformedRegex: "qui ex",
                    target: "incididunt fugiat voluptate Lorem eu",
                },
                {
                    type: "NOACTION",
                    action: "eu",
                    keyEncryptionAlgo: "nulla",
                    contentEncryptionAlgo: "esse",
                    signatureAlgorithm: "et aliquip minim qui",
                    sourceRegex: "ex aute ad enim i",
                    transformedRegex: "aliqua incididunt commodo Dui",
                    target: "magna id",
                },
                {
                    type: "NOACTION",
                    action: "sit incididu",
                    keyEncryptionAlgo: "et dolor aliquip",
                    contentEncryptionAlgo: "aliquip Ut dolor",
                    signatureAlgorithm: "ipsum mollit consequat aliquip amet",
                    sourceRegex: "velit eiusmod pariatur",
                    transformedRegex: "dolor magna Ut",
                    target: "ea sit est",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "mollit",
                    column: "dolor magna ut id sed",
                },
                {
                    table: "magna et",
                    column: "eu ad in voluptate quis",
                },
                {
                    table: "Duis voluptate Excepteur ipsum",
                    column: "commodo ut nisi",
                },
            ],
        },
    ],
    authMode: "NOAUTH",
    description: "repreh",
    BasicAudit: {
        CreatedBy: "adipisicing non elit quis",
        LastModifiedBy: "enim ut reprehenderit",
        CreatedOn: "in elit et sed",
        LastModifiedOn: "incididunt laborum labore pariatur",
    },
    denyPassThrough: true,
    formEncodedKeysPassThrough: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the connection.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.V1RelayMappings`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceDeleteInboundIntegration</a>(id) -> Skyflow.V1Empty</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified inbound connection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceDeleteInboundIntegration("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the connection.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">getSecrets</a>(connectionId) -> Skyflow.Secrets</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Identifies which secrets are set for a connection. Secret values are redacted. Returns 404 if no secrets are found.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.getSecrets("c3ec3e65-286d-4248-8bcb-66b472185848");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**connectionId:** `string` — ID of the connection.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">updateSecrets</a>(connectionId, { ...params }) -> Skyflow.V1Empty</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the specified secrets for a connection. Other secrets aren't updated. All properties for a secret must be specified together. For example, to update the `routeSecret`, you must specify both `publicKey` and `privateKey`.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.updateSecrets("c3ec3e65-286d-4248-8bcb-66b472185848", {
    routeSecret: {
        publicKey: "exampleUser",
        privateKey: "examplePassword",
    },
    soapAuthSecret: {
        userName: "soapUser",
        password: "soapPassword",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**connectionId:** `string` — ID of the connection.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.Secrets`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceUploadInboundSecret</a>(id, { ...params }) -> Skyflow.V1Empty</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Uploads authentication information for an inbound connection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceUploadInboundSecret("ID", {
    routeSecret: {
        sharedKey: "anim velit",
        publicKey: "adipisicing dolore aliqua exercitation magna",
        privateKey: "dolo",
    },
    mleAuthSecret: {
        publicKeyMLE: "aute esse",
        privateKeyMLE: "sit consequat non veniam quis",
        keyID: "ea minim",
    },
    soapAuthSecret: {
        keyStore: "cupidatat lab",
        binarySecurityToken: "cupidatat sit",
        userName: "amet",
        password: "do incididunt sit i",
        keyStorePassword: "mollit Duis irure officia",
    },
    oAuth1aSecret: {
        consumerKey: "commodo Excepteur officia ut",
        consumerSecret: "esse deserunt nostrud sunt consecte",
    },
    messageSecrets: {
        encPublicKey: "velit sint",
        encPrivateKey: "eu ad Lorem incididun",
        signPublicKey: "adipisicing sit",
        signPrivateKey: "elit veniam dolore laborum ",
        encSymmetricKey: "Lorem occaecat magna",
        signSymmetricKey: "consequat",
    },
    fieldEncryptionSecret: "in",
    authMode: "NOAUTH",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the connection.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.Secrets`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceListOutboundIntegration</a>({ ...params }) -> Skyflow.V1ListIntegrationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists outbound connections for the specified vault.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceListOutboundIntegration({
    offset: "offset",
    limit: "limit",
    vaultID: "vaultID",
    fetchIDonly: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.IntegrationServiceListOutboundIntegrationRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceCreateOutboundIntegration</a>({ ...params }) -> Skyflow.V1CreateIntegrationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates an outbound connection for a vault.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceCreateOutboundIntegration({
    ID: "ex ea no",
    name: "ut laboris",
    baseURL: "aute nisi",
    vaultID: "esse laboris labore velit in",
    routes: [
        {
            path: "cillum tempor ullamco",
            method: "consectetur exercitation eiusmod voluptat",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "l",
                    table: "nostrud consequat",
                    column: "",
                    dataSelector: "id velit ipsum Duis cupidatat",
                    dataSelectorRegex: "eiusmod qui",
                    transformFormat: "commodo occaecat Ut",
                    encryptionType: "est et ad officia",
                    redaction: "DEFAULT",
                    sourceRegex: "Excepteur do",
                    transformedRegex: "consectetur commodo aliquip aliqua Lorem",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "aliqua sunt occaecat dolor nisi",
                    table: "ad",
                    column: "laboris velit pariatur",
                    dataSelector: "labore minim",
                    dataSelectorRegex: "minim co",
                    transformFormat: "consequat velit enim aute nisi",
                    encryptionType: "sint quis cillum aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "nisi",
                    transformedRegex: "nostrud labore ex sunt r",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "Lorem",
                    table: "sed",
                    column: "quis ut sed esse nostrud",
                    dataSelector: "consequat pariatur dolore",
                    dataSelectorRegex: "voluptate",
                    transformFormat: "ea dolore",
                    encryptionType: "ex Duis",
                    redaction: "DEFAULT",
                    sourceRegex: "consequat",
                    transformedRegex: "voluptate Excepteur et enim eu",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "mollit",
                    table: "anim in velit non",
                    column: "deserunt amet par",
                    dataSelector: "nulla Lorem nisi eu ipsum",
                    dataSelectorRegex: "dolor ali",
                    transformFormat: "dolore ullamco",
                    encryptionType: "consectetur aliqua Ut anim",
                    redaction: "DEFAULT",
                    sourceRegex: "esse ea et",
                    transformedRegex: "esse dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "qui si",
                    table: "laborum ea culpa",
                    column: "consequat elit in",
                    dataSelector: "laborum Excepteur tempor ad irure",
                    dataSelectorRegex: "ipsum ad commodo",
                    transformFormat: "dolor",
                    encryptionType: "anim",
                    redaction: "DEFAULT",
                    sourceRegex: "fugiat do",
                    transformedRegex: "nulla",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sed aliqua non fugiat",
                    table: "aliqua",
                    column: "do dolore officia ad",
                    dataSelector: "esse minim",
                    dataSelectorRegex: "consequat eiusmod commodo est",
                    transformFormat: "in qui",
                    encryptionType: "dolor est",
                    redaction: "DEFAULT",
                    sourceRegex: "labore",
                    transformedRegex: "si",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ut sint veniam",
                    table: "veniam pari",
                    column: "sit mollit",
                    dataSelector: "veniam",
                    dataSelectorRegex: "rep",
                    transformFormat: "ut dolore mollit eu Excepteur",
                    encryptionType: "ut ut",
                    redaction: "DEFAULT",
                    sourceRegex: "aute",
                    transformedRegex: "fugiat proident commodo nisi",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "eu do nulla dolore",
                    table: "tempor culpa",
                    column: "pariatur Duis adipisicing in",
                    dataSelector: "labore dolore eiusmod Ut",
                    dataSelectorRegex: "sed irure aliquip dolore",
                    transformFormat: "labore ex minim elit ea",
                    encryptionType: "incididunt",
                    redaction: "DEFAULT",
                    sourceRegex: "et cupidatat deserunt irure",
                    transformedRegex: "aliquip consectetur labore",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "reprehenderit cillum fu",
                    table: "esse cupidatat laborum",
                    column: "nostrud consequat",
                    dataSelector: "enim minim ullamco eiusmod",
                    dataSelectorRegex: "voluptate laboris",
                    transformFormat: "esse aute",
                    encryptionType: "ut eu",
                    redaction: "DEFAULT",
                    sourceRegex: "sunt labore aliq",
                    transformedRegex: "mollit sunt in Lorem est",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "minim Duis et Ut in",
                    table: "ut consectetur consequat tempor",
                    column: "fugiat do voluptate ut",
                    dataSelector: "dolor cupidatat",
                    dataSelectorRegex: "ut",
                    transformFormat: "dolore ullamco adipisicing aliqua",
                    encryptionType: "consequat sint",
                    redaction: "DEFAULT",
                    sourceRegex: "cupidatat Ut occaecat",
                    transformedRegex: "dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "consequat dolore dolor aute",
                    table: "nisi officia tempor sint",
                    column: "dolore adipisicing quis",
                    dataSelector: "aliqua laborum",
                    dataSelectorRegex: "reprehenderit consequat ",
                    transformFormat: "culpa aliqua ad",
                    encryptionType: "eiusmod",
                    redaction: "DEFAULT",
                    sourceRegex: "nostrud proident Excepteur",
                    transformedRegex: "dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sit",
                    table: "fugiat amet tempor",
                    column: "nulla",
                    dataSelector: "in",
                    dataSelectorRegex: "dolore amet laborum cupidatat",
                    transformFormat: "dolor",
                    encryptionType: "exercitation fugiat aliquip amet",
                    redaction: "DEFAULT",
                    sourceRegex: "Excepteur labore exercitation",
                    transformedRegex: "Duis",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "conseq",
                    table: "reprehenderi",
                    column: "aute",
                    dataSelector: "occaecat voluptate esse Excepteur culpa",
                    dataSelectorRegex: "officia tempor ut Ut enim",
                    transformFormat: "commodo officia dolore",
                    encryptionType: "ullamco dolore ut",
                    redaction: "DEFAULT",
                    sourceRegex: "consequat reprehenderit sit irure",
                    transformedRegex: "voluptate",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ut ex",
                    table: "laborum in nostrud",
                    column: "enim in con",
                    dataSelector: "ullamco adipisicing dolor",
                    dataSelectorRegex: "deserunt",
                    transformFormat: "Duis",
                    encryptionType: "in do veniam",
                    redaction: "DEFAULT",
                    sourceRegex: "in irure reprehenderit elit",
                    transformedRegex: "Lorem",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "amet elit ad in id",
                    table: "cillum",
                    column: "cillum",
                    dataSelector: "do reprehenderit sunt minim quis",
                    dataSelectorRegex: "id cillum Excepteur deserunt u",
                    transformFormat: "dolor",
                    encryptionType: "laboris nulla labore ",
                    redaction: "DEFAULT",
                    sourceRegex: "amet",
                    transformedRegex: "cillum laboris dolo",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "exercitation adipisicing do",
                    table: "qui ",
                    column: "adipisicing Ut aliquip occaecat velit",
                    dataSelector: "ea fug",
                    dataSelectorRegex: "est dolor",
                    transformFormat: "Lorem velit do nisi",
                    encryptionType: "qui",
                    redaction: "DEFAULT",
                    sourceRegex: "aliqua ut labore",
                    transformedRegex: "est ut tempor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "incididunt",
                    table: "officia mollit",
                    column: "laborum",
                    dataSelector: "id",
                    dataSelectorRegex: "occaecat magna velit est",
                    transformFormat: "veniam velit",
                    encryptionType: "proident voluptate",
                    redaction: "DEFAULT",
                    sourceRegex: "in aute",
                    transformedRegex: "fugiat proident ",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco eu mollit exercitation",
                    table: "ea proident Ut",
                    column: "tempor quis ullamco",
                    dataSelector: "amet esse",
                    dataSelectorRegex: "nulla ea culpa irure",
                    transformFormat: "sint sunt",
                    encryptionType: "est elit ullamco dolore id",
                    redaction: "DEFAULT",
                    sourceRegex: "fugiat dolor aliqu",
                    transformedRegex: "pariatur eiusmod",
                },
            ],
            name: "consequat in aliqua",
            description: "in anim",
            soapAction: "reprehenderit",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "dolore nulla non sunt",
                    keyEncryptionAlgo: "Lorem commodo reprehenderit et aute",
                    contentEncryptionAlgo: "nulla",
                    signatureAlgorithm: "quis dolor ut Duis",
                    sourceRegex: "Duis amet",
                    transformedRegex: "do",
                    target: "mollit velit",
                },
                {
                    type: "NOACTION",
                    action: "tempor",
                    keyEncryptionAlgo: "nisi mollit velit",
                    contentEncryptionAlgo: "mollit",
                    signatureAlgorithm: "laboris exercitation",
                    sourceRegex: "occaecat sit qui ex sed",
                    transformedRegex: "exercitation sed",
                    target: "sunt",
                },
                {
                    type: "NOACTION",
                    action: "proident et",
                    keyEncryptionAlgo: "sit Except",
                    contentEncryptionAlgo: "in nulla dolore",
                    signatureAlgorithm: "magna",
                    sourceRegex: "qui exercitation sed",
                    transformedRegex: "magna pariatur voluptate",
                    target: "officia dolor veniam reprehenderit dolor",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "cupidatat",
                    keyEncryptionAlgo: "occaecat id aliqua aliquip ullamco",
                    contentEncryptionAlgo: "aliquip",
                    signatureAlgorithm: "nulla reprehenderit",
                    sourceRegex: "",
                    transformedRegex: "labore veniam",
                    target: "Lo",
                },
                {
                    type: "NOACTION",
                    action: "laborum in dolor",
                    keyEncryptionAlgo: "qui deserunt exercitation dolor",
                    contentEncryptionAlgo: "magna",
                    signatureAlgorithm: "id laborum sint veniam",
                    sourceRegex: "deserunt",
                    transformedRegex: "ipsum",
                    target: "occaecat sed",
                },
                {
                    type: "NOACTION",
                    action: "mini",
                    keyEncryptionAlgo: "esse officia",
                    contentEncryptionAlgo: "ad minim aliquip dolor Lorem",
                    signatureAlgorithm: "nostrud occaecat sed pariatur",
                    sourceRegex: "velit commodo eu",
                    transformedRegex: "magna occaecat in tempor eu",
                    target: "tempor voluptate sed",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "anim dolore ex",
                    keyEncryptionAlgo: "irure consectetur",
                    contentEncryptionAlgo: "pariatur nisi Excepteur irure",
                    signatureAlgorithm: "voluptate cupidatat nulla dolore",
                    sourceRegex: "sed",
                    transformedRegex: "Duis",
                    target: "labore",
                },
                {
                    type: "NOACTION",
                    action: "laborum eu",
                    keyEncryptionAlgo: "mollit culpa adipisicing veniam",
                    contentEncryptionAlgo: "eu",
                    signatureAlgorithm: "elit aliquip sed",
                    sourceRegex: "et exercitation eu voluptate",
                    transformedRegex: "non ea officia",
                    target: "incididunt nostrud anim consectetur nisi",
                },
                {
                    type: "NOACTION",
                    action: "id consectetur dolor",
                    keyEncryptionAlgo: "ut in",
                    contentEncryptionAlgo: "anim sit in qui pariatur",
                    signatureAlgorithm: "amet",
                    sourceRegex: "occaecat elit in",
                    transformedRegex: "in amet",
                    target: "ullamco reprehenderit fugiat nulla voluptate",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "id",
                    keyEncryptionAlgo: "ut ea aliquip",
                    contentEncryptionAlgo: "consectetur minim Lorem cupidatat",
                    signatureAlgorithm: "cupidatat pariatur labore Lorem",
                    sourceRegex: "voluptate ex incididunt sint",
                    transformedRegex: "in in velit",
                    target: "cillum",
                },
                {
                    type: "NOACTION",
                    action: "non",
                    keyEncryptionAlgo: "do voluptate in laborum",
                    contentEncryptionAlgo: "sunt in",
                    signatureAlgorithm: "elit a",
                    sourceRegex: "tempor reprehenderit commodo ex",
                    transformedRegex: "sunt sint ad elit ut",
                    target: "laboris qui amet fugiat",
                },
                {
                    type: "NOACTION",
                    action: "esse dolore do sed",
                    keyEncryptionAlgo: "dolore ut",
                    contentEncryptionAlgo: "eu velit",
                    signatureAlgorithm: "Ut sint",
                    sourceRegex: "magna amet",
                    transformedRegex: "deserunt quis Duis nulla tempor",
                    target: "occaecat aliqua exercitation laboris",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "nulla exer",
                    column: "ut adipisicing",
                },
                {
                    table: "sint nostrud et aliqua",
                    column: "reprehenderit ex",
                },
                {
                    table: "sunt elit",
                    column: "ea",
                },
            ],
        },
        {
            path: "dolor id labore",
            method: "ea voluptate magna",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "officia laborum esse laboris Ut",
                    table: "incididunt nulla",
                    column: "est",
                    dataSelector: "tempor quis do",
                    dataSelectorRegex: "officia veniam",
                    transformFormat: "minim adipisicing cillum ea",
                    encryptionType: "occaecat mollit eiusmod",
                    redaction: "DEFAULT",
                    sourceRegex: "irure dolore reprehen",
                    transformedRegex: "pariatur laborum cillum enim laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "tempor",
                    table: "in",
                    column: "irure reprehenderit nulla Excepteur do",
                    dataSelector: "labore dolore irure id",
                    dataSelectorRegex: "ipsum cillum esse mollit",
                    transformFormat: "mollit Excepteur",
                    encryptionType: "esse Duis magna ea",
                    redaction: "DEFAULT",
                    sourceRegex: "ea",
                    transformedRegex: "ea Ut ven",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "aliquip",
                    table: "est anim adipisicing tempor qui",
                    column: "ut",
                    dataSelector: "ali",
                    dataSelectorRegex: "esse cupidatat",
                    transformFormat: "exercitation",
                    encryptionType: "adipisicing fugiat magna",
                    redaction: "DEFAULT",
                    sourceRegex: "Lorem proident consectetur ex labore",
                    transformedRegex: "ex",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea exercitation cupidatat",
                    table: "nulla voluptate",
                    column: "velit est Duis",
                    dataSelector: "dolor nisi irure",
                    dataSelectorRegex: "consequat eiusmod mollit Lor",
                    transformFormat: "nulla sunt laboris",
                    encryptionType: "ea",
                    redaction: "DEFAULT",
                    sourceRegex: "mollit",
                    transformedRegex: "qui mollit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ad dolore",
                    table: "fugi",
                    column: "n",
                    dataSelector: "eu dolor sit sint in",
                    dataSelectorRegex: "commodo",
                    transformFormat: "dolor minim ea",
                    encryptionType: "dolore id",
                    redaction: "DEFAULT",
                    sourceRegex: "aliquip anim ut occaecat",
                    transformedRegex: "esse",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "adipisicing ex officia dolor aliqua",
                    table: "quis dolor reprehenderit",
                    column: "ad est commodo",
                    dataSelector: "Duis",
                    dataSelectorRegex: "consectetur ipsum s",
                    transformFormat: "sint nulla dolor laborum",
                    encryptionType: "voluptate dolore",
                    redaction: "DEFAULT",
                    sourceRegex: "ut cillum esse commodo",
                    transformedRegex: "consequat exercitation est",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "m",
                    table: "ipsum enim eu ut",
                    column: "nostrud cillum enim eu Duis",
                    dataSelector: "nulla eiusmod",
                    dataSelectorRegex: "enim cillum do",
                    transformFormat: "eiusmod ad voluptate non",
                    encryptionType: "reprehen",
                    redaction: "DEFAULT",
                    sourceRegex: "sit ",
                    transformedRegex: "cupidatat laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco adipisicing sit et incididunt",
                    table: "est cillum laboris",
                    column: "adipisicing Ut ullamco",
                    dataSelector: "laboris Excepteur aliquip aliqua ipsum",
                    dataSelectorRegex: "Ut reprehenderit eiusmod in",
                    transformFormat: "tempor Excepteur nostrud reprehenderit",
                    encryptionType: "fugiat tempor reprehenderit",
                    redaction: "DEFAULT",
                    sourceRegex: "ad id",
                    transformedRegex: "anim reprehenderit amet",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "laborum do incididunt",
                    table: "irure velit Ut commodo",
                    column: "minim adipisicing elit cupidatat incididunt",
                    dataSelector: "ut in anim",
                    dataSelectorRegex: "Excepteur quis sint",
                    transformFormat: "ir",
                    encryptionType: "incididunt proident pariatur qui",
                    redaction: "DEFAULT",
                    sourceRegex: "commodo",
                    transformedRegex: "irure amet",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "commodo eu cillum",
                    table: "consequat exercitation aliqua sed deseru",
                    column: "incididunt officia commodo do",
                    dataSelector: "tempor Ut sed occaecat",
                    dataSelectorRegex: "laborum dolore",
                    transformFormat: "aliquip dolor sint Excepteur culpa",
                    encryptionType: "sunt deserunt",
                    redaction: "DEFAULT",
                    sourceRegex: "incididunt enim tempor deserunt",
                    transformedRegex: "nostrud sed consequat anim et",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "id dolore",
                    table: "ut dolor incididunt Ut dolore",
                    column: "laboris pariatur amet",
                    dataSelector: "dolore in et incididunt",
                    dataSelectorRegex: "dolore id pariatur",
                    transformFormat: "elit sunt Duis culpa et",
                    encryptionType: "ut nisi in sint",
                    redaction: "DEFAULT",
                    sourceRegex: "amet eu incididunt sed",
                    transformedRegex: "sint ea in aliquip minim",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "consectetur",
                    table: "dolor voluptate occaecat adipisicing culpa",
                    column: "dolor",
                    dataSelector: "cupidatat laborum anim",
                    dataSelectorRegex: "in laboris",
                    transformFormat: "Ut eu voluptate sunt incididun",
                    encryptionType: "do sunt exercitation dolor",
                    redaction: "DEFAULT",
                    sourceRegex: "adipisicing proident dolor fugiat",
                    transformedRegex: "consequat amet id Ut dolor",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "Duis in esse",
                    table: "elit et commodo dolore",
                    column: "sit pariatur laboris",
                    dataSelector: "labore voluptate",
                    dataSelectorRegex: "ipsum c",
                    transformFormat: "sit",
                    encryptionType: "Duis dolor eiusmod magna",
                    redaction: "DEFAULT",
                    sourceRegex: "id nulla Ut aliqua non",
                    transformedRegex: "ex in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "Excepteur amet Ut voluptate mollit",
                    table: "qui velit quis aliquip",
                    column: "fugiat et nostrud",
                    dataSelector: "Ut commodo",
                    dataSelectorRegex: "magna amet deser",
                    transformFormat: "esse aliqua ut id",
                    encryptionType: "deserunt esse in",
                    redaction: "DEFAULT",
                    sourceRegex: "officia occaecat eu",
                    transformedRegex: "ea incididunt elit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "est",
                    table: "commodo",
                    column: "ad mollit",
                    dataSelector: "consectetu",
                    dataSelectorRegex: "fugiat commodo officia reprehenderit",
                    transformFormat: "pariatur l",
                    encryptionType: "ut",
                    redaction: "DEFAULT",
                    sourceRegex: "ani",
                    transformedRegex: "laboris elit laborum",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea",
                    table: "elit",
                    column: "sed ex ut fugiat qui",
                    dataSelector: "enim",
                    dataSelectorRegex: "amet ullamco in",
                    transformFormat: "commodo Excepteur",
                    encryptionType: "minim commodo est ea Excepteur",
                    redaction: "DEFAULT",
                    sourceRegex: "Lorem cillum tempor sit",
                    transformedRegex: "et eu in ut e",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "voluptate laborum laboris",
                    table: "ipsum ut occaecat aute laborum",
                    column: "esse",
                    dataSelector: "dolore Excepteur nostrud adipi",
                    dataSelectorRegex: "eu nisi culpa",
                    transformFormat: "enim aute exercitation in dolor",
                    encryptionType: "in ipsum aute",
                    redaction: "DEFAULT",
                    sourceRegex: "elit",
                    transformedRegex: "ex Duis",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco",
                    table: "eu nisi do",
                    column: "deserunt cup",
                    dataSelector: "sit ullamco eiusmod aliqua occaecat",
                    dataSelectorRegex: "dolore tempor cupidatat",
                    transformFormat: "minim in",
                    encryptionType: "sunt dolore ut",
                    redaction: "DEFAULT",
                    sourceRegex: "nisi",
                    transformedRegex: "amet nostrud labore",
                },
            ],
            name: "ea labore dolor in do",
            description: "commodo adipisicing eiusmod consequat esse",
            soapAction: "occaecat proident consectetur exerci",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "in est commodo quis",
                    keyEncryptionAlgo: "elit",
                    contentEncryptionAlgo: "occaecat culpa ea",
                    signatureAlgorithm: "cupidatat laboris",
                    sourceRegex: "mollit sed cupidatat",
                    transformedRegex: "in",
                    target: "elit commodo ",
                },
                {
                    type: "NOACTION",
                    action: "mollit veniam consequ",
                    keyEncryptionAlgo: "elit in",
                    contentEncryptionAlgo: "occaecat est fugiat",
                    signatureAlgorithm: "laborum",
                    sourceRegex: "amet cillum",
                    transformedRegex: "eu ut ad",
                    target: "velit ipsum",
                },
                {
                    type: "NOACTION",
                    action: "adipisicing laborum id",
                    keyEncryptionAlgo: "mollit ex",
                    contentEncryptionAlgo: "dolor tempor",
                    signatureAlgorithm: "cupidatat officia",
                    sourceRegex: "sed proident esse tempor",
                    transformedRegex: "dolore adipisicing veniam",
                    target: "incididunt",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "anim sunt enim ad",
                    keyEncryptionAlgo: "ut consectetur sit mollit commodo",
                    contentEncryptionAlgo: "incididunt aliqua",
                    signatureAlgorithm: "tempor deserunt Excepteur consectetur magna",
                    sourceRegex: "laboris veniam",
                    transformedRegex: "ullamco",
                    target: "do consequat",
                },
                {
                    type: "NOACTION",
                    action: "consectetur",
                    keyEncryptionAlgo: "mollit amet officia",
                    contentEncryptionAlgo: "Excepteur",
                    signatureAlgorithm: "irure cillum anim Ut mollit",
                    sourceRegex: "ir",
                    transformedRegex: "anim",
                    target: "ma",
                },
                {
                    type: "NOACTION",
                    action: "dolore in",
                    keyEncryptionAlgo: "magna irure labore veniam eu",
                    contentEncryptionAlgo: "amet",
                    signatureAlgorithm: "fugiat in",
                    sourceRegex: "dolor Duis pariatur tempor sint",
                    transformedRegex: "eiusmod exercitation",
                    target: "dolor in en",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "laboris esse tempor veniam",
                    keyEncryptionAlgo: "laboris in non esse",
                    contentEncryptionAlgo: "proident n",
                    signatureAlgorithm: "dolore minim velit",
                    sourceRegex: "occaecat enim reprehenderit irure",
                    transformedRegex: "adipisicing",
                    target: "voluptate ni",
                },
                {
                    type: "NOACTION",
                    action: "in eu occaecat dolor",
                    keyEncryptionAlgo: "occaecat laboris proident aute",
                    contentEncryptionAlgo: "non eu ",
                    signatureAlgorithm: "esse",
                    sourceRegex: "anim ",
                    transformedRegex: "vol",
                    target: "consequat reprehenderit cillum",
                },
                {
                    type: "NOACTION",
                    action: "irure",
                    keyEncryptionAlgo: "sed voluptate dolor",
                    contentEncryptionAlgo: "ea quis",
                    signatureAlgorithm: "pariatur ullamco Duis",
                    sourceRegex: "nisi tempo",
                    transformedRegex: "labore sint",
                    target: "reprehenderit pariatur",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "cupidatat pariatur commodo amet",
                    keyEncryptionAlgo: "cillum",
                    contentEncryptionAlgo: "mol",
                    signatureAlgorithm: "Lorem ut",
                    sourceRegex: "laboris commodo do minim et",
                    transformedRegex: "sed ipsum pro",
                    target: "laborum officia in",
                },
                {
                    type: "NOACTION",
                    action: "laboris est",
                    keyEncryptionAlgo: "dolor fugiat culpa est",
                    contentEncryptionAlgo: "d",
                    signatureAlgorithm: "dolor nisi ut quis",
                    sourceRegex: "dolor nulla mollit aliquip tempor",
                    transformedRegex: "ut dolore",
                    target: "Ut nostrud ut cillum",
                },
                {
                    type: "NOACTION",
                    action: "consequat laborum dolore",
                    keyEncryptionAlgo: "ut fugiat consectetur Excepteur",
                    contentEncryptionAlgo: "ut ex ipsum s",
                    signatureAlgorithm: "anim eu in Duis",
                    sourceRegex: "sunt dolore laboris ipsum commodo",
                    transformedRegex: "eiusmod aute irure",
                    target: "est incididunt irure voluptate",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "dolore minim",
                    column: "",
                },
                {
                    table: "deserunt in adipisicing consequat",
                    column: "eiusmod",
                },
                {
                    table: "i",
                    column: "est amet ipsum ut exercitation",
                },
            ],
        },
        {
            path: "est aute dolore pariatur",
            method: "velit proident",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "cillum",
                    table: "incididunt exerc",
                    column: "dolor",
                    dataSelector: "enim",
                    dataSelectorRegex: "Duis irure",
                    transformFormat: "mollit nulla",
                    encryptionType: "et adipisicing",
                    redaction: "DEFAULT",
                    sourceRegex: "ex",
                    transformedRegex: "ullamco in dolor elit velit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "est do",
                    table: "ullamco velit",
                    column: "veniam cupidatat sint",
                    dataSelector: "sit dolore",
                    dataSelectorRegex: "ad mollit",
                    transformFormat: "amet eu velit in officia",
                    encryptionType: "nostrud",
                    redaction: "DEFAULT",
                    sourceRegex: "quis Ut deserunt proident adipisicing",
                    transformedRegex: "pariatur ea aute",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "quis deserunt esse Lorem occaecat",
                    table: "Duis",
                    column: "fugiat",
                    dataSelector: "do aute proident reprehe",
                    dataSelectorRegex: "fugiat dolore cupidatat enim",
                    transformFormat: "adipisicing occaeca",
                    encryptionType: "Duis in nisi laboris sint",
                    redaction: "DEFAULT",
                    sourceRegex: "in",
                    transformedRegex: "labore",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "nulla labo",
                    table: "Excepteur aute ullamco",
                    column: "ea",
                    dataSelector: "in",
                    dataSelectorRegex: "voluptate minim ut",
                    transformFormat: "et",
                    encryptionType: "ad occaecat sint",
                    redaction: "DEFAULT",
                    sourceRegex: "enim qui",
                    transformedRegex: "laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea exercitation et nisi",
                    table: "irure sed",
                    column: "consequat laboris",
                    dataSelector: "eu Duis",
                    dataSelectorRegex: "eu sint veniam incidid",
                    transformFormat: "dolore deserunt",
                    encryptionType: "tempor amet et culpa",
                    redaction: "DEFAULT",
                    sourceRegex: "in",
                    transformedRegex: "in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "officia",
                    table: "qui nostrud laboris et",
                    column: "cupidatat laboris Lorem",
                    dataSelector: "eu cillum veniam sed Ut",
                    dataSelectorRegex: "mollit commodo id anim",
                    transformFormat: "inci",
                    encryptionType: "nulla ut non",
                    redaction: "DEFAULT",
                    sourceRegex: "occaecat qui cillum aute",
                    transformedRegex: "do minim consequat irure ut",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "sed in labore sunt",
                    table: "elit",
                    column: "quis magna cillum",
                    dataSelector: "ullamco reprehenderit Lorem in",
                    dataSelectorRegex: "amet officia id sed",
                    transformFormat: "eiusmod in",
                    encryptionType: "ullamco ",
                    redaction: "DEFAULT",
                    sourceRegex: "qui ut",
                    transformedRegex: "sed veniam consectetur eiusmod",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "",
                    table: "et anim",
                    column: "qui exerc",
                    dataSelector: "consectetur Lorem in labore sed",
                    dataSelectorRegex: "laborum pariatur in sed Excepteur",
                    transformFormat: "anim consectetur occaecat eiusmod qui",
                    encryptionType: "Duis dolor ad aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "",
                    transformedRegex: "in nulla ea do",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolor incididunt",
                    table: "dolore quis laborum ad cillum",
                    column: "culpa c",
                    dataSelector: "non",
                    dataSelectorRegex: "proident",
                    transformFormat: "nulla Excepteur",
                    encryptionType: "reprehenderit",
                    redaction: "DEFAULT",
                    sourceRegex: "in dolor id cupidatat elit",
                    transformedRegex: "ipsum dolor eu veniam",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "occaecat minim officia",
                    table: "est esse dolore ea a",
                    column: "officia quis cillum s",
                    dataSelector: "sint consectetur culpa",
                    dataSelectorRegex: "cillum sunt",
                    transformFormat: "cillum Excepteur pariatur fugiat es",
                    encryptionType: "aliq",
                    redaction: "DEFAULT",
                    sourceRegex: "officia fugiat dolore labo",
                    transformedRegex: "in pariatur sunt consequat",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolor eu minim",
                    table: "non ipsum sit",
                    column: "ad esse et commodo exercitation",
                    dataSelector: "minim nostrud",
                    dataSelectorRegex: "proident molli",
                    transformFormat: "amet Duis ut",
                    encryptionType: "in ullamco aliquip ",
                    redaction: "DEFAULT",
                    sourceRegex: "eiusmod Lorem mollit deserunt",
                    transformedRegex: "in ut magna laborum",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "incididunt cillum sint qui",
                    table: "nisi aliqua",
                    column: "dolor anim",
                    dataSelector: "nostrud consectetur",
                    dataSelectorRegex: "laborum s",
                    transformFormat: "ullamco reprehenderit culpa id Duis",
                    encryptionType: "ut aliquip et laboris",
                    redaction: "DEFAULT",
                    sourceRegex: "id min",
                    transformedRegex: "ex ea Ut",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "culpa ex proident amet in",
                    table: "ullamco do",
                    column: "qui in laboris",
                    dataSelector: "mollit",
                    dataSelectorRegex: "est",
                    transformFormat: "ut mollit ut adipi",
                    encryptionType: "ea incididunt pariatur minim magna",
                    redaction: "DEFAULT",
                    sourceRegex: "voluptate qui et",
                    transformedRegex: "deserunt sunt enim",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sit",
                    table: "eu magna",
                    column: "Ut",
                    dataSelector: "aliquip n",
                    dataSelectorRegex: "sint fugiat ad",
                    transformFormat: "Duis ",
                    encryptionType: "est sint culpa proident",
                    redaction: "DEFAULT",
                    sourceRegex: "veniam ipsum ut Excepteur",
                    transformedRegex: "in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolore",
                    table: "ut non",
                    column: "ullamco ex ut",
                    dataSelector: "pariatur id",
                    dataSelectorRegex: "in magna non Duis",
                    transformFormat: "aliquip labore eu",
                    encryptionType: "velit",
                    redaction: "DEFAULT",
                    sourceRegex: "veniam ullamco",
                    transformedRegex: "dolore Duis aliqua",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "sint nisi",
                    table: "commodo Duis aute anim nulla",
                    column: "eiusmod ut",
                    dataSelector: "fugiat qui anim sed",
                    dataSelectorRegex: "minim ",
                    transformFormat: "tempor aliqua commodo ex",
                    encryptionType: "",
                    redaction: "DEFAULT",
                    sourceRegex: "",
                    transformedRegex: "nostrud officia",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "culpa",
                    table: "dolore elit",
                    column: "labore Excepteur sit in fugiat",
                    dataSelector: "ut est tempor",
                    dataSelectorRegex: "proident",
                    transformFormat: "do in esse",
                    encryptionType: "tempor dolore",
                    redaction: "DEFAULT",
                    sourceRegex: "occaecat eu Ut",
                    transformedRegex: "reprehenderit ea dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "adipisicing dolor",
                    table: "ipsum consequat",
                    column: "nostrud cupidatat Duis in esse",
                    dataSelector: "Excepteur do velit amet",
                    dataSelectorRegex: "consequat",
                    transformFormat: "commodo dolore cupidatat",
                    encryptionType: "Duis aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "qui",
                    transformedRegex: "labore cons",
                },
            ],
            name: "sint",
            description: "velit eiusmod si",
            soapAction: "consectetur tempor nostrud",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "elit",
                    keyEncryptionAlgo: "exercitation ipsum consectetur",
                    contentEncryptionAlgo: "nisi",
                    signatureAlgorithm: "Lorem mollit amet dolor",
                    sourceRegex: "sed",
                    transformedRegex: "aliquip offi",
                    target: "",
                },
                {
                    type: "NOACTION",
                    action: "velit est Ut ullam",
                    keyEncryptionAlgo: "ipsum esse consequat laborum",
                    contentEncryptionAlgo: "adipisicing",
                    signatureAlgorithm: "eiusmod sed aliquip sit quis",
                    sourceRegex: "sit",
                    transformedRegex: "do",
                    target: "ut id eiusmod",
                },
                {
                    type: "NOACTION",
                    action: "ea culpa nisi Ut in",
                    keyEncryptionAlgo: "Duis quis qui Lorem nostr",
                    contentEncryptionAlgo: "et",
                    signatureAlgorithm: "aliqua aliquip consequ",
                    sourceRegex: "ipsum aliqua sunt",
                    transformedRegex: "sit eiusmod aliquip",
                    target: "laboris ex",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "do dolor laboris veniam",
                    keyEncryptionAlgo: "anim veniam",
                    contentEncryptionAlgo: "sint",
                    signatureAlgorithm: "Ut velit mollit",
                    sourceRegex: "dolor",
                    transformedRegex: "aliquip magna",
                    target: "enim Duis",
                },
                {
                    type: "NOACTION",
                    action: "ex reprehenderi",
                    keyEncryptionAlgo: "cupidatat",
                    contentEncryptionAlgo: "cillum labore deserunt sit",
                    signatureAlgorithm: "et in eu consectetur labore",
                    sourceRegex: "ut",
                    transformedRegex: "labore",
                    target: "elit officia",
                },
                {
                    type: "NOACTION",
                    action: "in eiusmod qui magna",
                    keyEncryptionAlgo: "nulla dolore reprehenderit ipsum",
                    contentEncryptionAlgo: "laboris nis",
                    signatureAlgorithm: "ipsum consequat",
                    sourceRegex: "magna",
                    transformedRegex: "magna minim Excepteur proident sint",
                    target: "qui",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "officia sunt ut",
                    keyEncryptionAlgo: "nisi anim ullamco co",
                    contentEncryptionAlgo: "non nostrud ut",
                    signatureAlgorithm: "elit irure",
                    sourceRegex: "laborum sed pariatur",
                    transformedRegex: "dolor aliqua commodo aliq",
                    target: "mollit exercitation sit laborum",
                },
                {
                    type: "NOACTION",
                    action: "commodo ea in anim",
                    keyEncryptionAlgo: "r",
                    contentEncryptionAlgo: "officia amet",
                    signatureAlgorithm: "in Duis eu v",
                    sourceRegex: "exercitation culpa",
                    transformedRegex: "veniam",
                    target: "in id aliqua",
                },
                {
                    type: "NOACTION",
                    action: "non consequat amet dolor mollit",
                    keyEncryptionAlgo: "tempor ex ut velit aliquip",
                    contentEncryptionAlgo: "culpa officia",
                    signatureAlgorithm: "Ut proident aliqua nostrud in",
                    sourceRegex: "laborum sint",
                    transformedRegex: "in dolore fugiat sunt occaecat",
                    target: "proident",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "exercitation eius",
                    keyEncryptionAlgo: "id eu",
                    contentEncryptionAlgo: "aliqua nostrud cons",
                    signatureAlgorithm: "voluptate nisi elit",
                    sourceRegex: "exercitation sint enim labore commo",
                    transformedRegex: "qui ex",
                    target: "incididunt fugiat voluptate Lorem eu",
                },
                {
                    type: "NOACTION",
                    action: "eu",
                    keyEncryptionAlgo: "nulla",
                    contentEncryptionAlgo: "esse",
                    signatureAlgorithm: "et aliquip minim qui",
                    sourceRegex: "ex aute ad enim i",
                    transformedRegex: "aliqua incididunt commodo Dui",
                    target: "magna id",
                },
                {
                    type: "NOACTION",
                    action: "sit incididu",
                    keyEncryptionAlgo: "et dolor aliquip",
                    contentEncryptionAlgo: "aliquip Ut dolor",
                    signatureAlgorithm: "ipsum mollit consequat aliquip amet",
                    sourceRegex: "velit eiusmod pariatur",
                    transformedRegex: "dolor magna Ut",
                    target: "ea sit est",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "mollit",
                    column: "dolor magna ut id sed",
                },
                {
                    table: "magna et",
                    column: "eu ad in voluptate quis",
                },
                {
                    table: "Duis voluptate Excepteur ipsum",
                    column: "commodo ut nisi",
                },
            ],
        },
    ],
    authMode: "NOAUTH",
    description: "repreh",
    BasicAudit: {
        CreatedBy: "adipisicing non elit quis",
        LastModifiedBy: "enim ut reprehenderit",
        CreatedOn: "in elit et sed",
        LastModifiedOn: "incididunt laborum labore pariatur",
    },
    denyPassThrough: true,
    formEncodedKeysPassThrough: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1RelayMappings`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceGetOutboundIntegration</a>(id) -> Skyflow.V1RelayMappings</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified outbound connection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceGetOutboundIntegration("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the connection.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceUpdateOutboundIntegration</a>(id, { ...params }) -> Skyflow.V1UpdateIntegrationResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified outbound connection .

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceUpdateOutboundIntegration("ID", {
    ID: "ex ea no",
    name: "ut laboris",
    baseURL: "aute nisi",
    vaultID: "esse laboris labore velit in",
    routes: [
        {
            path: "cillum tempor ullamco",
            method: "consectetur exercitation eiusmod voluptat",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "l",
                    table: "nostrud consequat",
                    column: "",
                    dataSelector: "id velit ipsum Duis cupidatat",
                    dataSelectorRegex: "eiusmod qui",
                    transformFormat: "commodo occaecat Ut",
                    encryptionType: "est et ad officia",
                    redaction: "DEFAULT",
                    sourceRegex: "Excepteur do",
                    transformedRegex: "consectetur commodo aliquip aliqua Lorem",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "aliqua sunt occaecat dolor nisi",
                    table: "ad",
                    column: "laboris velit pariatur",
                    dataSelector: "labore minim",
                    dataSelectorRegex: "minim co",
                    transformFormat: "consequat velit enim aute nisi",
                    encryptionType: "sint quis cillum aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "nisi",
                    transformedRegex: "nostrud labore ex sunt r",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "Lorem",
                    table: "sed",
                    column: "quis ut sed esse nostrud",
                    dataSelector: "consequat pariatur dolore",
                    dataSelectorRegex: "voluptate",
                    transformFormat: "ea dolore",
                    encryptionType: "ex Duis",
                    redaction: "DEFAULT",
                    sourceRegex: "consequat",
                    transformedRegex: "voluptate Excepteur et enim eu",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "mollit",
                    table: "anim in velit non",
                    column: "deserunt amet par",
                    dataSelector: "nulla Lorem nisi eu ipsum",
                    dataSelectorRegex: "dolor ali",
                    transformFormat: "dolore ullamco",
                    encryptionType: "consectetur aliqua Ut anim",
                    redaction: "DEFAULT",
                    sourceRegex: "esse ea et",
                    transformedRegex: "esse dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "qui si",
                    table: "laborum ea culpa",
                    column: "consequat elit in",
                    dataSelector: "laborum Excepteur tempor ad irure",
                    dataSelectorRegex: "ipsum ad commodo",
                    transformFormat: "dolor",
                    encryptionType: "anim",
                    redaction: "DEFAULT",
                    sourceRegex: "fugiat do",
                    transformedRegex: "nulla",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sed aliqua non fugiat",
                    table: "aliqua",
                    column: "do dolore officia ad",
                    dataSelector: "esse minim",
                    dataSelectorRegex: "consequat eiusmod commodo est",
                    transformFormat: "in qui",
                    encryptionType: "dolor est",
                    redaction: "DEFAULT",
                    sourceRegex: "labore",
                    transformedRegex: "si",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ut sint veniam",
                    table: "veniam pari",
                    column: "sit mollit",
                    dataSelector: "veniam",
                    dataSelectorRegex: "rep",
                    transformFormat: "ut dolore mollit eu Excepteur",
                    encryptionType: "ut ut",
                    redaction: "DEFAULT",
                    sourceRegex: "aute",
                    transformedRegex: "fugiat proident commodo nisi",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "eu do nulla dolore",
                    table: "tempor culpa",
                    column: "pariatur Duis adipisicing in",
                    dataSelector: "labore dolore eiusmod Ut",
                    dataSelectorRegex: "sed irure aliquip dolore",
                    transformFormat: "labore ex minim elit ea",
                    encryptionType: "incididunt",
                    redaction: "DEFAULT",
                    sourceRegex: "et cupidatat deserunt irure",
                    transformedRegex: "aliquip consectetur labore",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "reprehenderit cillum fu",
                    table: "esse cupidatat laborum",
                    column: "nostrud consequat",
                    dataSelector: "enim minim ullamco eiusmod",
                    dataSelectorRegex: "voluptate laboris",
                    transformFormat: "esse aute",
                    encryptionType: "ut eu",
                    redaction: "DEFAULT",
                    sourceRegex: "sunt labore aliq",
                    transformedRegex: "mollit sunt in Lorem est",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "minim Duis et Ut in",
                    table: "ut consectetur consequat tempor",
                    column: "fugiat do voluptate ut",
                    dataSelector: "dolor cupidatat",
                    dataSelectorRegex: "ut",
                    transformFormat: "dolore ullamco adipisicing aliqua",
                    encryptionType: "consequat sint",
                    redaction: "DEFAULT",
                    sourceRegex: "cupidatat Ut occaecat",
                    transformedRegex: "dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "consequat dolore dolor aute",
                    table: "nisi officia tempor sint",
                    column: "dolore adipisicing quis",
                    dataSelector: "aliqua laborum",
                    dataSelectorRegex: "reprehenderit consequat ",
                    transformFormat: "culpa aliqua ad",
                    encryptionType: "eiusmod",
                    redaction: "DEFAULT",
                    sourceRegex: "nostrud proident Excepteur",
                    transformedRegex: "dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sit",
                    table: "fugiat amet tempor",
                    column: "nulla",
                    dataSelector: "in",
                    dataSelectorRegex: "dolore amet laborum cupidatat",
                    transformFormat: "dolor",
                    encryptionType: "exercitation fugiat aliquip amet",
                    redaction: "DEFAULT",
                    sourceRegex: "Excepteur labore exercitation",
                    transformedRegex: "Duis",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "conseq",
                    table: "reprehenderi",
                    column: "aute",
                    dataSelector: "occaecat voluptate esse Excepteur culpa",
                    dataSelectorRegex: "officia tempor ut Ut enim",
                    transformFormat: "commodo officia dolore",
                    encryptionType: "ullamco dolore ut",
                    redaction: "DEFAULT",
                    sourceRegex: "consequat reprehenderit sit irure",
                    transformedRegex: "voluptate",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ut ex",
                    table: "laborum in nostrud",
                    column: "enim in con",
                    dataSelector: "ullamco adipisicing dolor",
                    dataSelectorRegex: "deserunt",
                    transformFormat: "Duis",
                    encryptionType: "in do veniam",
                    redaction: "DEFAULT",
                    sourceRegex: "in irure reprehenderit elit",
                    transformedRegex: "Lorem",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "amet elit ad in id",
                    table: "cillum",
                    column: "cillum",
                    dataSelector: "do reprehenderit sunt minim quis",
                    dataSelectorRegex: "id cillum Excepteur deserunt u",
                    transformFormat: "dolor",
                    encryptionType: "laboris nulla labore ",
                    redaction: "DEFAULT",
                    sourceRegex: "amet",
                    transformedRegex: "cillum laboris dolo",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "exercitation adipisicing do",
                    table: "qui ",
                    column: "adipisicing Ut aliquip occaecat velit",
                    dataSelector: "ea fug",
                    dataSelectorRegex: "est dolor",
                    transformFormat: "Lorem velit do nisi",
                    encryptionType: "qui",
                    redaction: "DEFAULT",
                    sourceRegex: "aliqua ut labore",
                    transformedRegex: "est ut tempor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "incididunt",
                    table: "officia mollit",
                    column: "laborum",
                    dataSelector: "id",
                    dataSelectorRegex: "occaecat magna velit est",
                    transformFormat: "veniam velit",
                    encryptionType: "proident voluptate",
                    redaction: "DEFAULT",
                    sourceRegex: "in aute",
                    transformedRegex: "fugiat proident ",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco eu mollit exercitation",
                    table: "ea proident Ut",
                    column: "tempor quis ullamco",
                    dataSelector: "amet esse",
                    dataSelectorRegex: "nulla ea culpa irure",
                    transformFormat: "sint sunt",
                    encryptionType: "est elit ullamco dolore id",
                    redaction: "DEFAULT",
                    sourceRegex: "fugiat dolor aliqu",
                    transformedRegex: "pariatur eiusmod",
                },
            ],
            name: "consequat in aliqua",
            description: "in anim",
            soapAction: "reprehenderit",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "dolore nulla non sunt",
                    keyEncryptionAlgo: "Lorem commodo reprehenderit et aute",
                    contentEncryptionAlgo: "nulla",
                    signatureAlgorithm: "quis dolor ut Duis",
                    sourceRegex: "Duis amet",
                    transformedRegex: "do",
                    target: "mollit velit",
                },
                {
                    type: "NOACTION",
                    action: "tempor",
                    keyEncryptionAlgo: "nisi mollit velit",
                    contentEncryptionAlgo: "mollit",
                    signatureAlgorithm: "laboris exercitation",
                    sourceRegex: "occaecat sit qui ex sed",
                    transformedRegex: "exercitation sed",
                    target: "sunt",
                },
                {
                    type: "NOACTION",
                    action: "proident et",
                    keyEncryptionAlgo: "sit Except",
                    contentEncryptionAlgo: "in nulla dolore",
                    signatureAlgorithm: "magna",
                    sourceRegex: "qui exercitation sed",
                    transformedRegex: "magna pariatur voluptate",
                    target: "officia dolor veniam reprehenderit dolor",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "cupidatat",
                    keyEncryptionAlgo: "occaecat id aliqua aliquip ullamco",
                    contentEncryptionAlgo: "aliquip",
                    signatureAlgorithm: "nulla reprehenderit",
                    sourceRegex: "",
                    transformedRegex: "labore veniam",
                    target: "Lo",
                },
                {
                    type: "NOACTION",
                    action: "laborum in dolor",
                    keyEncryptionAlgo: "qui deserunt exercitation dolor",
                    contentEncryptionAlgo: "magna",
                    signatureAlgorithm: "id laborum sint veniam",
                    sourceRegex: "deserunt",
                    transformedRegex: "ipsum",
                    target: "occaecat sed",
                },
                {
                    type: "NOACTION",
                    action: "mini",
                    keyEncryptionAlgo: "esse officia",
                    contentEncryptionAlgo: "ad minim aliquip dolor Lorem",
                    signatureAlgorithm: "nostrud occaecat sed pariatur",
                    sourceRegex: "velit commodo eu",
                    transformedRegex: "magna occaecat in tempor eu",
                    target: "tempor voluptate sed",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "anim dolore ex",
                    keyEncryptionAlgo: "irure consectetur",
                    contentEncryptionAlgo: "pariatur nisi Excepteur irure",
                    signatureAlgorithm: "voluptate cupidatat nulla dolore",
                    sourceRegex: "sed",
                    transformedRegex: "Duis",
                    target: "labore",
                },
                {
                    type: "NOACTION",
                    action: "laborum eu",
                    keyEncryptionAlgo: "mollit culpa adipisicing veniam",
                    contentEncryptionAlgo: "eu",
                    signatureAlgorithm: "elit aliquip sed",
                    sourceRegex: "et exercitation eu voluptate",
                    transformedRegex: "non ea officia",
                    target: "incididunt nostrud anim consectetur nisi",
                },
                {
                    type: "NOACTION",
                    action: "id consectetur dolor",
                    keyEncryptionAlgo: "ut in",
                    contentEncryptionAlgo: "anim sit in qui pariatur",
                    signatureAlgorithm: "amet",
                    sourceRegex: "occaecat elit in",
                    transformedRegex: "in amet",
                    target: "ullamco reprehenderit fugiat nulla voluptate",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "id",
                    keyEncryptionAlgo: "ut ea aliquip",
                    contentEncryptionAlgo: "consectetur minim Lorem cupidatat",
                    signatureAlgorithm: "cupidatat pariatur labore Lorem",
                    sourceRegex: "voluptate ex incididunt sint",
                    transformedRegex: "in in velit",
                    target: "cillum",
                },
                {
                    type: "NOACTION",
                    action: "non",
                    keyEncryptionAlgo: "do voluptate in laborum",
                    contentEncryptionAlgo: "sunt in",
                    signatureAlgorithm: "elit a",
                    sourceRegex: "tempor reprehenderit commodo ex",
                    transformedRegex: "sunt sint ad elit ut",
                    target: "laboris qui amet fugiat",
                },
                {
                    type: "NOACTION",
                    action: "esse dolore do sed",
                    keyEncryptionAlgo: "dolore ut",
                    contentEncryptionAlgo: "eu velit",
                    signatureAlgorithm: "Ut sint",
                    sourceRegex: "magna amet",
                    transformedRegex: "deserunt quis Duis nulla tempor",
                    target: "occaecat aliqua exercitation laboris",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "nulla exer",
                    column: "ut adipisicing",
                },
                {
                    table: "sint nostrud et aliqua",
                    column: "reprehenderit ex",
                },
                {
                    table: "sunt elit",
                    column: "ea",
                },
            ],
        },
        {
            path: "dolor id labore",
            method: "ea voluptate magna",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "officia laborum esse laboris Ut",
                    table: "incididunt nulla",
                    column: "est",
                    dataSelector: "tempor quis do",
                    dataSelectorRegex: "officia veniam",
                    transformFormat: "minim adipisicing cillum ea",
                    encryptionType: "occaecat mollit eiusmod",
                    redaction: "DEFAULT",
                    sourceRegex: "irure dolore reprehen",
                    transformedRegex: "pariatur laborum cillum enim laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "tempor",
                    table: "in",
                    column: "irure reprehenderit nulla Excepteur do",
                    dataSelector: "labore dolore irure id",
                    dataSelectorRegex: "ipsum cillum esse mollit",
                    transformFormat: "mollit Excepteur",
                    encryptionType: "esse Duis magna ea",
                    redaction: "DEFAULT",
                    sourceRegex: "ea",
                    transformedRegex: "ea Ut ven",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "aliquip",
                    table: "est anim adipisicing tempor qui",
                    column: "ut",
                    dataSelector: "ali",
                    dataSelectorRegex: "esse cupidatat",
                    transformFormat: "exercitation",
                    encryptionType: "adipisicing fugiat magna",
                    redaction: "DEFAULT",
                    sourceRegex: "Lorem proident consectetur ex labore",
                    transformedRegex: "ex",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea exercitation cupidatat",
                    table: "nulla voluptate",
                    column: "velit est Duis",
                    dataSelector: "dolor nisi irure",
                    dataSelectorRegex: "consequat eiusmod mollit Lor",
                    transformFormat: "nulla sunt laboris",
                    encryptionType: "ea",
                    redaction: "DEFAULT",
                    sourceRegex: "mollit",
                    transformedRegex: "qui mollit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ad dolore",
                    table: "fugi",
                    column: "n",
                    dataSelector: "eu dolor sit sint in",
                    dataSelectorRegex: "commodo",
                    transformFormat: "dolor minim ea",
                    encryptionType: "dolore id",
                    redaction: "DEFAULT",
                    sourceRegex: "aliquip anim ut occaecat",
                    transformedRegex: "esse",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "adipisicing ex officia dolor aliqua",
                    table: "quis dolor reprehenderit",
                    column: "ad est commodo",
                    dataSelector: "Duis",
                    dataSelectorRegex: "consectetur ipsum s",
                    transformFormat: "sint nulla dolor laborum",
                    encryptionType: "voluptate dolore",
                    redaction: "DEFAULT",
                    sourceRegex: "ut cillum esse commodo",
                    transformedRegex: "consequat exercitation est",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "m",
                    table: "ipsum enim eu ut",
                    column: "nostrud cillum enim eu Duis",
                    dataSelector: "nulla eiusmod",
                    dataSelectorRegex: "enim cillum do",
                    transformFormat: "eiusmod ad voluptate non",
                    encryptionType: "reprehen",
                    redaction: "DEFAULT",
                    sourceRegex: "sit ",
                    transformedRegex: "cupidatat laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco adipisicing sit et incididunt",
                    table: "est cillum laboris",
                    column: "adipisicing Ut ullamco",
                    dataSelector: "laboris Excepteur aliquip aliqua ipsum",
                    dataSelectorRegex: "Ut reprehenderit eiusmod in",
                    transformFormat: "tempor Excepteur nostrud reprehenderit",
                    encryptionType: "fugiat tempor reprehenderit",
                    redaction: "DEFAULT",
                    sourceRegex: "ad id",
                    transformedRegex: "anim reprehenderit amet",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "laborum do incididunt",
                    table: "irure velit Ut commodo",
                    column: "minim adipisicing elit cupidatat incididunt",
                    dataSelector: "ut in anim",
                    dataSelectorRegex: "Excepteur quis sint",
                    transformFormat: "ir",
                    encryptionType: "incididunt proident pariatur qui",
                    redaction: "DEFAULT",
                    sourceRegex: "commodo",
                    transformedRegex: "irure amet",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "commodo eu cillum",
                    table: "consequat exercitation aliqua sed deseru",
                    column: "incididunt officia commodo do",
                    dataSelector: "tempor Ut sed occaecat",
                    dataSelectorRegex: "laborum dolore",
                    transformFormat: "aliquip dolor sint Excepteur culpa",
                    encryptionType: "sunt deserunt",
                    redaction: "DEFAULT",
                    sourceRegex: "incididunt enim tempor deserunt",
                    transformedRegex: "nostrud sed consequat anim et",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "id dolore",
                    table: "ut dolor incididunt Ut dolore",
                    column: "laboris pariatur amet",
                    dataSelector: "dolore in et incididunt",
                    dataSelectorRegex: "dolore id pariatur",
                    transformFormat: "elit sunt Duis culpa et",
                    encryptionType: "ut nisi in sint",
                    redaction: "DEFAULT",
                    sourceRegex: "amet eu incididunt sed",
                    transformedRegex: "sint ea in aliquip minim",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "consectetur",
                    table: "dolor voluptate occaecat adipisicing culpa",
                    column: "dolor",
                    dataSelector: "cupidatat laborum anim",
                    dataSelectorRegex: "in laboris",
                    transformFormat: "Ut eu voluptate sunt incididun",
                    encryptionType: "do sunt exercitation dolor",
                    redaction: "DEFAULT",
                    sourceRegex: "adipisicing proident dolor fugiat",
                    transformedRegex: "consequat amet id Ut dolor",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "Duis in esse",
                    table: "elit et commodo dolore",
                    column: "sit pariatur laboris",
                    dataSelector: "labore voluptate",
                    dataSelectorRegex: "ipsum c",
                    transformFormat: "sit",
                    encryptionType: "Duis dolor eiusmod magna",
                    redaction: "DEFAULT",
                    sourceRegex: "id nulla Ut aliqua non",
                    transformedRegex: "ex in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "Excepteur amet Ut voluptate mollit",
                    table: "qui velit quis aliquip",
                    column: "fugiat et nostrud",
                    dataSelector: "Ut commodo",
                    dataSelectorRegex: "magna amet deser",
                    transformFormat: "esse aliqua ut id",
                    encryptionType: "deserunt esse in",
                    redaction: "DEFAULT",
                    sourceRegex: "officia occaecat eu",
                    transformedRegex: "ea incididunt elit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "est",
                    table: "commodo",
                    column: "ad mollit",
                    dataSelector: "consectetu",
                    dataSelectorRegex: "fugiat commodo officia reprehenderit",
                    transformFormat: "pariatur l",
                    encryptionType: "ut",
                    redaction: "DEFAULT",
                    sourceRegex: "ani",
                    transformedRegex: "laboris elit laborum",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea",
                    table: "elit",
                    column: "sed ex ut fugiat qui",
                    dataSelector: "enim",
                    dataSelectorRegex: "amet ullamco in",
                    transformFormat: "commodo Excepteur",
                    encryptionType: "minim commodo est ea Excepteur",
                    redaction: "DEFAULT",
                    sourceRegex: "Lorem cillum tempor sit",
                    transformedRegex: "et eu in ut e",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "voluptate laborum laboris",
                    table: "ipsum ut occaecat aute laborum",
                    column: "esse",
                    dataSelector: "dolore Excepteur nostrud adipi",
                    dataSelectorRegex: "eu nisi culpa",
                    transformFormat: "enim aute exercitation in dolor",
                    encryptionType: "in ipsum aute",
                    redaction: "DEFAULT",
                    sourceRegex: "elit",
                    transformedRegex: "ex Duis",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ullamco",
                    table: "eu nisi do",
                    column: "deserunt cup",
                    dataSelector: "sit ullamco eiusmod aliqua occaecat",
                    dataSelectorRegex: "dolore tempor cupidatat",
                    transformFormat: "minim in",
                    encryptionType: "sunt dolore ut",
                    redaction: "DEFAULT",
                    sourceRegex: "nisi",
                    transformedRegex: "amet nostrud labore",
                },
            ],
            name: "ea labore dolor in do",
            description: "commodo adipisicing eiusmod consequat esse",
            soapAction: "occaecat proident consectetur exerci",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "in est commodo quis",
                    keyEncryptionAlgo: "elit",
                    contentEncryptionAlgo: "occaecat culpa ea",
                    signatureAlgorithm: "cupidatat laboris",
                    sourceRegex: "mollit sed cupidatat",
                    transformedRegex: "in",
                    target: "elit commodo ",
                },
                {
                    type: "NOACTION",
                    action: "mollit veniam consequ",
                    keyEncryptionAlgo: "elit in",
                    contentEncryptionAlgo: "occaecat est fugiat",
                    signatureAlgorithm: "laborum",
                    sourceRegex: "amet cillum",
                    transformedRegex: "eu ut ad",
                    target: "velit ipsum",
                },
                {
                    type: "NOACTION",
                    action: "adipisicing laborum id",
                    keyEncryptionAlgo: "mollit ex",
                    contentEncryptionAlgo: "dolor tempor",
                    signatureAlgorithm: "cupidatat officia",
                    sourceRegex: "sed proident esse tempor",
                    transformedRegex: "dolore adipisicing veniam",
                    target: "incididunt",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "anim sunt enim ad",
                    keyEncryptionAlgo: "ut consectetur sit mollit commodo",
                    contentEncryptionAlgo: "incididunt aliqua",
                    signatureAlgorithm: "tempor deserunt Excepteur consectetur magna",
                    sourceRegex: "laboris veniam",
                    transformedRegex: "ullamco",
                    target: "do consequat",
                },
                {
                    type: "NOACTION",
                    action: "consectetur",
                    keyEncryptionAlgo: "mollit amet officia",
                    contentEncryptionAlgo: "Excepteur",
                    signatureAlgorithm: "irure cillum anim Ut mollit",
                    sourceRegex: "ir",
                    transformedRegex: "anim",
                    target: "ma",
                },
                {
                    type: "NOACTION",
                    action: "dolore in",
                    keyEncryptionAlgo: "magna irure labore veniam eu",
                    contentEncryptionAlgo: "amet",
                    signatureAlgorithm: "fugiat in",
                    sourceRegex: "dolor Duis pariatur tempor sint",
                    transformedRegex: "eiusmod exercitation",
                    target: "dolor in en",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "laboris esse tempor veniam",
                    keyEncryptionAlgo: "laboris in non esse",
                    contentEncryptionAlgo: "proident n",
                    signatureAlgorithm: "dolore minim velit",
                    sourceRegex: "occaecat enim reprehenderit irure",
                    transformedRegex: "adipisicing",
                    target: "voluptate ni",
                },
                {
                    type: "NOACTION",
                    action: "in eu occaecat dolor",
                    keyEncryptionAlgo: "occaecat laboris proident aute",
                    contentEncryptionAlgo: "non eu ",
                    signatureAlgorithm: "esse",
                    sourceRegex: "anim ",
                    transformedRegex: "vol",
                    target: "consequat reprehenderit cillum",
                },
                {
                    type: "NOACTION",
                    action: "irure",
                    keyEncryptionAlgo: "sed voluptate dolor",
                    contentEncryptionAlgo: "ea quis",
                    signatureAlgorithm: "pariatur ullamco Duis",
                    sourceRegex: "nisi tempo",
                    transformedRegex: "labore sint",
                    target: "reprehenderit pariatur",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "cupidatat pariatur commodo amet",
                    keyEncryptionAlgo: "cillum",
                    contentEncryptionAlgo: "mol",
                    signatureAlgorithm: "Lorem ut",
                    sourceRegex: "laboris commodo do minim et",
                    transformedRegex: "sed ipsum pro",
                    target: "laborum officia in",
                },
                {
                    type: "NOACTION",
                    action: "laboris est",
                    keyEncryptionAlgo: "dolor fugiat culpa est",
                    contentEncryptionAlgo: "d",
                    signatureAlgorithm: "dolor nisi ut quis",
                    sourceRegex: "dolor nulla mollit aliquip tempor",
                    transformedRegex: "ut dolore",
                    target: "Ut nostrud ut cillum",
                },
                {
                    type: "NOACTION",
                    action: "consequat laborum dolore",
                    keyEncryptionAlgo: "ut fugiat consectetur Excepteur",
                    contentEncryptionAlgo: "ut ex ipsum s",
                    signatureAlgorithm: "anim eu in Duis",
                    sourceRegex: "sunt dolore laboris ipsum commodo",
                    transformedRegex: "eiusmod aute irure",
                    target: "est incididunt irure voluptate",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "dolore minim",
                    column: "",
                },
                {
                    table: "deserunt in adipisicing consequat",
                    column: "eiusmod",
                },
                {
                    table: "i",
                    column: "est amet ipsum ut exercitation",
                },
            ],
        },
        {
            path: "est aute dolore pariatur",
            method: "velit proident",
            contentType: "JSON",
            url: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "cillum",
                    table: "incididunt exerc",
                    column: "dolor",
                    dataSelector: "enim",
                    dataSelectorRegex: "Duis irure",
                    transformFormat: "mollit nulla",
                    encryptionType: "et adipisicing",
                    redaction: "DEFAULT",
                    sourceRegex: "ex",
                    transformedRegex: "ullamco in dolor elit velit",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "est do",
                    table: "ullamco velit",
                    column: "veniam cupidatat sint",
                    dataSelector: "sit dolore",
                    dataSelectorRegex: "ad mollit",
                    transformFormat: "amet eu velit in officia",
                    encryptionType: "nostrud",
                    redaction: "DEFAULT",
                    sourceRegex: "quis Ut deserunt proident adipisicing",
                    transformedRegex: "pariatur ea aute",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "quis deserunt esse Lorem occaecat",
                    table: "Duis",
                    column: "fugiat",
                    dataSelector: "do aute proident reprehe",
                    dataSelectorRegex: "fugiat dolore cupidatat enim",
                    transformFormat: "adipisicing occaeca",
                    encryptionType: "Duis in nisi laboris sint",
                    redaction: "DEFAULT",
                    sourceRegex: "in",
                    transformedRegex: "labore",
                },
            ],
            requestBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "nulla labo",
                    table: "Excepteur aute ullamco",
                    column: "ea",
                    dataSelector: "in",
                    dataSelectorRegex: "voluptate minim ut",
                    transformFormat: "et",
                    encryptionType: "ad occaecat sint",
                    redaction: "DEFAULT",
                    sourceRegex: "enim qui",
                    transformedRegex: "laboris",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "ea exercitation et nisi",
                    table: "irure sed",
                    column: "consequat laboris",
                    dataSelector: "eu Duis",
                    dataSelectorRegex: "eu sint veniam incidid",
                    transformFormat: "dolore deserunt",
                    encryptionType: "tempor amet et culpa",
                    redaction: "DEFAULT",
                    sourceRegex: "in",
                    transformedRegex: "in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "officia",
                    table: "qui nostrud laboris et",
                    column: "cupidatat laboris Lorem",
                    dataSelector: "eu cillum veniam sed Ut",
                    dataSelectorRegex: "mollit commodo id anim",
                    transformFormat: "inci",
                    encryptionType: "nulla ut non",
                    redaction: "DEFAULT",
                    sourceRegex: "occaecat qui cillum aute",
                    transformedRegex: "do minim consequat irure ut",
                },
            ],
            responseBody: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "sed in labore sunt",
                    table: "elit",
                    column: "quis magna cillum",
                    dataSelector: "ullamco reprehenderit Lorem in",
                    dataSelectorRegex: "amet officia id sed",
                    transformFormat: "eiusmod in",
                    encryptionType: "ullamco ",
                    redaction: "DEFAULT",
                    sourceRegex: "qui ut",
                    transformedRegex: "sed veniam consectetur eiusmod",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "",
                    table: "et anim",
                    column: "qui exerc",
                    dataSelector: "consectetur Lorem in labore sed",
                    dataSelectorRegex: "laborum pariatur in sed Excepteur",
                    transformFormat: "anim consectetur occaecat eiusmod qui",
                    encryptionType: "Duis dolor ad aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "",
                    transformedRegex: "in nulla ea do",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolor incididunt",
                    table: "dolore quis laborum ad cillum",
                    column: "culpa c",
                    dataSelector: "non",
                    dataSelectorRegex: "proident",
                    transformFormat: "nulla Excepteur",
                    encryptionType: "reprehenderit",
                    redaction: "DEFAULT",
                    sourceRegex: "in dolor id cupidatat elit",
                    transformedRegex: "ipsum dolor eu veniam",
                },
            ],
            responseHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "occaecat minim officia",
                    table: "est esse dolore ea a",
                    column: "officia quis cillum s",
                    dataSelector: "sint consectetur culpa",
                    dataSelectorRegex: "cillum sunt",
                    transformFormat: "cillum Excepteur pariatur fugiat es",
                    encryptionType: "aliq",
                    redaction: "DEFAULT",
                    sourceRegex: "officia fugiat dolore labo",
                    transformedRegex: "in pariatur sunt consequat",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolor eu minim",
                    table: "non ipsum sit",
                    column: "ad esse et commodo exercitation",
                    dataSelector: "minim nostrud",
                    dataSelectorRegex: "proident molli",
                    transformFormat: "amet Duis ut",
                    encryptionType: "in ullamco aliquip ",
                    redaction: "DEFAULT",
                    sourceRegex: "eiusmod Lorem mollit deserunt",
                    transformedRegex: "in ut magna laborum",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "incididunt cillum sint qui",
                    table: "nisi aliqua",
                    column: "dolor anim",
                    dataSelector: "nostrud consectetur",
                    dataSelectorRegex: "laborum s",
                    transformFormat: "ullamco reprehenderit culpa id Duis",
                    encryptionType: "ut aliquip et laboris",
                    redaction: "DEFAULT",
                    sourceRegex: "id min",
                    transformedRegex: "ex ea Ut",
                },
            ],
            queryParams: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "culpa ex proident amet in",
                    table: "ullamco do",
                    column: "qui in laboris",
                    dataSelector: "mollit",
                    dataSelectorRegex: "est",
                    transformFormat: "ut mollit ut adipi",
                    encryptionType: "ea incididunt pariatur minim magna",
                    redaction: "DEFAULT",
                    sourceRegex: "voluptate qui et",
                    transformedRegex: "deserunt sunt enim",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "sit",
                    table: "eu magna",
                    column: "Ut",
                    dataSelector: "aliquip n",
                    dataSelectorRegex: "sint fugiat ad",
                    transformFormat: "Duis ",
                    encryptionType: "est sint culpa proident",
                    redaction: "DEFAULT",
                    sourceRegex: "veniam ipsum ut Excepteur",
                    transformedRegex: "in",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "dolore",
                    table: "ut non",
                    column: "ullamco ex ut",
                    dataSelector: "pariatur id",
                    dataSelectorRegex: "in magna non Duis",
                    transformFormat: "aliquip labore eu",
                    encryptionType: "velit",
                    redaction: "DEFAULT",
                    sourceRegex: "veniam ullamco",
                    transformedRegex: "dolore Duis aliqua",
                },
            ],
            requestHeader: [
                {
                    action: "NOT_SELECTED",
                    fieldName: "sint nisi",
                    table: "commodo Duis aute anim nulla",
                    column: "eiusmod ut",
                    dataSelector: "fugiat qui anim sed",
                    dataSelectorRegex: "minim ",
                    transformFormat: "tempor aliqua commodo ex",
                    encryptionType: "",
                    redaction: "DEFAULT",
                    sourceRegex: "",
                    transformedRegex: "nostrud officia",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "culpa",
                    table: "dolore elit",
                    column: "labore Excepteur sit in fugiat",
                    dataSelector: "ut est tempor",
                    dataSelectorRegex: "proident",
                    transformFormat: "do in esse",
                    encryptionType: "tempor dolore",
                    redaction: "DEFAULT",
                    sourceRegex: "occaecat eu Ut",
                    transformedRegex: "reprehenderit ea dolor",
                },
                {
                    action: "NOT_SELECTED",
                    fieldName: "adipisicing dolor",
                    table: "ipsum consequat",
                    column: "nostrud cupidatat Duis in esse",
                    dataSelector: "Excepteur do velit amet",
                    dataSelectorRegex: "consequat",
                    transformFormat: "commodo dolore cupidatat",
                    encryptionType: "Duis aliquip",
                    redaction: "DEFAULT",
                    sourceRegex: "qui",
                    transformedRegex: "labore cons",
                },
            ],
            name: "sint",
            description: "velit eiusmod si",
            soapAction: "consectetur tempor nostrud",
            mleType: "NOT_REQUIRED",
            preFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "elit",
                    keyEncryptionAlgo: "exercitation ipsum consectetur",
                    contentEncryptionAlgo: "nisi",
                    signatureAlgorithm: "Lorem mollit amet dolor",
                    sourceRegex: "sed",
                    transformedRegex: "aliquip offi",
                    target: "",
                },
                {
                    type: "NOACTION",
                    action: "velit est Ut ullam",
                    keyEncryptionAlgo: "ipsum esse consequat laborum",
                    contentEncryptionAlgo: "adipisicing",
                    signatureAlgorithm: "eiusmod sed aliquip sit quis",
                    sourceRegex: "sit",
                    transformedRegex: "do",
                    target: "ut id eiusmod",
                },
                {
                    type: "NOACTION",
                    action: "ea culpa nisi Ut in",
                    keyEncryptionAlgo: "Duis quis qui Lorem nostr",
                    contentEncryptionAlgo: "et",
                    signatureAlgorithm: "aliqua aliquip consequ",
                    sourceRegex: "ipsum aliqua sunt",
                    transformedRegex: "sit eiusmod aliquip",
                    target: "laboris ex",
                },
            ],
            postFieldRequestMessageActions: [
                {
                    type: "NOACTION",
                    action: "do dolor laboris veniam",
                    keyEncryptionAlgo: "anim veniam",
                    contentEncryptionAlgo: "sint",
                    signatureAlgorithm: "Ut velit mollit",
                    sourceRegex: "dolor",
                    transformedRegex: "aliquip magna",
                    target: "enim Duis",
                },
                {
                    type: "NOACTION",
                    action: "ex reprehenderi",
                    keyEncryptionAlgo: "cupidatat",
                    contentEncryptionAlgo: "cillum labore deserunt sit",
                    signatureAlgorithm: "et in eu consectetur labore",
                    sourceRegex: "ut",
                    transformedRegex: "labore",
                    target: "elit officia",
                },
                {
                    type: "NOACTION",
                    action: "in eiusmod qui magna",
                    keyEncryptionAlgo: "nulla dolore reprehenderit ipsum",
                    contentEncryptionAlgo: "laboris nis",
                    signatureAlgorithm: "ipsum consequat",
                    sourceRegex: "magna",
                    transformedRegex: "magna minim Excepteur proident sint",
                    target: "qui",
                },
            ],
            preFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "officia sunt ut",
                    keyEncryptionAlgo: "nisi anim ullamco co",
                    contentEncryptionAlgo: "non nostrud ut",
                    signatureAlgorithm: "elit irure",
                    sourceRegex: "laborum sed pariatur",
                    transformedRegex: "dolor aliqua commodo aliq",
                    target: "mollit exercitation sit laborum",
                },
                {
                    type: "NOACTION",
                    action: "commodo ea in anim",
                    keyEncryptionAlgo: "r",
                    contentEncryptionAlgo: "officia amet",
                    signatureAlgorithm: "in Duis eu v",
                    sourceRegex: "exercitation culpa",
                    transformedRegex: "veniam",
                    target: "in id aliqua",
                },
                {
                    type: "NOACTION",
                    action: "non consequat amet dolor mollit",
                    keyEncryptionAlgo: "tempor ex ut velit aliquip",
                    contentEncryptionAlgo: "culpa officia",
                    signatureAlgorithm: "Ut proident aliqua nostrud in",
                    sourceRegex: "laborum sint",
                    transformedRegex: "in dolore fugiat sunt occaecat",
                    target: "proident",
                },
            ],
            postFieldResponseMessageActions: [
                {
                    type: "NOACTION",
                    action: "exercitation eius",
                    keyEncryptionAlgo: "id eu",
                    contentEncryptionAlgo: "aliqua nostrud cons",
                    signatureAlgorithm: "voluptate nisi elit",
                    sourceRegex: "exercitation sint enim labore commo",
                    transformedRegex: "qui ex",
                    target: "incididunt fugiat voluptate Lorem eu",
                },
                {
                    type: "NOACTION",
                    action: "eu",
                    keyEncryptionAlgo: "nulla",
                    contentEncryptionAlgo: "esse",
                    signatureAlgorithm: "et aliquip minim qui",
                    sourceRegex: "ex aute ad enim i",
                    transformedRegex: "aliqua incididunt commodo Dui",
                    target: "magna id",
                },
                {
                    type: "NOACTION",
                    action: "sit incididu",
                    keyEncryptionAlgo: "et dolor aliquip",
                    contentEncryptionAlgo: "aliquip Ut dolor",
                    signatureAlgorithm: "ipsum mollit consequat aliquip amet",
                    sourceRegex: "velit eiusmod pariatur",
                    transformedRegex: "dolor magna Ut",
                    target: "ea sit est",
                },
            ],
            tableUpsertInfo: [
                {
                    table: "mollit",
                    column: "dolor magna ut id sed",
                },
                {
                    table: "magna et",
                    column: "eu ad in voluptate quis",
                },
                {
                    table: "Duis voluptate Excepteur ipsum",
                    column: "commodo ut nisi",
                },
            ],
        },
    ],
    authMode: "NOAUTH",
    description: "repreh",
    BasicAudit: {
        CreatedBy: "adipisicing non elit quis",
        LastModifiedBy: "enim ut reprehenderit",
        CreatedOn: "in elit et sed",
        LastModifiedOn: "incididunt laborum labore pariatur",
    },
    denyPassThrough: true,
    formEncodedKeysPassThrough: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the connection.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.V1RelayMappings`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceDeleteOutboundIntegration</a>(id) -> Skyflow.V1Empty</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified outbound connection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceDeleteOutboundIntegration("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the connection.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.connections.<a href="/src/api/resources/connections/client/Client.ts">integrationServiceUploadSecret</a>(id, { ...params }) -> Skyflow.V1Empty</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Uploads authentication information for an outbound connection.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.connections.integrationServiceUploadSecret("ID", {
    routeSecret: {
        sharedKey: "anim velit",
        publicKey: "adipisicing dolore aliqua exercitation magna",
        privateKey: "dolo",
    },
    mleAuthSecret: {
        publicKeyMLE: "aute esse",
        privateKeyMLE: "sit consequat non veniam quis",
        keyID: "ea minim",
    },
    soapAuthSecret: {
        keyStore: "cupidatat lab",
        binarySecurityToken: "cupidatat sit",
        userName: "amet",
        password: "do incididunt sit i",
        keyStorePassword: "mollit Duis irure officia",
    },
    oAuth1aSecret: {
        consumerKey: "commodo Excepteur officia ut",
        consumerSecret: "esse deserunt nostrud sunt consecte",
    },
    messageSecrets: {
        encPublicKey: "velit sint",
        encPrivateKey: "eu ad Lorem incididun",
        signPublicKey: "adipisicing sit",
        signPrivateKey: "elit veniam dolore laborum ",
        encSymmetricKey: "Lorem occaecat magna",
        signSymmetricKey: "consequat",
    },
    fieldEncryptionSecret: "in",
    authMode: "NOAUTH",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the connection.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.Secrets`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Connections.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Operations

<details><summary><code>client.operations.<a href="/src/api/resources/operations/client/Client.ts">operationServiceGetOperation</a>(id) -> Skyflow.Operation</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the status and details of a specific asynchronous operation.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.operations.operationServiceGetOperation("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the operation.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Operations.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Roles

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceListPermissionsOfMember</a>(memberId, { ...params }) -> Skyflow.V1ListPermissionsOfMemberResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists permissions assigned to a member.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceListPermissionsOfMember("member.ID", {
    "member.type": "NONE",
    "member.name": "member.name",
    "member.email": "member.email",
    "member.status": "NONE",
    "member.user.name": "member.user.name",
    "member.user.contactAddress.streetAddress": "member.user.contactAddress.streetAddress",
    "member.user.contactAddress.city": "member.user.contactAddress.city",
    "member.user.contactAddress.state": "member.user.contactAddress.state",
    "member.user.contactAddress.country": "member.user.contactAddress.country",
    "member.user.contactAddress.zip": 1,
    "member.user.userIdentity.email": "member.user.userIdentity.email",
    "member.user.userIdentity.oktaID": "member.user.userIdentity.oktaID",
    "member.user.ID": "member.user.ID",
    "member.user.status": "NONE",
    "member.user.BasicAudit.CreatedBy": "member.user.BasicAudit.CreatedBy",
    "member.user.BasicAudit.LastModifiedBy": "member.user.BasicAudit.LastModifiedBy",
    "member.user.BasicAudit.CreatedOn": "member.user.BasicAudit.CreatedOn",
    "member.user.BasicAudit.LastModifiedOn": "member.user.BasicAudit.LastModifiedOn",
    "member.serviceAccountInfo.serviceAccount.name": "member.serviceAccountInfo.serviceAccount.name",
    "member.serviceAccountInfo.serviceAccount.displayName": "member.serviceAccountInfo.serviceAccount.displayName",
    "member.serviceAccountInfo.serviceAccount.description": "member.serviceAccountInfo.serviceAccount.description",
    "member.serviceAccountInfo.serviceAccount.ID": "member.serviceAccountInfo.serviceAccount.ID",
    "member.serviceAccountInfo.serviceAccount.namespace": "member.serviceAccountInfo.serviceAccount.namespace",
    "member.serviceAccountInfo.serviceAccount.status": "NONE",
    "member.serviceAccountInfo.serviceAccount.BasicAudit.CreatedBy":
        "member.serviceAccountInfo.serviceAccount.BasicAudit.CreatedBy",
    "member.serviceAccountInfo.serviceAccount.BasicAudit.LastModifiedBy":
        "member.serviceAccountInfo.serviceAccount.BasicAudit.LastModifiedBy",
    "member.serviceAccountInfo.serviceAccount.BasicAudit.CreatedOn":
        "member.serviceAccountInfo.serviceAccount.BasicAudit.CreatedOn",
    "member.serviceAccountInfo.serviceAccount.BasicAudit.LastModifiedOn":
        "member.serviceAccountInfo.serviceAccount.BasicAudit.LastModifiedOn",
    "member.serviceAccountInfo.clientConfiguration.enforceContextID": true,
    "member.serviceAccountInfo.clientConfiguration.enforceSignedDataTokens": true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**memberId:** `string` — ID of the member.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.RoleServiceListPermissionsOfMemberRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceListRolesOfMember</a>(memberId, { ...params }) -> Skyflow.V1ListRolesOfMemberResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists roles assigned to a member as role-to-resource pairs.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceListRolesOfMember("member.ID", {
    "member.type": "NONE",
    "member.name": "member.name",
    "member.email": "member.email",
    "member.status": "NONE",
    offset: "offset",
    limit: "limit",
    "filterOps.name": "filterOps.name",
    "filterOps.resource.ID": "filterOps.resource.ID",
    "filterOps.resource.type": "NONE",
    "filterOps.resource.name": "filterOps.resource.name",
    "filterOps.resource.namespace": "filterOps.resource.namespace",
    "filterOps.resource.description": "filterOps.resource.description",
    "filterOps.resource.status": "NONE",
    "filterOps.resource.displayName": "filterOps.resource.displayName",
    "filterOps.roleType": "NONE",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**memberId:** `string` — ID of the member.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.RoleServiceListRolesOfMemberRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceListRolesOfPolicy</a>(policyId, { ...params }) -> Skyflow.V1ListRolesOfPolicyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists roles assigned to a <a href='#Policies'>policy</a>.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceListRolesOfPolicy("policyID", {
    "filterOps.name": "filterOps.name",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: "offset",
    limit: "limit",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**policyId:** `string` — ID of the policy.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.RoleServiceListRolesOfPolicyRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceListRoleDefinitions</a>({ ...params }) -> Skyflow.V1ListRoleDefinitionsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists Skyflow-defined roles. You can't update or delete these roles.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceListRoleDefinitions({
    resourceType: "NONE",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.RoleServiceListRoleDefinitionsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceListRoles</a>({ ...params }) -> Skyflow.V1ListRolesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists roles associated with a resource.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceListRoles({
    "resource.ID": "resource.ID",
    "resource.type": "NONE",
    "resource.name": "resource.name",
    "resource.namespace": "resource.namespace",
    "resource.description": "resource.description",
    "resource.status": "NONE",
    "resource.displayName": "resource.displayName",
    name: "name",
    type: "NONE",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.RoleServiceListRolesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceCreateRole</a>({ ...params }) -> Skyflow.V1CreateRoleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a custom role for the specified resource. After you create a role, you need to <a href='#RoleService_AssignRole'>assign the role</a> to a user or service account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceCreateRole({
    roleDefinition: {
        name: "sed",
        displayName: "proident amet",
        description: "e",
        permissions: ["pariatur Lorem", "sit", "laboris "],
        levels: ["velit irure", "culpa ipsum aliquip officia minim", "ad in amet est"],
        type: "NONE",
    },
    resource: {
        ID: "Excepteur",
        type: "NONE",
        name: "culpa consecte",
        namespace: "tempor exercitation in commodo eiusmod",
        description: "Lorem dolor",
        status: "NONE",
        displayName: "anim dolor exercitation",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1CreateRoleRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceAssignRole</a>({ ...params }) -> Skyflow.V1AssignRoleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Assigns a role to a member.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceAssignRole({
    ID: "est Duis anim Lorem",
    members: [
        {
            ID: "nostrud Duis sunt officia dolo",
            type: "NONE",
            name: "voluptate consequat dolore enim",
            email: "nisi eiusmod non",
            status: "NONE",
        },
        {
            ID: "nisi in ips",
            type: "NONE",
            name: "ex sunt mollit laborum nostrud",
            email: "dolor anim exercitation Duis",
            status: "NONE",
        },
        {
            ID: "aute",
            type: "NONE",
            name: "eiusmod reprehenderit sed labore",
            email: "deserunt dolor Duis nostrud",
            status: "NONE",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1AssignRoleRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceUnassignRole</a>({ ...params }) -> Skyflow.V1UnassignRoleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Removes a role from members.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceUnassignRole({
    ID: "quis id",
    members: [
        {
            ID: "Duis incididunt",
            type: "NONE",
            name: "velit occaecat sunt consequat",
            email: "mollit Ut pariatur aute",
            status: "NONE",
        },
        {
            ID: "exercitatio",
            type: "NONE",
            name: "occaecat in",
            email: "incididunt",
            status: "NONE",
        },
        {
            ID: "velit et enim",
            type: "NONE",
            name: "eu et exercitation aliqui",
            email: "minim irure eu anim do",
            status: "NONE",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1UnassignRoleRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceGetRole</a>(id) -> Skyflow.V1GetRoleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified role.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceGetRole("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the role.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceDeleteRole</a>(id) -> Skyflow.V1DeleteRoleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a custom role. Attempting to delete Skyflow-defined roles results in an error.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceDeleteRole("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the role.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceUpdateRole</a>(id, { ...params }) -> Skyflow.V1UpdateRoleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates a custom role. Attempting to update Skyflow-defined roles results in an error.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceUpdateRole("ID", {
    roleDefinition: {
        name: "nisi enim",
        displayName: "adipisicing",
        description: "exercitation voluptate commodo",
        permissions: ["nisi nostrud", "aute", "anim dolore enim"],
        levels: ["consequat mollit esse", "occaecat", "Duis ea minim aliquip adipisicing"],
        type: "NONE",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the role.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.RoleServiceUpdateRoleBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.roles.<a href="/src/api/resources/roles/client/Client.ts">roleServiceListMembersByRole</a>(id, { ...params }) -> Skyflow.V1ListMembersResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists members that are assign the specified role.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.roles.roleServiceListMembersByRole("ID", {
    "filterOps.email": "filterOps.email",
    "filterOps.type": "NONE",
    "filterOps.name": "filterOps.name",
    "filterOps.status": "NONE",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: "offset",
    limit: "limit",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the resource. For example, if the resource is `roles`, this field is the role ID. If the resource is `workspaces`, this field is the workspace ID.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.RoleServiceListMembersByRoleRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Roles.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Policies

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceListPolicies</a>({ ...params }) -> Skyflow.V1ListPoliciesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists policies associated with a resource.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceListPolicies({
    "resource.ID": "resource.ID",
    "resource.type": "NONE",
    "resource.name": "resource.name",
    "resource.namespace": "resource.namespace",
    "resource.description": "resource.description",
    "resource.status": "NONE",
    "resource.displayName": "resource.displayName",
    "filterOps.name": "filterOps.name",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: "offset",
    limit: "limit",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.PolicyAuthoringServiceListPoliciesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceCreatePolicy</a>({ ...params }) -> Skyflow.V1CreatePolicyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a policy for the specified resource.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceCreatePolicy({
    name: "cupidatat velit",
    displayName: "proident Duis ad sint",
    description: "esse laborum minim occ",
    resource: {
        ID: "enim ut non adipisicing",
        type: "NONE",
        name: "dolor magna sint dolor",
        namespace: "velit commodo",
        description: "ullamco veniam laboris culpa",
        status: "NONE",
        displayName: "nostrud aute Duis",
    },
    ruleParams: [
        {
            name: "enim ",
            ID: "in magna irure commodo quis",
            ruleExpression: "exercitation dolor",
            columnRuleParams: {
                vaultID: "ea incididunt",
                columns: ["eu dolore id voluptate officia", "ex ullamco", "dolore pariatur"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "exercitation do ut",
                redaction: "exercitation anim",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            tableRuleParams: {
                vaultID: "eiusmod ",
                tableName: "elit",
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "est ut esse",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            columnGroupRuleParams: {
                vaultID: "sint cupidatat sit Duis",
                columnGroups: ["deserunt", "aliquip", "aliqua voluptate sit culpa Ut"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "minim anim ullamco commodo",
                redaction: "nostrud qui labore",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
        },
        {
            name: "occaecat",
            ID: "dolor",
            ruleExpression: "dolor nulla dolor quis proident",
            columnRuleParams: {
                vaultID: "anim nisi",
                columns: ["veniam sit adipisi", "minim", "enim"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "mollit nulla enim pariatur",
                redaction: "Excepteur magna",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            tableRuleParams: {
                vaultID: "",
                tableName: "in velit si",
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "eu labore in",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            columnGroupRuleParams: {
                vaultID: "commodo amet",
                columnGroups: ["magna ut Excepteur", "Excepteur aliquip", "com"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "proident incididunt ut ",
                redaction: "exercitation ut laborum et",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
        },
        {
            name: "aliqua",
            ID: "ipsum deserunt consequat",
            ruleExpression: "occaecat nostrud",
            columnRuleParams: {
                vaultID: "velit aute nostrud aliqua ut",
                columns: ["consequat commodo ipsum deserunt", "mollit esse", "anim nostrud dolore elit qui"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "aliqua fugiat veniam",
                redaction: "Duis reprehenderit id velit Lorem",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            tableRuleParams: {
                vaultID: "ipsum Duis",
                tableName: "mollit non dolore",
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "v",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            columnGroupRuleParams: {
                vaultID: "ut exercitation",
                columnGroups: ["incididunt Duis est", "id ipsum", "enim Excepteur"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "ipsum",
                redaction: "irure ex dolore in deserunt",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
        },
    ],
    activated: false,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1CreatePolicyRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceAssignPolicy</a>({ ...params }) -> Skyflow.V1AssignPolicyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Assigns a policy to one or more <a href='#Roles'>roles</a>.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceAssignPolicy({
    ID: "id ut elit irure",
    roleIDs: ["aute", "anim incididunt ut adipisicing", "culpa irure"],
    members: [
        {
            ID: "ullamco Duis est in",
            type: "NONE",
            name: "incididunt",
            email: "vol",
            status: "NONE",
        },
        {
            ID: "commodo aliquip",
            type: "NONE",
            name: "eu nostrud",
            email: "cupidatat Excepteur nisi do in",
            status: "NONE",
        },
        {
            ID: "dolor proident adipisicing ullamco",
            type: "NONE",
            name: "ullamco cupidatat Lore",
            email: "ea anim des",
            status: "NONE",
        },
    ],
    exceptions: [
        {
            ID: "ex dolore fugiat",
            type: "NONE",
            name: "vol",
            email: "id consequat",
            status: "NONE",
        },
        {
            ID: "do id eu",
            type: "NONE",
            name: "do ",
            email: "tempo",
            status: "NONE",
        },
        {
            ID: "Ut deserunt officia",
            type: "NONE",
            name: "eiusmod sunt ullamco dolore",
            email: "Duis esse Excepteur non dolore",
            status: "NONE",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1AssignPolicyRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceCreateRule</a>({ ...params }) -> Skyflow.V1CreateRuleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a rule in a policy.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceCreateRule({
    policyID: "enim",
    ruleParams: {
        name: "aute aliquip et",
        ID: "proident ut sed",
        ruleExpression: "nostrud velit reprehenderit",
        columnRuleParams: {
            vaultID: "amet ut aliqua sed occaecat",
            columns: ["laboris quis occaecat", "laborum", "consequat Ut voluptate nisi esse"],
            action: "NONE_ACTION",
            effect: "NONE_EFFECT",
            rowFilter: "aliqua consequat aliquip id",
            redaction: "Excepteur laboris aliqua",
            actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
        },
        tableRuleParams: {
            vaultID: "labore sed Ut mini",
            tableName: "eu fugiat",
            action: "NONE_ACTION",
            effect: "NONE_EFFECT",
            rowFilter: "dolore Duis deserunt officia",
            actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
        },
        columnGroupRuleParams: {
            vaultID: "ad ea",
            columnGroups: ["esse velit qui", "proident sit consectetur dolore pariatur", "in Ut adipisicing quis sed"],
            action: "NONE_ACTION",
            effect: "NONE_EFFECT",
            rowFilter: "nostrud sunt culpa sed",
            redaction: "ullamco",
            actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
        },
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1CreateRuleRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceGetRule</a>(id, { ...params }) -> Skyflow.V1GetRuleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified rule.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceGetRule("ID", {
    policyID: "policyID",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the rule.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.PolicyAuthoringServiceGetRuleRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceDeleteRule</a>(id, { ...params }) -> Skyflow.V1DeleteRuleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a rule from a policy.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceDeleteRule("ID", {
    policyID: "policyID",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the rule.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.PolicyAuthoringServiceDeleteRuleRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceUpdateRule</a>(id, { ...params }) -> Skyflow.V1UpdateRuleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update a rule.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceUpdateRule("ID", {
    policyID: "in consequat",
    ruleParams: {
        name: "",
        ID: "ea labore i",
        ruleExpression: "ullamco mollit est consectetur aliquip",
        columnRuleParams: {
            vaultID: "laboris p",
            columns: ["esse", "et Lorem", "do id"],
            action: "NONE_ACTION",
            effect: "NONE_EFFECT",
            rowFilter: "Lorem",
            redaction: "ullamco Excepteur incididunt",
            actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
        },
        tableRuleParams: {
            vaultID: "veli",
            tableName: "tempor commodo",
            action: "NONE_ACTION",
            effect: "NONE_EFFECT",
            rowFilter: "Ut in proident amet dolor",
            actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
        },
        columnGroupRuleParams: {
            vaultID: "sint",
            columnGroups: ["do", "nostrud occaecat", "irure in aute fugiat Lorem"],
            action: "NONE_ACTION",
            effect: "NONE_EFFECT",
            rowFilter: "irure voluptate",
            redaction: "Lorem incididunt",
            actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
        },
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the rule.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.PolicyAuthoringServiceUpdateRuleBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceUnassignPolicy</a>({ ...params }) -> Skyflow.V1UnassignPolicyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Unassigns a policy from one or more <a href='#Roles'>roles</a>.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceUnassignPolicy({
    ID: "labore est ut occaecat",
    roleIDs: ["aliquip quis", "sit", "aliquip non"],
    members: [
        {
            ID: "sint sed Lorem",
            type: "NONE",
            name: "in qui ex",
            email: "id tempor labore proident ea",
            status: "NONE",
        },
        {
            ID: "laboris nostrud laborum",
            type: "NONE",
            name: "laborum dolor officia deser",
            email: "aliquip aliqua magna",
            status: "NONE",
        },
        {
            ID: "reprehenderit do ",
            type: "NONE",
            name: "aliqua dolor ea al",
            email: "adipisicing",
            status: "NONE",
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1UnassignPolicyRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceGetPolicy</a>(id) -> Skyflow.V1GetPolicyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified policy.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceGetPolicy("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the policy.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceDeletePolicy</a>(id) -> Skyflow.V1DeletePolicyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified policy.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceDeletePolicy("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the policy.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceUpdatePolicy</a>(id, { ...params }) -> Skyflow.V1UpdatePolicyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified policy.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceUpdatePolicy("ID", {
    policy: {
        ID: "magna",
        name: "GA5aUSD3ixr",
        displayName: "consequat in adipisici",
        description: "dolore in",
        namespace: "sunt veniam magna ullamco incididunt",
        status: "NONE",
        BasicAudit: {
            CreatedBy: "non sit qui labore",
            LastModifiedBy: "in sed aliqua adipis",
            CreatedOn: "ut consequat sint mollit",
            LastModifiedOn: "eiusmod",
        },
        resource: {
            ID: "veniam",
            type: "NONE",
            name: "nulla",
            namespace: "enim magna",
            description: "labore irure ut nisi laboris",
            status: "NONE",
            displayName: "esse eu",
        },
        members: ["aliqua veniam", "dolore", "ea labore incididunt Excepteur"],
        rules: [
            {
                ID: "aute sunt ad min",
                name: "gaznxQfIJs",
                effect: "NONE_EFFECT",
                actions: ["non officia magna labore occaecat", "incididunt velit dolore", "magna eiusmod tempor amet"],
                resources: ["in", "consequat in co", "dese"],
                resourceType: "ACCOUNT",
                dlpFormat: "NONE_FORMAT",
                condition: "enim sit ut a",
                rowFilter: "deserunt ex aute",
                ruleExpression: "qui",
                redaction: "dolore nisi",
            },
            {
                ID: "Excepteur Duis enim laborum",
                name: "EguBWUd",
                effect: "NONE_EFFECT",
                actions: ["aliqua Excepteur", "cillum", "ullamco nisi"],
                resources: ["in ipsum", "c", "culpa anim amet eiusmod ut"],
                resourceType: "ACCOUNT",
                dlpFormat: "NONE_FORMAT",
                condition: "",
                rowFilter: "quis occaecat sit",
                ruleExpression: "cillum consectetur voluptate anim in",
                redaction: "dolore",
            },
            {
                ID: "sint et sit eu cupidatat",
                name: "eK4rIu",
                effect: "NONE_EFFECT",
                actions: ["nisi", "eli", "nulla Lorem in labore"],
                resources: ["dolore ex minim", "aliquip anim", "dolore Ut Lorem consectetur enim"],
                resourceType: "ACCOUNT",
                dlpFormat: "NONE_FORMAT",
                condition: "exercitation",
                rowFilter: "deserunt et",
                ruleExpression: "ipsum sed ea voluptate aute",
                redaction: "dolor sit",
            },
        ],
    },
    ruleParams: [
        {
            name: "et anim",
            ID: "dolore",
            ruleExpression: "amet sit consectetur ipsum laborum",
            columnRuleParams: {
                vaultID: "qui occaecat ad n",
                columns: ["in in qui", "cupidatat quis pariat", "sit"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "eiusmod nulla dolore id ea",
                redaction: "enim laboris officia",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            tableRuleParams: {
                vaultID: "amet est dolore Excepteur",
                tableName: "nisi dolore Ut",
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "nulla",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            columnGroupRuleParams: {
                vaultID: "anim",
                columnGroups: ["in et tempor amet", "consequat esse in", "dolor consequat"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "dolor Lorem esse tempor adipisicing",
                redaction: "labore",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
        },
        {
            name: "ex sed veniam in",
            ID: "ad voluptate laboris veniam id",
            ruleExpression: "magna qui labore incididunt Ut",
            columnRuleParams: {
                vaultID: "minim anim mollit fugiat",
                columns: ["Duis dolor officia", "Excepteur sed non ipsum", "Ut"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "nulla sint Excepteur",
                redaction: "aute",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            tableRuleParams: {
                vaultID: "et consequat Duis sit amet",
                tableName: "eu nisi in in Ut",
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "consequat tempor commodo dolor labore",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            columnGroupRuleParams: {
                vaultID: "Excepteur ea culpa",
                columnGroups: ["aliquip sunt", "incididunt", "Lorem cupidatat"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "mollit exercitation amet nisi pariat",
                redaction: "nostrud",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
        },
        {
            name: "commodo id enim",
            ID: "qui nisi",
            ruleExpression: "sint do tempor voluptate Duis",
            columnRuleParams: {
                vaultID: "est incididunt enim id",
                columns: ["ut pariatur ", "ut incididunt", "Lorem nisi"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "Duis moll",
                redaction: "eiu",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            tableRuleParams: {
                vaultID: "magna consequat",
                tableName: "culpa sint aliquip nisi magna",
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "ipsum reprehenderit occaecat magna c",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
            columnGroupRuleParams: {
                vaultID: "commodo",
                columnGroups: ["aute eiusmod", "nostrud ut aute commodo magna", "anim ex laboru"],
                action: "NONE_ACTION",
                effect: "NONE_EFFECT",
                rowFilter: "Lorem com",
                redaction: "nostrud dolore adipis",
                actions: ["NONE_ACTION", "NONE_ACTION", "NONE_ACTION"],
            },
        },
    ],
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the policy.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.PolicyAuthoringServiceUpdatePolicyBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceUpdateStatus</a>(id, { ...params }) -> Skyflow.V1UpdateStatusResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates a policy's status.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceUpdateStatus("ID", {
    status: "NONE",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the entity to update.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.V1PolicyAuthoringServiceUpdateStatusBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.policies.<a href="/src/api/resources/policies/client/Client.ts">policyAuthoringServiceListPoliciesByRole</a>(roleId, { ...params }) -> Skyflow.V1ListPoliciesByRoleResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists policies assigned to a role.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.policies.policyAuthoringServiceListPoliciesByRole("roleID", {
    "filterOps.name": "filterOps.name",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: "offset",
    limit: "limit",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**roleId:** `string` — ID of the role.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.PolicyAuthoringServiceListPoliciesByRoleRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Policies.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Service Accounts

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceListServiceAccounts</a>({ ...params }) -> Skyflow.V1ListServiceAccountsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists service accounts.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceListServiceAccounts({
    offset: "offset",
    limit: "limit",
    name: "name",
    status: "NONE",
    "resource.ID": "resource.ID",
    "resource.type": "NONE",
    "resource.name": "resource.name",
    "resource.namespace": "resource.namespace",
    "resource.description": "resource.description",
    "resource.status": "NONE",
    "resource.displayName": "resource.displayName",
    depth: "depth",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.ServiceAccountServiceListServiceAccountsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceCreateServiceAccount</a>({ ...params }) -> Skyflow.V1CreateServiceAccountResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a service account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceCreateServiceAccount({
    serviceAccount: {
        name: "Admin",
        description: "Admin service account",
    },
    resource: {},
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.CreateServiceAccountRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceGetServiceAccount</a>(id) -> Skyflow.V1GetServiceAccountResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified service account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceGetServiceAccount("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceDeleteServiceAccount</a>(id) -> Skyflow.V1DeleteServiceAccountResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified service account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceDeleteServiceAccount("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceUpdateServiceAccount</a>(id, { ...params }) -> Skyflow.V1UpdateServiceAccountResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified service account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceUpdateServiceAccount("b24e7ba813654628819586e4c0086ca5", {
    serviceAccount: {
        description: "Admin service account",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.UpdateServiceAccountRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceListApiKeys</a>(id) -> Skyflow.V1ListApiKeysResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists API keys for the specified service account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceListApiKeys("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceCreateApiKey</a>(id) -> Skyflow.V1ServiceAccountResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates an API key for the specified service account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceCreateApiKey("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceGetApiKey</a>(id, keyId) -> Skyflow.V1ApiKey</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified API key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceGetApiKey("ID", "keyID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**keyId:** `string` — ID of the API key.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceDeleteApiKey</a>(id, keyId) -> Skyflow.V1DeleteApiKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified API key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceDeleteApiKey("ID", "keyID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**keyId:** `string` — ID of the API key.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceRotateApiKey</a>(id, keyId) -> Skyflow.V1ServiceAccountResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Rotates the specified API key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceRotateApiKey("ID", "keyID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**keyId:** `string` — ID of the API key.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceListServiceAccountKeys</a>(id, { ...params }) -> Skyflow.V1ListServiceAccountKeysResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists keys for the specified service account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceListServiceAccountKeys("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.ServiceAccountServiceListServiceAccountKeysRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceCreateServiceAccountKey</a>(id) -> Skyflow.V1ServiceAccountResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a key for the specified service account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceCreateServiceAccountKey("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceRotateServiceAccountKey</a>(id, keyId) -> Skyflow.V1ServiceAccountResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Rotates the specified key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceRotateServiceAccountKey("ID", "KeyID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**keyId:** `string` — ID of the key linked with the service account.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceGetServiceAccountKey</a>(id, keyId, { ...params }) -> Skyflow.V1ServiceAccountKey</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceGetServiceAccountKey("ID", "keyID", {
    publicKeyType: "TYPE_NONE",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**keyId:** `string` — ID of the service account key.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.ServiceAccountServiceGetServiceAccountKeyRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceDeleteServiceAccountKey</a>(id, keyId) -> Skyflow.V1DeleteServiceAccountKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceDeleteServiceAccountKey("ID", "keyID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**keyId:** `string` — ID of the service account key.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceListSignedDataTokenKey</a>(id) -> Skyflow.V1ListSignedDataTokenKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns signed token keys for the specified service account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceListSignedDataTokenKey("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceCreateSignedDataTokenKey</a>(id) -> Skyflow.V1SignedDataTokenKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a signed token key for the specified service account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceCreateSignedDataTokenKey("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceRotateSignedDataTokenKey</a>(id, keyId) -> Skyflow.V1SignedDataTokenKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Rotates the specified signed token key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceRotateSignedDataTokenKey("ID", "KeyID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**keyId:** `string` — ID of the signed token key.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceGetSignedDataTokenKey</a>(id, keyId) -> Skyflow.V1SignedDataTokenKey</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified signed token key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceGetSignedDataTokenKey("ID", "keyID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**keyId:** `string` — ID of the signed token key.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.serviceAccounts.<a href="/src/api/resources/serviceAccounts/client/Client.ts">serviceAccountServiceDeleteSignedDataTokenKey</a>(id, keyId) -> Skyflow.V1DeleteSignedDataTokenKeyResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified signed token key.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.serviceAccounts.serviceAccountServiceDeleteSignedDataTokenKey("ID", "keyID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the service account.

</dd>
</dl>

<dl>
<dd>

**keyId:** `string` — ID of the signed token key.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `ServiceAccounts.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Users

<details><summary><code>client.users.<a href="/src/api/resources/users/client/Client.ts">userServiceListUsers</a>({ ...params }) -> Skyflow.V1ListUsersResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists users in the account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.users.userServiceListUsers({
    offset: "offset",
    limit: "limit",
    accountID: "accountID",
    "filterOps.email": "filterOps.email",
    "filterOps.status": "NONE",
    "filterOps.name": "filterOps.name",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.UserServiceListUsersRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Users.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.users.<a href="/src/api/resources/users/client/Client.ts">userServiceCreateUser</a>({ ...params }) -> Skyflow.V1CreateUserResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a user.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.users.userServiceCreateUser({
    user: {
        name: "Jan Doe",
        contactAddress: {
            streetAddress: "111 First Street",
            city: "Bloom",
            state: "Ohio",
            country: "United States",
            zip: 1,
        },
        userIdentity: {
            email: "jan@acme.com",
        },
    },
    accountID: "a451b783713e4424a7c762bb7bbc84eb",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1CreateUserRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Users.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.users.<a href="/src/api/resources/users/client/Client.ts">userServiceGetUser</a>(id) -> Skyflow.V1GetUserResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified user.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.users.userServiceGetUser("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the user.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Users.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.users.<a href="/src/api/resources/users/client/Client.ts">userServiceDeleteUser</a>(id) -> Skyflow.V1DeleteUserResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes a user.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.users.userServiceDeleteUser("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the user.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Users.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.users.<a href="/src/api/resources/users/client/Client.ts">userServiceUpdateUser</a>(id, { ...params }) -> Skyflow.V1UpdateUserResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified user.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.users.userServiceUpdateUser("ID", {
    user: {
        name: "Jan Doe",
        contactAddress: {
            streetAddress: "111 First Street",
            city: "Bloom",
            state: "Ohio",
            country: "United States",
            zip: 1,
        },
        userIdentity: {
            email: "jan@acme.com",
        },
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the user.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.UserServiceUpdateUserBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Users.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Vault Templates

<details><summary><code>client.vaultTemplates.<a href="/src/api/resources/vaultTemplates/client/Client.ts">vaultTemplateServiceListVaultTemplates</a>({ ...params }) -> Skyflow.V1ListVaultTemplatesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the vault templates available to an account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.vaultTemplates.vaultTemplateServiceListVaultTemplates({
    accountID: "accountID",
    "filterOps.name": "filterOps.name",
    "filterOps.status": "NONE",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: 1000000,
    limit: 1000000,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.VaultTemplateServiceListVaultTemplatesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `VaultTemplates.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.vaultTemplates.<a href="/src/api/resources/vaultTemplates/client/Client.ts">vaultTemplateServiceGetVaultTemplate</a>(id) -> Skyflow.V1GetVaultTemplateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified vault template.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.vaultTemplates.vaultTemplateServiceGetVaultTemplate("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the vault template.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `VaultTemplates.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Vaults

<details><summary><code>client.vaults.<a href="/src/api/resources/vaults/client/Client.ts">objectVaultServiceListObjectVaults</a>({ ...params }) -> Skyflow.V1ListObjectVaultsResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the vaults you can access in a workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.vaults.objectVaultServiceListObjectVaults({
    "filterOps.name": "filterOps.name",
    "filterOps.status": "NONE",
    "filterOps.type": "VAULT_TYPE_NONE",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: "offset",
    limit: "limit",
    workspaceID: "workspaceID",
    fetchMetadataOnly: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.ObjectVaultServiceListObjectVaultsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Vaults.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.vaults.<a href="/src/api/resources/vaults/client/Client.ts">objectVaultServiceCreateObjectVault</a>({ ...params }) -> Skyflow.V1CreateObjectVaultResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a vault.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.vaults.objectVaultServiceCreateObjectVault({
    name: "simpleVaultExample",
    description: "A vault with 1 table",
    vaultSchema: {
        schemas: [
            {
                name: "table_1",
                fields: [
                    {
                        name: "skyflow_id",
                        datatype: "DT_STRING",
                    },
                    {
                        name: "age",
                        datatype: "DT_INT32",
                    },
                    {
                        name: "ssn",
                        datatype: "DT_STRING",
                        tags: [
                            {
                                name: "skyflow.options.replace_pattern",
                                values: ["XXX${1}XX${2}${3}"],
                            },
                            {
                                name: "skyflow.options.format_preserving_regex",
                                values: ["^[0-9]{3}-[0-9]{2}-([0-9]{4})$"],
                            },
                            {
                                name: "skyflow.options.default_dlp_policy",
                                values: ["REDACT"],
                            },
                            {
                                name: "skyflow.options.operation",
                                values: ["EXACT_MATCH"],
                            },
                            {
                                name: "skyflow.options.find_pattern",
                                values: ["^[0-9]{3}([- ])?[0-9]{2}([- ])?([0-9]{4})$"],
                            },
                            {
                                name: "skyflow.options.default_token_policy",
                                values: ["FORMAT_PRESERVING_TOKEN"],
                            },
                            {
                                name: "skyflow.validation.regular_exp",
                                values: ["^$|^([0-9]{3}-?[0-9]{2}-?[0-9]{4})$"],
                            },
                        ],
                    },
                    {
                        name: "marital_status",
                        datatype: "DT_STRING",
                        tags: [
                            {
                                name: "skyflow.validation.predefinedvalues",
                                values: [
                                    "UNSPECIFIED_MARITAL_STATUS",
                                    "ANNULLED",
                                    "DIVORCED",
                                    "SEPARATED",
                                    "MARRIED",
                                    "UNMARRIED",
                                    "WIDOWED",
                                ],
                            },
                            {
                                name: "skyflow.options.default_token_policy",
                                values: ["RANDOM_TOKEN"],
                            },
                            {
                                name: "skyflow.options.default_dlp_policy",
                                values: ["REDACT"],
                            },
                            {
                                name: "skyflow.options.operation",
                                values: ["EXACT_MATCH"],
                            },
                        ],
                    },
                ],
                childrenSchemas: [{}],
            },
        ],
    },
    workspaceID: "z10198d5553411def9f2360c609gt3yx",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1CreateObjectVaultRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Vaults.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.vaults.<a href="/src/api/resources/vaults/client/Client.ts">objectVaultServiceGetObjectVault</a>(id, { ...params }) -> Skyflow.V1GetObjectVaultResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified vault.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.vaults.objectVaultServiceGetObjectVault("ID", {
    fetchMetadataOnly: true,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the vault.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.ObjectVaultServiceGetObjectVaultRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Vaults.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.vaults.<a href="/src/api/resources/vaults/client/Client.ts">objectVaultServiceDeleteObjectVault</a>(id) -> Skyflow.V1DeleteObjectVaultResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified vault and everything contained within it. This operation is asynchronous and returns an operation ID that you can use to track the deletion status with [Get Operation Status](/api/management/operations/operation-service-get-operation).

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.vaults.objectVaultServiceDeleteObjectVault("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the vault.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Vaults.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.vaults.<a href="/src/api/resources/vaults/client/Client.ts">objectVaultServiceUpdateObjectVault</a>(id, { ...params }) -> Skyflow.V1UpdateObjectVaultResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified vault.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.vaults.objectVaultServiceUpdateObjectVault("ID", {
    vaultSchema: {
        schemas: [
            {
                name: "table 1",
                fields: [
                    {
                        name: "skyflow_id",
                        datatype: "DT_STRING",
                    },
                    {
                        name: "age",
                        datatype: "DT_INT32",
                    },
                    {
                        name: "ssn",
                        datatype: "DT_STRING",
                        tags: [
                            {
                                name: "skyflow.options.replace_pattern",
                                values: ["XXX${1}XX${2}${3}"],
                            },
                            {
                                name: "skyflow.options.format_preserving_regex",
                                values: ["^[0-9]{3}-[0-9]{2}-([0-9]{4})$"],
                            },
                            {
                                name: "skyflow.options.default_dlp_policy",
                                values: ["REDACTED"],
                            },
                            {
                                name: "skyflow.options.operation",
                                values: ["EXACT_MATCH"],
                            },
                            {
                                name: "skyflow.options.find_pattern",
                                values: ["^[0-9]{3}([- ])?[0-9]{2}([- ])?([0-9]{4})$"],
                            },
                            {
                                name: "skyflow.options.default_token_policy",
                                values: ["FORMAT_PRESERVING_TOKEN"],
                            },
                            {
                                name: "skyflow.validation.regular_exp",
                                values: ["^$|^([0-9]{3}-?[0-9]{2}-?[0-9]{4})$"],
                            },
                        ],
                    },
                    {
                        name: "marital_status",
                        datatype: "DT_STRING",
                        tags: [
                            {
                                name: "skyflow.validation.predefinedvalues",
                                values: [
                                    "UNSPECIFIED_MARITAL_STATUS",
                                    "ANNULLED",
                                    "DIVORCED",
                                    "SEPARATED",
                                    "MARRIED",
                                    "UNMARRIED",
                                    "WIDOWED",
                                ],
                            },
                            {
                                name: "skyflow.options.default_token_policy",
                                values: ["RANDOM_TOKEN"],
                            },
                            {
                                name: "skyflow.options.default_dlp_policy",
                                values: ["REDACT"],
                            },
                            {
                                name: "skyflow.options.operation",
                                values: ["EXACT_MATCH"],
                            },
                        ],
                    },
                    {
                        name: "annual_income",
                        datatype: "DT_FLOAT32",
                    },
                ],
                childrenSchemas: [{}],
            },
        ],
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the vault.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.ObjectVaultServiceUpdateObjectVaultBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Vaults.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.vaults.<a href="/src/api/resources/vaults/client/Client.ts">objectVaultServiceListObjectVaultVersion</a>(vaultId) -> Skyflow.V1ListObjectVaultVersionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns a list of schema versions for the specified vault.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.vaults.objectVaultServiceListObjectVaultVersion("vaultID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**vaultId:** `string` — ID of the vault.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Vaults.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.vaults.<a href="/src/api/resources/vaults/client/Client.ts">objectVaultServiceGetObjectVaultVersion</a>(vaultId, versionTag) -> Skyflow.V1GetObjectVaultVersionResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified vault schema version.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.vaults.objectVaultServiceGetObjectVaultVersion("vaultID", "versionTag");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**vaultId:** `string` — ID of the vault.

</dd>
</dl>

<dl>
<dd>

**versionTag:** `string` — Unique tag of the vault schema version.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Vaults.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Workspaces

<details><summary><code>client.workspaces.<a href="/src/api/resources/workspaces/client/Client.ts">workspaceServiceListWorkspaces</a>({ ...params }) -> Skyflow.V1ListWorkspacesResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists the workspaces in an account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspaces.workspaceServiceListWorkspaces({
    accountID: "accountID",
    name: "name",
    status: "NONE",
    offset: "offset",
    limit: "limit",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.WorkspaceServiceListWorkspacesRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Workspaces.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workspaces.<a href="/src/api/resources/workspaces/client/Client.ts">workspaceServiceCreateWorkspace</a>({ ...params }) -> Skyflow.V1CreateWorkspaceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a workspace for an account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspaces.workspaceServiceCreateWorkspace({
    workspace: {
        name: "LeU",
        displayName: "fugiat",
        description: "ipsum",
        ID: "cillum",
        namespace: "ipsum",
        contactAddress: {
            streetAddress: "in",
            city: "do incididu",
            state: "nisi Duis consectetur laboris",
            country: "ut labore",
            zip: -62226079,
        },
        status: "NONE",
        BasicAudit: {
            CreatedBy: "dolor",
            LastModifiedBy: "incididunt exercitation",
            CreatedOn: "laborum exercitation dolor anim",
            LastModifiedOn: "qui Excepteur",
        },
        type: "NONE_TYPE",
        url: "occaecat tempor dolor",
        limits: {
            vaultCountLimit: "1234567890123456789",
            vaultSizeLimit: "1234567890123456789",
            vaultOwnerLimit: "1234567890123456789",
            permissionRestrictions: [
                {
                    roleName: "ad",
                    permissions: ["aliqua", "ullamco veniam pariatur", "exercitation"],
                },
                {
                    roleName: "do consectetur aute ea pariatur",
                    permissions: ["sed deserunt sun", "ullamco ipsum veniam", "ve"],
                },
                {
                    roleName: "exercitation laborum",
                    permissions: ["dolor ea consequat do", "sed eu ad amet", "aute "],
                },
            ],
            enableExternalSharing: true,
        },
        regionID: "pariatur ea exer",
    },
    accountID: "ex ea quis proident fugiat",
    regionID: "incididunt est commodo",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1CreateWorkspaceRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Workspaces.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workspaces.<a href="/src/api/resources/workspaces/client/Client.ts">workspaceServiceGetWorkspace</a>(id) -> Skyflow.V1GetWorkspaceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspaces.workspaceServiceGetWorkspace("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the workspace.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Workspaces.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workspaces.<a href="/src/api/resources/workspaces/client/Client.ts">workspaceServiceDeleteWorkspace</a>(id) -> Skyflow.V1DeleteWorkspaceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified Workspace and the entities it contains.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspaces.workspaceServiceDeleteWorkspace("ID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the workspace.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Workspaces.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workspaces.<a href="/src/api/resources/workspaces/client/Client.ts">workspaceServiceUpdateWorkspace</a>(id, { ...params }) -> Skyflow.V1UpdateWorkspaceResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified Workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspaces.workspaceServiceUpdateWorkspace("ID", {
    workspace: {
        name: "AZ6oth9",
        displayName: "veniam",
        description: "ea culpa eu enim magna",
        ID: "tempor deser",
        namespace: "mollit amet ad",
        contactAddress: {
            streetAddress: "anim",
            city: "veniam",
            state: "consectetur",
            country: "minim velit eu esse",
            zip: 29611615,
        },
        status: "NONE",
        BasicAudit: {
            CreatedBy: "aute anim",
            LastModifiedBy: "in ut ex",
            CreatedOn: "Duis enim culpa fugiat ",
            LastModifiedOn: "",
        },
        type: "NONE_TYPE",
        url: "non qui ea c",
        limits: {
            vaultCountLimit: "1234567890123456789",
            vaultSizeLimit: "1234567890123456789",
            vaultOwnerLimit: "1234567890123456789",
            permissionRestrictions: [
                {
                    roleName: "",
                    permissions: ["consequat sint velit", "labore ut ", "tempor Ut"],
                },
                {
                    roleName: "commodo pariatur aliqua",
                    permissions: ["eu", "in consectetur do ipsum", ""],
                },
                {
                    roleName: "eu",
                    permissions: [
                        "qui exercitation cupidatat ad nostrud",
                        "eu do aliqua sed",
                        "do sint adipisicing offic",
                    ],
                },
            ],
            enableExternalSharing: true,
        },
        regionID: "magna Lorem sint ipsum culp",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the workspace.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.WorkspaceServiceUpdateWorkspaceBody`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Workspaces.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.workspaces.<a href="/src/api/resources/workspaces/client/Client.ts">workspaceServiceListMembers</a>(id, { ...params }) -> Skyflow.V1ListMembersResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists members for the specified workspace.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.workspaces.workspaceServiceListMembers("ID", {
    "filterOps.email": "filterOps.email",
    "filterOps.type": "NONE",
    "filterOps.name": "filterOps.name",
    "filterOps.status": "NONE",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: "offset",
    limit: "limit",
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**id:** `string` — ID of the resource. For example, if the resource is `roles`, this field is the role ID. If the resource is `workspaces`, this field is the workspace ID.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.WorkspaceServiceListMembersRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Workspaces.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Webhooks

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">webhookServiceListWebhooks</a>({ ...params }) -> Skyflow.V1ListWebhooksResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Lists webhooks that match the specified filter criteria.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.webhooks.webhookServiceListWebhooks({
    "filterOps.name": "filterOps.name",
    "filterOps.URL": "filterOps.URL",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: 1,
    limit: 1,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.WebhookServiceListWebhooksRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Webhooks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">webhookServiceCreateWebhook</a>({ ...params }) -> Skyflow.V1CreateWebhookResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new webhook to receive event notifications from Skyflow.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.webhooks.webhookServiceCreateWebhook();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.V1CreateWebhookRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Webhooks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">webhookServiceGetWebhook</a>(webhookId) -> Skyflow.V1GetWebhookResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Returns the specified webhook.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.webhooks.webhookServiceGetWebhook("webhookID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**webhookId:** `string` — Unique ID of the webhook.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Webhooks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">webhookServiceDeleteWebhook</a>(webhookId) -> Skyflow.V1DeleteWebhookResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified webhook.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.webhooks.webhookServiceDeleteWebhook("webhookID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**webhookId:** `string` — Unique ID of the webhook.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Webhooks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.webhooks.<a href="/src/api/resources/webhooks/client/Client.ts">webhookServiceUpdateWebhook</a>(webhookId, { ...params }) -> Skyflow.V1UpdateWebhookResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified webhook.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.webhooks.webhookServiceUpdateWebhook("webhookID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**webhookId:** `string` — Unique ID of the webhook.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.V1UpdateWebhookRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Webhooks.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Triggers

<details><summary><code>client.triggers.<a href="/src/api/resources/triggers/client/Client.ts">listTriggers</a>({ ...params }) -> Skyflow.ListTriggersResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves a list of [triggers](/docs/processing/triggers/overview).

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.triggers.listTriggers({
    "filterOps.name": "filterOps.name",
    "sortOps.sortBy": "sortOps.sortBy",
    "sortOps.orderBy": "ASCENDING",
    offset: 1,
    limit: 1,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.ListTriggersRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Triggers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.triggers.<a href="/src/api/resources/triggers/client/Client.ts">createTrigger</a>({ ...params }) -> Skyflow.CreateTriggerResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Creates a new [trigger](/docs/processing/triggers/overview) to automate actions based on input events.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.triggers.createTrigger();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Skyflow.CreateTriggerRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Triggers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.triggers.<a href="/src/api/resources/triggers/client/Client.ts">getTrigger</a>(triggerId) -> Skyflow.GetTriggerResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieves the specified [trigger](/docs/processing/triggers/overview).

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.triggers.getTrigger("triggerID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**triggerId:** `string` — ID of the trigger.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Triggers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.triggers.<a href="/src/api/resources/triggers/client/Client.ts">deleteTrigger</a>(triggerId) -> Skyflow.DeleteTriggerResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Deletes the specified [trigger](/docs/processing/triggers/overview).

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.triggers.deleteTrigger("triggerID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**triggerId:** `string` — ID of the trigger.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Triggers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.triggers.<a href="/src/api/resources/triggers/client/Client.ts">updateTrigger</a>(triggerId, { ...params }) -> Skyflow.UpdateTriggerResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Updates the specified [trigger](/docs/processing/triggers/overview). Only properties included in the request are updated.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.triggers.updateTrigger("triggerID");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**triggerId:** `string` — ID of the trigger.

</dd>
</dl>

<dl>
<dd>

**request:** `Skyflow.UpdateTriggerRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Triggers.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
