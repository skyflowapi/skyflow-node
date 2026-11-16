import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  UploadFilesRequest,
  Credentials,
} from 'skyflow-flowvault-node';

/** Upload files into file columns. */
async function performUploadFiles(): Promise<void> {
  try {
    const credentials: Credentials = {
      path: '<PATH_TO_YOUR_CREDENTIALS_JSON>',
    };

    const skyflowClient = new Skyflow({
      vaultConfigs: [
        {
          vaultId: '<YOUR_VAULT_ID>',
          clusterId: '<YOUR_CLUSTER_ID>',
          env: Env.PROD,
          credentials,
        },
      ],
      logLevel: LogLevel.ERROR,
    });

    // Each column takes exactly ONE source: filePath / base64 (needs fileName) /
    // file (a Node File object, v20+). Omit skyflowId to CREATE a new record; set
    // it to upload into an EXISTING record.
    const uploadFilesRequest = new UploadFilesRequest([
      {
        tableName: '<SENSITIVE_DATA_TABLE>',
        // skyflowId: '<SKYFLOW_ID>',
        columns: [
          { column: '<FILE_COLUMN>', filePath: '<PATH_TO_FILE>' },
          // { column: '<FILE_COLUMN>', base64: '<BASE64_CONTENT>', fileName: 'doc.pdf' },
        ],
      },
    ]);

    const response = await skyflowClient
      .vault('<YOUR_VAULT_ID>')
      .uploadFiles(uploadFilesRequest);

    // response.records: one UploadFilesResponseRecord per input record, in order.
    // Each has skyflowId, tableName, columns, httpCode, error, requestId. Each
    // column result has column, fileName, uploadStatus ("UPLOADED"/"FAILED"/"SKIPPED"), error.
    console.log('Records:', JSON.stringify(response.records, null, 2));
  } catch (error) {
    if (error instanceof SkyflowError) {
      console.error('Skyflow Error:', {
        code: error.error?.httpCode,
        message: error.message,
        details: error.error?.details,
      });
    } else {
      console.error('Unexpected Error:', error);
    }
  }
}

performUploadFiles();
