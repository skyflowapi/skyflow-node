/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import _ from 'lodash';
import { IInsertRecordInput, IInsertRecord, IInsertOptions } from '../utils/common';

const getUpsertColumn = (tableName: string, options: Record<string, any>) => {
  let uniqueColumn = '';
  options?.upsert?.forEach((upsertOptions) => {
    if (tableName === upsertOptions.table) {
      uniqueColumn = upsertOptions.column;
    }
  });
  return uniqueColumn;
};
export const constructInsertRecordRequest = (
  records: IInsertRecordInput,
  options: Record<string, any> = { tokens: true },
) => {
  let requestBody: any = [];
    records.records.forEach((record, index) => {
      const upsertColumn = getUpsertColumn(record.table, options);
      requestBody.push({
        method: 'POST',
        quorum: true,
        tableName: record.table,
        fields: record.fields,
        ...(options?.upsert ? { upsert: upsertColumn } : {}),
        ...(options?.tokens ? { tokenization: true } : {}),
      });
    });
  requestBody = { records: requestBody, continueOnError: options.continueOnError }
  return requestBody;
};

export const constructInsertRecordResponse = (
  responseBody: any,
  options: IInsertOptions,
  records: IInsertRecord[],
) => {
  if (options.continueOnError) {
    const successObjects: any = [];
    const failureObjects: any= [];
    responseBody.data.responses
    .forEach((response, index) => {
      const status = response['Status']
      const body = response['Body']
      if ('records' in body) {
        const record = body['records'][0]
        if (options.tokens) {
          successObjects.push({
            table: records[index].table,
            fields: {
              skyflow_id: record.skyflow_id,
              ...record.tokens,
            },
            request_index: index,
          })
        } else {
          successObjects.push({
            table: records[index].table,
            skyflow_id: record.skyflow_id,
            request_index: index,
          })
        }
      } else {
        failureObjects.push({
          error: {
            code: status,
            description: `${body['error']} - requestId: ${responseBody.metadata.requestId}`,
            request_index: index,
          }
        })
      }
    })
    const finalResponse = {};
    if (successObjects.length > 0) {
      finalResponse['records'] = successObjects;
    }
    if (failureObjects.length > 0) {
      finalResponse['errors'] = failureObjects;
    }
    return finalResponse;
  } else if (options.tokens) {
    return {
      records: responseBody.data.responses
        .map((res, index) => {
          const skyflowId = res.records[0].skyflow_id;
          const tokens = res.records[0].tokens;
          return {
            table: records[index].table,
            fields: {
              skyflow_id: skyflowId,
              ...tokens,
            },
            "request_index": index,
          };
        }),
    };
  }
  return {
    records: responseBody.data.responses.map((res, index) => ({
      table: records[index].table,
      skyflow_id: res.records[0].skyflow_id,
      "request_index": index
    })),
  };
};