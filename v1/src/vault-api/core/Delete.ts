import Client from "../client";
import SkyflowError from "../libs/SkyflowError";
import { IDeleteOptions, IDeleteRecord } from "../utils/common";

const formatForPureJsFailure = (cause, skyflowId: string) => ({
  id: skyflowId,
  ...new SkyflowError({
    code: cause?.error?.code,
    description: cause?.error?.description,
  }, [], true),
});

const deleteRecordInVault = (
  deleteRecord: IDeleteRecord,
  options: IDeleteOptions,
  client: Client,
  authToken: string,
): Promise<any> => {
  const vaultEndPointURL: string = `${client.config.vaultURL}/v1/vaults/${client.config.vaultID}/${deleteRecord.table}/${deleteRecord.id}`;
  return client.request({
    requestMethod: 'DELETE',
    url: vaultEndPointURL,
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    }
  });
};

/** Delete By Skyflow ID */
export const deleteRecordsBySkyflowID = (
  deleteRecords: IDeleteRecord[],
  options: IDeleteOptions,
  client: Client,
  authToken: String
) => {
  return new Promise((rootResolve, rootReject) => {
    const vaultResponseSet: Promise<any>[] = deleteRecords.map(
      (deleteRecord) =>
        new Promise((resolve) => {
          const deleteResponse: any = [];
          deleteRecordInVault(
            deleteRecord,
            options,
            client,
            authToken as string
          )
            .then(
              (response: any) => {
                deleteResponse.push(response.data);
              },
              (cause: any) => {
                deleteResponse.push(formatForPureJsFailure(cause, deleteRecord.id));
              }
            )
            .finally(() => {
              resolve(deleteResponse);
            });
        })
    );

    Promise.allSettled(vaultResponseSet).then((resultSet) => {
      const recordsResponse: Record<string, any>[] = [];
      const errorResponse: Record<string, any>[] = [];
      resultSet.forEach((result) => {
        if (result.status === "fulfilled") {
          result.value.forEach((res: Record<string, any>) => {
            if (Object.prototype.hasOwnProperty.call(res, "error")) {
              errorResponse.push(res);
            } else {
              recordsResponse.push(res);
            }
          });
        }
      });
      if (errorResponse.length === 0) {
        rootResolve({ records: recordsResponse });
      } else if (recordsResponse.length === 0) {
        rootReject({ errors: errorResponse });
      }else rootReject({ records: recordsResponse, errors: errorResponse });
    });
  });
};
