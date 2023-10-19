/*
  Copyright (c) 2022 Skyflow, Inc. 
*/
import Client from '../client';
import SkyflowError from '../libs/SkyflowError';
import {
  ISkyflowIdRecord, IRevealRecord, IRevealResponseType, IUpdateRecord, IUpdateOptions,RedactionType, IGetOptions
} from '../utils/common';
import 'core-js/modules/es.promise.all-settled';
interface IApiSuccessResponse {
  records: [
    {
      token: string;
      valueType: string;
      value: string;
    },
  ];
}

interface IUpdateApiResponse{
  skyflow_id: string;
  tokens: Record<string,any>
}

const formatForPureJsSuccess = (response: IApiSuccessResponse) => {
  const currentResponseRecords = response.records;
  return currentResponseRecords.map((record) => ({ token: record.token, value: record.value }));
};

const formatForPureJsFailure = (cause, tokenId: string) => ({
  token: tokenId,
  ...new SkyflowError({
    code: cause?.error?.code,
    description: cause?.error?.description,
  }, [], true),
});

const formatUpdateSuccessResponse = (response:IUpdateApiResponse)=>{
  return {
    id: response.skyflow_id,
    ...(response?.tokens?{fields:{...response.tokens}}:{}),
  }
};

const formatUpdateFailureResponse = (cause,id:string)=>{
  return {
    id: id,
    ...new SkyflowError({
      code : cause?.error?.code,
      description: cause?.error?.description,
    },[],true)
  }
}

const getSkyflowIdRecordsFromVault = (
  skyflowIdRecord: ISkyflowIdRecord,
  client: Client,
  authToken: string,
  options?: IGetOptions
) => {
  let paramList: string = '';


  skyflowIdRecord.ids?.forEach((skyflowId) => {
    paramList += `skyflow_ids=${skyflowId}&`;
  });

  if(options && Object.prototype.hasOwnProperty.call(options, 'encodeURI') && options?.encodeURI === true) {
    skyflowIdRecord.columnValues?.forEach((column) => {
      var encode_column_value = encodeURIComponent(column)
      paramList += `column_name=${skyflowIdRecord.columnName}&column_values=${encode_column_value}&`;
    });
  } else {
    skyflowIdRecord.columnValues?.forEach((column) => {
      paramList += `column_name=${skyflowIdRecord.columnName}&column_values=${column}&`;
    });
  }

  if(options && Object.prototype.hasOwnProperty.call(options,'tokens')){
    paramList += `tokenization=${options.tokens}&`
  }
 
  if(skyflowIdRecord?.redaction){
    paramList += `redaction=${skyflowIdRecord.redaction}`
  }
  
  const vaultEndPointurl: string = `${client.config.vaultURL}/v1/vaults/${client.config.vaultID}/${skyflowIdRecord.table}?${paramList}`;

  return client.request({
    requestMethod: 'GET',
    url: vaultEndPointurl,
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  });
};

const getTokenRecordsFromVault = (
  tokenRecord: IRevealRecord,
  client: Client,
  authToken: string,
): Promise<any> => {
  const vaultEndPointurl: string = `${client.config.vaultURL}/v1/vaults/${client.config.vaultID}/detokenize`;
  return client.request({
    requestMethod: 'POST',
    url: vaultEndPointurl,
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body:
    {
      detokenizationParameters: [
        {
          token : tokenRecord.token,
          redaction: (tokenRecord?.redaction ? tokenRecord.redaction : RedactionType.PLAIN_TEXT)
        },
      ],
    },
  });
};

export const fetchRecordsByTokenId = (
  tokenIdRecords: IRevealRecord[],
  client: Client,
  authToken: String
): Promise<IRevealResponseType> => new Promise((rootResolve, rootReject) => {
  const vaultResponseSet: Promise<any>[] = tokenIdRecords.map(
    (tokenRecord) => new Promise((resolve) => {
      const apiResponse: any = [];
      getTokenRecordsFromVault(tokenRecord, client, authToken as string)
        .then(
          (response: IApiSuccessResponse) => {
            const fieldsData = formatForPureJsSuccess(response);
            apiResponse.push(...fieldsData);
          },
          (cause: any) => {
            const errorData = formatForPureJsFailure(cause, tokenRecord.token);
            apiResponse.push(errorData);
          },
        )
        .finally(() => {
          resolve(apiResponse);
        });
    }),
  );

  Promise.allSettled(vaultResponseSet).then((resultSet) => {
    const recordsResponse: Record<string, any>[] = [];
    const errorResponse: Record<string, any>[] = [];
    resultSet.forEach((result) => {
      if (result.status === 'fulfilled') {
        result.value.forEach((res: Record<string, any>) => {
          if (Object.prototype.hasOwnProperty.call(res, 'error')) {
            errorResponse.push(res);
          } else {
            recordsResponse.push(res);
          }
        });
      }
    });
    if (errorResponse.length === 0) {
      rootResolve({ records: recordsResponse });
    } else if (recordsResponse.length === 0) rootReject({ errors: errorResponse });
    else rootReject({ records: recordsResponse, errors: errorResponse });
  });
});




/** SKYFLOW ID  */
export const fetchRecordsBySkyflowID = async (
  skyflowIdRecords: ISkyflowIdRecord[],
  client: Client,
  authToken: string,
  options?: IGetOptions
) => new Promise((rootResolve, rootReject) => {
  let vaultResponseSet: Promise<any>[];
  vaultResponseSet = skyflowIdRecords.map(
    (skyflowIdRecord) => new Promise((resolve, reject) => {
      getSkyflowIdRecordsFromVault(skyflowIdRecord, client, authToken as string,options)
        .then(
          (resolvedResult: any) => {
            const response: any[] = [];
            const recordsData: any[] = resolvedResult.records;
            recordsData.forEach((fieldData) => {
              const id = fieldData.fields.skyflow_id;
              const currentRecord = {
                fields: {
                  id,
                  ...fieldData.fields,
                },
                table: skyflowIdRecord.table,
              };
              delete currentRecord.fields.skyflow_id;
              response.push(currentRecord);
            });
            resolve(response);
          },
          (rejectedResult) => {
            let errorResponse = rejectedResult;
            if (rejectedResult && rejectedResult.error) {
              errorResponse = {
                error: {
                  code: rejectedResult?.error?.code,
                  description: rejectedResult?.error?.description,
                },
                ids: skyflowIdRecord.ids,
                ...(skyflowIdRecord?.columnName?{columnName:skyflowIdRecord?.columnName}:{})
              };
            }
            reject(errorResponse);
          },
        )
        .catch((error) => {
          reject(error);
        });
    }),
  );
  Promise.allSettled(vaultResponseSet).then((resultSet) => {
    const recordsResponse: any[] = [];
    const errorsResponse: any[] = [];
    resultSet.forEach((result) => {
      if (result.status === 'fulfilled') {
        recordsResponse.push(...result.value);
      } else {
        errorsResponse.push(result.reason);
      }
    });
    if (errorsResponse.length === 0) {
      rootResolve({ records: recordsResponse });
    } else if (recordsResponse.length === 0) rootReject({ errors: errorsResponse });
    else rootReject({ records: recordsResponse, errors: errorsResponse });
  });
});


const updateRecordInVault = (
  updateRecord: IUpdateRecord,
  options:IUpdateOptions,
  client: Client,
  authToken:string,
): Promise<any> => {
  const vaultEndPointURL: string = `${client.config.vaultURL}/v1/vaults/${client.config.vaultID}/${updateRecord.table}/${updateRecord.id}`;
  return client.request({
    requestMethod: 'PUT',
    url: vaultEndPointURL,
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body:
      {
        record:{
          fields:{ ...updateRecord.fields }
        },
        tokenization: options.tokens
      },
  });
};


/** Update By Skyflow ID */
export const updateRecordsBySkyflowID = (
  updateRecords: IUpdateRecord[],
  options,
  client: Client,
  authToken: String,
)=>{
  return new Promise((rootResolve,rootReject)=>{
    const vaultResponseSet: Promise<any>[] = updateRecords.map(
      (updateRecord) => new Promise((resolve) => {
        const updateResponse: any = [];
        updateRecordInVault(updateRecord, options, client, authToken as string)
          .then(
            (response: any) => {
              updateResponse.push(formatUpdateSuccessResponse(response));
            },
            (cause: any) => {
              updateResponse.push(formatUpdateFailureResponse(cause,updateRecord.id));
            },
          )
          .finally(() => {
            resolve(updateResponse);
          });
      }),
    );

    Promise.allSettled(vaultResponseSet).then((resultSet) => {
      const recordsResponse: Record<string, any>[] = [];
      const errorResponse: Record<string, any>[] = [];
      resultSet.forEach((result) => {
        if (result.status === 'fulfilled') {
          result.value.forEach((res: Record<string, any>) => {
            if (Object.prototype.hasOwnProperty.call(res, 'error')) {
              errorResponse.push(res);
            } else {
              recordsResponse.push(res);
            }
          });
        }
      });
      if (errorResponse.length === 0) {
        rootResolve({ records: recordsResponse });
      } else if (recordsResponse.length === 0) rootReject({ errors: errorResponse });
      else rootReject({ records: recordsResponse, errors: errorResponse });
    });
  });
}