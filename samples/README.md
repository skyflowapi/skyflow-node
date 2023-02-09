# Node.js SDK samples
Test the SDK by adding `VAULT-ID`, `VAULT-URL`, and `SERVICE-ACCOUNT` details in the required places for each sample.

## Prerequisites
- A Skylow account. If you don't have one, register for one on the [Try Skyflow](https://skyflow.com/try-skyflow) page.
- [Node 7.6.0](https://nodejs.org/en/) and above.

## Prepare
- Install the Node SDK:

       npm install skyflow-node

### Create the vault
1. In a browser, navigate to Skyflow Studio.
2. Create a vault by clicking **Create Vault** > **Start With a Template** > **Quickstart vault**.
3. Once the vault is created, click the gear icon and select **Edit Vault Details**.
4. Note your **Vault URL** and **Vault ID** values, then click **Cancel**. You'll need these later.

### Create a service account
1. In the side navigation click, **IAM** > **Service Accounts** > **New Service Account**.
2. For **Name**, enter "SDK Samples". For **Roles**, choose **Vault Editor**.
3. Click **Create**. Your browser downloads a **credentials.json** file. Keep this file secure. You'll need it for each of the samples.

## The samples
### Detokenize
Detokenize a data token from the vault. Make sure the specified token is for data that exists in the vault. If you need a valid token, use [Insert.ts](Insert.ts) to insert the data, then use this data's token for detokenization.
#### Configure
1. Replace **<VAULT_ID>** with **VAULT ID**
2. Replace **<VAULT_URL>** with **VAULT URL**.
3. Replace **<FIELD_NAME>** with **COLUMN NAME**.
4. Replace **<TOKEN1>** with **Data Token 1**.
5. Replace **<TOKEN2>** with **Data Token 2**.
6. Replace **<TOKEN3>** with **Data Token 3**.
7. Replace **<TOKEN4>** with **Data Token 4**.
8. Replace **<YOUR_CREDENTIAL_FILE>** with relative  path of **SERVICE ACCOUNT CREDENTIAL FILE**.

#### Run the sample
            
        ts-node Detokenize.ts

### GetById
Get data using skyflow id. 
#### Configure
1. Replace **<VAULT_ID>** with **VAULT ID**
2. Replace **<VAULT_URL>** with **VAULT URL**.
3. Replace **<ID1>** with **Skyflow Id 1**.
4. Replace **<ID2>** with **Skyflow Id 2**.
5. Replace **<ID3>** with **Skyflow Id 3**.
6. Replace **<YOUR_CREDENTIAL_FILE>** with relative  path of **SERVICE ACCOUNT CREDENTIAL FILE**.
7. Replace **<TABLE_NAME>** with **credit_cards**.
#### Run the sample
    
        ts-node GetById.ts
### Insert
Insert data in the vault.
#### Configure
1. Replace **<VAULT_ID>** with **VAULT ID**.
2. Replace **<VAULT_URL>** with **VAULT URL**.
3. Replace **<YOUR_CREDENTIAL_FILE>** with relative  path of **SERVICE ACCOUNT CREDENTIAL FILE**.
4. Replace **<TABLE_NAME>** with **credit_cards**.
5. Replace **<FIELD_NAME>** with **column name**.
6. Replace **<VALUE>** with **valid value corresponding to column name**.
#### Run the sample
        
        ts-node Insert.ts
### InvokeConnection
Skyflow Connections is a gateway service that uses Skyflow's underlying tokenization capabilities to securely connect to first-party and third-party services. This way, your infrastructure is never directly exposed to sensitive data, and you offload security and compliance requirements to Skyflow.
#### Configure
1. Replace **<VAULT_ID>** with **VAULT ID**.
2. Replace **<VAULT_URL>** with **VAULT URL**.
3. Replace **<YOUR_CREDENTIAL_FILE>** with relative  path of **SERVICE ACCOUNT CREDENTIAL FILE**.
4. Replace **<CONNECTION_URL>** with **Connection url**.
5. Give **Authorization** value as the tokens.
6. Replace value of **requestBody** with your's request body content.

#### Run the sample
    
        ts-node InvokeConnection.ts
### Service account token generation
Generates a service account Bearer token using the file path of credentials.json.
#### Configure
1. Replace **<YOUR_CREDENTIAL_FILE_PATH>** with relative  path of **SERVICE ACCOUNT CREDENTIAL FILE**.

#### Run the sample
        
        ts-node TokenGenerationExample.ts

### Generate Bearer Token From Credentails
Generates a service account bearer token using the JSON content of a credentials file.
#### Configure
1. Replace **credentials*** with json data of downloaded credentials file while creation Service account.

#### Run the sample
    
        ts-node TokenGenerationUsingCredContent.ts