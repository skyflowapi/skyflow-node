/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import * as sdkDetails from "../../../../package.json";
import { MessageType } from "../common";
import logs from "../logs";
import { parameterizedString, printLog } from "../logs-helper";
const FormData = require("form-data");
const os = require("os");
const process = require("process");

export function fillUrlWithPathAndQueryParams(url:string,
  pathParams?:object,
  queryParams?:object) {
  let filledUrl = url;
  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      filledUrl = url.replace(`{${key}}`, value);
    });
  }
  if (queryParams) {
    filledUrl += '?';
    Object.entries(queryParams).forEach(([key, value]) => {
      filledUrl += `${key}=${value}&`;
    });
    filledUrl = filledUrl.substring(0, filledUrl.length - 1);
  }
  return filledUrl;
}

export function formatVaultURL(vaultURL) {
  if (typeof vaultURL !== 'string') return vaultURL;
  return (vaultURL?.trim().slice(-1) === '/') ? vaultURL.slice(0, -1) : vaultURL.trim();
}

export function toLowerKeys(obj) {
  if (obj && typeof obj === 'object') {
  return Object.keys(obj).reduce((accumulator, key) => {
    accumulator[key.toLowerCase()] = obj[key];
    return accumulator;
  }, {});
  }
  return {}
}
export function objectToFormData(obj: any, form?: FormData, namespace?: string) {
  const fd = form || new FormData();
  let formKey: string;
  Object.keys(obj).forEach((property) => {
    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      if (namespace) {
        formKey = `${namespace}[${property}]`;
      } else {
        formKey = property;
      }

      if (typeof obj[property] === 'object') {
        objectToFormData(obj[property], fd, property);
      } else {
          fd.append(formKey, obj[property]);
      }
    }
  });

  return fd;
}


export const generateSDKMetrics = () => {
  let sdkNameVersion = "";
  let clientDeviceModel = "";
  let clientOSDetails = "";
  let runtimeDetails = "";
  try {
    sdkNameVersion = `${sdkDetails.name ? `${sdkDetails.name}@` : ""}${
      sdkDetails.version ? sdkDetails.version : ""
    }`;
  } catch (err) {
    printLog(
      parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC,"sdkNameVersion")
      ,MessageType.LOG
    );
    sdkNameVersion = "";
  }

  try {
    clientDeviceModel = `${process.platform ? `${process.platform} ` : ""} ${
      process.arch ? process.arch : ""
    }`;
  } catch (err) {
    printLog(
      parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC,"clientDeviceModel")
      ,MessageType.LOG
    );
    clientDeviceModel = "";
  }

  try {
    clientOSDetails = `${os.version() ? os.version() : ""}`;
  } catch (err) {
    printLog(
      parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC,"clientOSDetails")
      ,MessageType.LOG
    );
    clientOSDetails = "";
  }

  try {
    runtimeDetails = `${process.version ? `Node@${process.version}` : ""}`;
  } catch (err) {
    printLog(
      parameterizedString(logs.infoLogs.UNABLE_TO_GENERATE_SDK_METRIC,"runtimeDetails")
      ,MessageType.LOG
    );
    runtimeDetails = "";
  }

  return {
    sdk_name_version: sdkNameVersion,
    sdk_client_device_model: clientDeviceModel,
    sdk_client_os_details: clientOSDetails,
    sdk_runtime_details: runtimeDetails,
  };
};