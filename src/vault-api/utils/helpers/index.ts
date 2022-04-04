import { ContentType, IConnectionConfig } from "../common";
const qs = require('qs');
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
function objectToFormData(obj: any, form?: FormData, namespace?: string) {
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

export function updateRequestBodyInConnection(config: IConnectionConfig) {
  let tempConfig = { ...config };
  if (config && config.requestHeader && config.requestBody) {
    const headerKeys = toLowerKeys(config.requestHeader);
    if (headerKeys['content-type'].includes(ContentType.FORMURLENCODED)) {
      tempConfig = {
        ...tempConfig,
        requestBody: qs.stringify(config.requestBody),
      };
    } else if (headerKeys['content-type'].includes(ContentType.FORMDATA)) {
      const body = objectToFormData(config.requestBody);
      tempConfig = {
        ...tempConfig,
        requestBody: body,
      };
    }
  }  
  return tempConfig;
}