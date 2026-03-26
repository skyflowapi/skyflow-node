//imports
import {
  fillUrlWithPathAndQueryParams,
  generateSDKMetrics,
  getBearerToken,
  LogLevel,
  MessageType,
  RequestMethod,
  parameterizedString,
  printLog,
  SDK,
  SKYFLOW,
  REQUEST,
  TYPES,
  HTTP_HEADER,
  CONTENT_TYPE,
  objectToXML,
} from "../../../utils";
import InvokeConnectionRequest from "../../model/request/inkove";
import logs from "../../../utils/logs";
import { validateInvokeConnectionRequest } from "../../../utils/validations";
import VaultClient from "../../client";
import InvokeConnectionResponse from "../../model/response/invoke/invoke";
import SkyflowError from "../../../error";
import SKYFLOW_ERROR_CODE from "../../../error/codes";

class ConnectionController {
  private client: VaultClient;

  private logLevel: LogLevel;

  constructor(client: VaultClient) {
    this.client = client;
    this.logLevel = client.getLogLevel();
  }

  private buildInvokeConnectionBody(invokeRequest: InvokeConnectionRequest): {
    body: any;
    shouldRemoveContentType: boolean;
  } {
    let requestBody;
    let shouldRemoveContentType: boolean = false;
    const normalizedHeaders: Record<string, string> = {};

    if (invokeRequest.headers) {
      Object.entries(invokeRequest.headers).forEach(([key, value]) => {
        normalizedHeaders[key.toLowerCase()] =
          typeof value === "string" ? value : JSON.stringify(value);
      });
    }

    const contentType =
      normalizedHeaders[
        HTTP_HEADER.CONTENT_TYPE.toLowerCase()
      ]?.toLowerCase() || "";

    if (
      !contentType &&
      typeof invokeRequest.body === "object" &&
      invokeRequest.body !== null
    ) {
      requestBody = JSON.stringify(invokeRequest.body);
      normalizedHeaders[HTTP_HEADER.CONTENT_TYPE.toLowerCase()] =
        CONTENT_TYPE.APPLICATION_JSON;
    } else if (contentType.includes(CONTENT_TYPE.APPLICATION_JSON)) {
      requestBody = JSON.stringify(invokeRequest.body);
    } else if (
      contentType.includes(CONTENT_TYPE.APPLICATION_X_WWW_FORM_URLENCODED)
    ) {
      const urlSearchParams = new URLSearchParams();
      Object.entries(invokeRequest.body || {}).forEach(([key, value]) => {
        if (
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value)
        ) {
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            urlSearchParams.append(`${key}[${nestedKey}]`, String(nestedValue));
          });
        } else if (Array.isArray(value)) {
          value.forEach((item) => {
            urlSearchParams.append(key, String(item));
          });
        } else {
          urlSearchParams.append(key, String(value));
        }
      });
      requestBody = urlSearchParams.toString();
    } else if (contentType.includes(CONTENT_TYPE.MULTIPART_FORM_DATA)) {
      shouldRemoveContentType = true;

      if (invokeRequest.body instanceof FormData) {
        requestBody = invokeRequest.body;
      } else {
        const formData = new FormData();
        Object.entries(invokeRequest.body || {}).forEach(([key, value]) => {
          if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
          } else if (typeof value === "object" && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        });
        requestBody = formData;
      }
    } else if (
      contentType.includes(CONTENT_TYPE.APPLICATION_XML) ||
      contentType.includes(CONTENT_TYPE.TEXT_XML)
    ) {
      if (typeof invokeRequest.body === "string") {
        requestBody = invokeRequest.body;
      } else if (typeof invokeRequest.body === "object") {
        requestBody = objectToXML(invokeRequest.body, "request");
      } else {
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_XML_FORMAT);
      }
    } else if (contentType.includes(CONTENT_TYPE.TEXT_PLAIN)) {
      requestBody =
        typeof invokeRequest.body === "string"
          ? invokeRequest.body
          : String(invokeRequest.body);
    } else if (contentType.includes(CONTENT_TYPE.TEXT_HTML)) {
      requestBody =
        typeof invokeRequest.body === "string"
          ? invokeRequest.body
          : String(invokeRequest.body);
    } else {
      if (typeof invokeRequest.body === "string") {
        requestBody = invokeRequest.body;
      } else if (
        typeof invokeRequest.body === "object" &&
        invokeRequest.body !== null
      ) {
        requestBody = JSON.stringify(invokeRequest.body);
      } else {
        requestBody = invokeRequest.body;
      }
    }

    return { body: requestBody, shouldRemoveContentType };
  }

  private async parseResponseBody(response: Response): Promise<any> {
    const contentType =
      response.headers.get(HTTP_HEADER.CONTENT_TYPE)?.toLowerCase() || "";

    try {
      if (contentType.includes(CONTENT_TYPE.APPLICATION_JSON)) {
        return await response.json();
      } else if (
        contentType.includes(CONTENT_TYPE.APPLICATION_XML) ||
        contentType.includes(CONTENT_TYPE.TEXT_XML)
      ) {
        return await response.text();
      } else if (contentType.includes(CONTENT_TYPE.TEXT_HTML)) {
        return await response.text();
      } else if (
        contentType.includes(CONTENT_TYPE.APPLICATION_X_WWW_FORM_URLENCODED)
      ) {
        const text = await response.text();
        return Object.fromEntries(new URLSearchParams(text));
      } else if (contentType.includes(CONTENT_TYPE.MULTIPART_FORM_DATA)) {
        return await response.text();
      } else if (contentType.includes(CONTENT_TYPE.TEXT_PLAIN)) {
        return await response.text();
      } else {
        try {
          return await response.json();
        } catch {
          return await response.text();
        }
      }
    } catch {
      try {
        const text = await response.text();
        return text ? { message: text } : null;
      } catch {
        response.body?.cancel().catch(() => {});
        return null;
      }
    }
  }

  invoke(
    invokeRequest: InvokeConnectionRequest,
  ): Promise<InvokeConnectionResponse> {
    return new Promise((resolve, reject) => {
      try {
        printLog(
          logs.infoLogs.INVOKE_CONNECTION_TRIGGERED,
          MessageType.LOG,
          this.logLevel,
        );
        printLog(
          logs.infoLogs.VALIDATE_CONNECTION_CONFIG,
          MessageType.LOG,
          this.logLevel,
        );
        validateInvokeConnectionRequest(invokeRequest);
        const filledUrl = fillUrlWithPathAndQueryParams(
          this.client.url,
          invokeRequest.pathParams,
          invokeRequest.queryParams,
        );
        getBearerToken(this.client.getCredentials(), this.logLevel)
          .then((token) => {
            printLog(
              parameterizedString(
                logs.infoLogs.EMIT_REQUEST,
                TYPES.INVOKE_CONNECTION,
              ),
              MessageType.LOG,
              this.logLevel,
            );

            const { body, shouldRemoveContentType } =
              this.buildInvokeConnectionBody(invokeRequest);

            const requestHeaders: Record<string, string> = {};

            if (invokeRequest.headers) {
              Object.entries(invokeRequest.headers).forEach(([key, value]) => {
                const lowerKey = key.toLowerCase();
                if (shouldRemoveContentType && lowerKey === HTTP_HEADER.CONTENT_TYPE.toLowerCase()) {
                  return;
                }
                requestHeaders[key] =
                  typeof value === "string" ? value : JSON.stringify(value);
              });
            }

            requestHeaders[SKYFLOW.AUTH_HEADER_KEY] = token.key;
            requestHeaders[SDK.METRICS_HEADER_KEY] =
              JSON.stringify(generateSDKMetrics());

            fetch(filledUrl, {
              method: invokeRequest.method || RequestMethod.POST,
              body: body,
              headers: requestHeaders,
            })
              .then(async (response) => {
                const body = await this.parseResponseBody(response);

                if (!response.ok) {
                  throw {
                    body,
                    statusCode: response.status,
                    message: response.statusText,
                    headers: response.headers,
                  };
                }

                return { headers: response.headers, body };
              })
              .then(({ headers, body }) => {
                printLog(
                  logs.infoLogs.INVOKE_CONNECTION_REQUEST_RESOLVED,
                  MessageType.LOG,
                  this.logLevel,
                );
                const requestId = headers?.get(REQUEST.ID_KEY) || "";
                const invokeConnectionResponse = new InvokeConnectionResponse({
                  data: body,
                  metadata: { requestId },
                  errors: null,
                });
                resolve(invokeConnectionResponse);
              })
              .catch((err) => {
                printLog(
                  logs.errorLogs.INVOKE_CONNECTION_REQUEST_REJECTED,
                  MessageType.LOG,
                  this.logLevel,
                );
                this.client.failureResponse(err).catch((err) => reject(err));
              });
          })
          .catch((err) => {
            reject(err);
          });
      } catch (e) {
        if (e instanceof Error)
          printLog(e.message, MessageType.ERROR, this.logLevel);
        reject(e);
      }
    });
  }
}

export default ConnectionController;
