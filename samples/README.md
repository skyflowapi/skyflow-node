# NODE-SDK sample templates
Use this folder to test the functionalities of NODE-SDK just by adding `VAULT-ID` `VAULT-URL` and `SERVICE-ACCOUNT` details at the required place.

## Prerequisites
- A Skylow account. If you don't have one, you can register for one on the [Try Skyflow](https://skyflow.com/try-skyflow) page.
- Node 7.6.0 and above.

## Configure
- Before you can run the sample app, create a vault
- The package can be installed using npm:

        npm install skyflow-node

### Create the vault
1. In a browser, navigate to Skyflow Studio and log in.
2. Create a vault by clicking **Create Vault** > **Start With a Template** > **Quickstart vault**.
3. Once the vault is created, click the gear icon and select **Edit Vault** Details.
4. Note your Vault URL and Vault ID values, then click Cancel. You'll need these later.

### Create a service account
1. In the side navigation click, **IAM** > **Service Accounts** > **New Service Account**.
2. For Name, enter **Test-Node-Sdk-Sample**. For Roles, choose Roles corresponding to the action.
3. Click **Create**. Your browser downloads a **credentials.json** file. Keep this file secure, as you'll need it in the next steps.

### Different types of functionalities of Node-Sdk
- [**Detokenize**](vault-api/Detokenize.ts)
    - Detokenize the data token from the vault. 
    - Make sure the token is of the data which exists in the Vault. If not so please make use of [insert_sample.py](insert_sample.py) to insert the data in the data and use this token for detokenization.
    - Configure
        - Replace **<VAULT_ID>** with **VAULT ID**
        - Replace **<VAULT_URL>** with **VAULT URL**.
        - Replace **<FIELD_NAME>** with **COLUMN NAME**.
        - Replace **<TOKEN1>** with **Data Token 1**.
        - Replace **<TOKEN2>** with **Data Token 2**.
        - Replace **<TOKEN3>** with **Data Token 3**.
        - Replace **<TOKEN4>** with **Data Token 4**.
        - Replace **<YOUR_CREDENTIAL_FILE>** with relative  path of **SERVICE ACCOUNT CREDENTIAL FILE**.
    - Execution
            
            ts-node Detokenize.ts
- [**GetById**](vault-api/GetById.ts)
    - Get data using skyflow id. 
    - Configure
        - Replace **<VAULT_ID>** with **VAULT ID**
        - Replace **<VAULT_URL>** with **VAULT URL**.
        - Replace **<ID1>** with **Skyflow Id 1**.
        - Replace **<ID2>** with **Skyflow Id 2**.
        - Replace **<ID3>** with **Skyflow Id 3**.
        - Replace **<YOUR_CREDENTIAL_FILE>** with relative  path of **SERVICE ACCOUNT CREDENTIAL FILE**.
        - Replace **<TABLE_NAME>** with **credit_cards**.
    - Execution
        
            ts-node GetById.ts
- [**Insert**](vault-api/Insert.ts)
    - Insert data in the vault.
    - Configure
        - Replace **<VAULT_ID>** with **VAULT ID**.
        - Replace **<VAULT_URL>** with **VAULT URL**.
        - Replace **<YOUR_CREDENTIAL_FILE>** with relative  path of **SERVICE ACCOUNT CREDENTIAL FILE**.
        - Replace **<TABLE_NAME>** with **credit_cards**.
        - Replace **<FIELD_NAME>** with **column name**.
        - Replace **<VALUE>** with **valid value corresponding to column name**.
        - Execution
                
                ts-node Insert.ts
- [**InvokeConnection**](vault-api/InvokeConnection.ts)
    - Invoke connection
    - Configure
        - Replace **<VAULT_ID>** with **VAULT ID**.
        - Replace **<VAULT_URL>** with **VAULT URL**.
        - Replace **<YOUR_CREDENTIAL_FILE>** with relative  path of **SERVICE ACCOUNT CREDENTIAL FILE**.
        - Replace **<CONNECTION_URL>** with **Connection url**.
        - Give **Authorization** value as the tokens.
        - Replace value of **requestBody** with your's request body content.

        - Execution
            
                ts-node InvokeConnection.ts
- [**Service account token generation**](service-account/TokenGenerationExample.ts)
    - generates SA Token using path of credentials file.
    - Configure
        - Replace **<YOUR_CREDNTIALS_FILE_PATH>** with relative  path of **SERVICE ACCOUNT CREDENTIAL FILE**.

        - Execution
                
                ts-node TokenGenerationExample.ts

- [**Generate Bearer Token From Credentails**](service-account/TokenGenerationUsingCredContent.ts)
    - generates SA Token using json content of credentials file.
    - Configure
        - Replace **credentials*** with json data of downloaded credentials file while creation Service account.

        - Execution
            
                ts-node TokenGenerationUsingCredContent.ts