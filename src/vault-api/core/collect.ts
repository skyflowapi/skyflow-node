import _ from 'lodash';
import { IInsertRecordInput, IInsertRecord } from '../utils/common';

export const constructInsertRecordRequest = (
  records: IInsertRecordInput,
  options: Record<string, any> = { tokens: true },
) => {
  const requestBody: any = [];
  if (options.tokens) {
    records.records.forEach((record, index) => {
      requestBody.push({
        method: 'POST',
        quorum: true,
        tableName: record.table,
        fields: record.fields,
      });
      requestBody.push({
        method: 'GET',
        tableName: record.table,
        ID: `$responses.${2 * index}.records.0.skyflow_id`,
        tokenization: true,
      });
    });
  } else {
    records.records.forEach((record) => {
      requestBody.push({
        method: 'POST',
        quorum: true,
        tableName: record.table,
        fields: record.fields,
      });
    });
  }
  return requestBody;
};

export const constructInsertRecordResponse = (
  responseBody: any,
  tokens: boolean,
  records: IInsertRecord[],
) => {
  if (tokens) {
    return {
      records: responseBody.responses
        .map((res, index) => {
          if (index % 2 !== 0) {
            const skyflowId = responseBody.responses[index - 1].records[0].skyflow_id;
            delete res.fields['*'];
            return {
              table: records[Math.floor(index/2)].table,
              fields: {
                skyflow_id: skyflowId,
                ...res.fields,
              },
            };
          }
          return res;
        }).filter((res, index) => index % 2 !== 0),
    };
  }
  return {
    records: responseBody.responses.map((res, index) => ({
      table: records[index].table,
      skyflow_id: res.records[0].skyflow_id,
    })),
  };
};