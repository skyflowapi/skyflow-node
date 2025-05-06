//imports

import { DetectedEntity, EntityType, TokenType, Transformations } from "../../../ _generated_/rest/api";
import { generateSDKMetrics, getBearerToken, MessageType, parameterizedString, printLog, removeSDKVersion, SDK_METRICS_HEADER_KEY, TYPES } from "../../../utils";
import logs from "../../../utils/logs";
import { validateDeIdentifyTextRequest, validateReidentifyTextRequest } from "../../../utils/validations";
import VaultClient from "../../client";
import DeidentifyTextOptions from "../../model/options/deidentify-text";
import ReidentifyTextOptions from "../../model/options/reidentify-text";
import DeidentifyTextRequest from "../../model/request/deidentify-text";
import ReidentifyTextRequest from "../../model/request/reidentify-text";
import DeidentifiedTextResponse from "../../model/response/deidentify-text";
import DeidentifyTextResponse from "../../model/response/deidentify-text";
import ReidentifyTextResponse from "../../model/response/reidentify-text";

class DetectController {

    private client: VaultClient;

    constructor(client: VaultClient) {
        this.client = client;
        printLog(logs.infoLogs.CONTROLLER_INITIALIZED, MessageType.LOG, this.client.getLogLevel());
    }

    private createSdkHeaders() {
        return { [SDK_METRICS_HEADER_KEY]: JSON.stringify(generateSDKMetrics()) };
    }

    private handleRequest(apiCall: Function, requestType: string): Promise<any> {
        return new Promise((resolve, reject) => {
            printLog(parameterizedString(logs.infoLogs.EMIT_REQUEST, TYPES[requestType]), MessageType.LOG, this.client.getLogLevel());
            const sdkHeaders = this.createSdkHeaders();

            getBearerToken(this.client.getCredentials(), this.client.getLogLevel()).then(authInfo => {
                this.client.initAPI(authInfo, requestType);
                apiCall({ headers: { ...sdkHeaders } })
                    .then((response: any) => {
                        const { data, rawResponse } = response;
                        const requestId = rawResponse?.headers?.get('x-request-id');
                        printLog(logs.infoLogs[`${requestType}_REQUEST_RESOLVED`], MessageType.LOG, this.client.getLogLevel());
                        switch (requestType) {
                            case TYPES.DETECT:
                                resolve({records: data, requestId})
                                break;
                        }
                    }).catch((error: any) => {
                        printLog(logs.errorLogs[`${requestType}_REQUEST_REJECTED`], MessageType.ERROR, this.client.getLogLevel());
                        this.client.failureResponse(error).catch((err) => reject(err))
                    });
            }).catch(reject);
        });
    }

    private buildDeidentifyTextRequest(request: DeidentifyTextRequest, options?: DeidentifyTextOptions) {
        
        return {
            vault_id: this.client.vaultId,
            text: request.text,
            entity_types: options?.getEntities() as EntityType[],
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            token_type: {
                default: options?.getTokenFormat()?.getDefault(),
                vault_token: options?.getTokenFormat()?.getVaultToken(),
                entity_unq_counter: options?.getTokenFormat()?.getEntityUniqueCounter(),
                entity_only: options?.getTokenFormat()?.getEntityOnly(),
            } as TokenType,
            transformations: {
                shift_dates: {
                    max_days: options?.getTransformations()?.getShiftDays()?.max,
                    min_days: options?.getTransformations()?.getShiftDays()?.min,
                    entity_types: options?.getTransformations()?.getShiftDays()?.entities,
                }
            } as Transformations,
        };
    }

    private parseDeidentifyTextResponse(data: any) {
        return {
            processedText: data.records.processed_text,
            entities: data.records.entities.map((entity: DetectedEntity) => ({
                token: entity.token,
                value: entity.value,
                textIndex: {
                    start: entity.location?.start_index,
                    end: entity.location?.end_index,
                },
                processedIndex: {
                    start: entity.location?.start_index_processed,
                    end: entity.location?.end_index_processed,
                },
                entity: entity.entity_type,
                scores: entity.entity_scores,
            })),
            wordCount: data.records.word_count,
            charCount: data.records.character_count,
        };
    }

    deidentifyText(request: DeidentifyTextRequest, options?: DeidentifyTextOptions): Promise<DeidentifiedTextResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.DEIDENTIFY_TEXT_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_DEIDENTIFY_TEXT_INPUT, MessageType.LOG, this.client.getLogLevel());

                validateDeIdentifyTextRequest(request, options, this.client.getLogLevel());

                const requestBody = this.buildDeidentifyTextRequest(request, options);
                this.handleRequest(
                    () => this.client.stringsAPI.deidentifyString(
                        requestBody
                    ).withRawResponse(),
                    TYPES.DETECT
                ).then(data => {
                    const parsedResponse = new DeidentifyTextResponse(this.parseDeidentifyTextResponse(data))
                    resolve(parsedResponse);
                }).catch(error => {
                    reject(error)
                });
            } catch (error) {
                if (error instanceof Error)
                    printLog(removeSDKVersion(error.message), MessageType.ERROR, this.client.getLogLevel());
                reject(error);
            }
        });
    }

    reidentifyText(request: ReidentifyTextRequest, options?: ReidentifyTextOptions): Promise<ReidentifyTextResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.REIDENTIFY_TEXT_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_REIDENTIFY_TEXT_INPUT, MessageType.LOG, this.client.getLogLevel());
                validateReidentifyTextRequest(request, options, this.client.getLogLevel());

                const requestBody = {
                    text: request.text,
                    vault_id: this.client.vaultId,
                    format: {
                        redacted: options?.getRedactedEntities(),
                        masked: options?.getMaskedEntities(),
                        plaintext: options?.getPlainTextEntities(),
                    }
                };
                this.handleRequest(
                    () => this.client.stringsAPI.reidentifyString(
                        requestBody
                    ).withRawResponse(),
                    TYPES.DETECT
                ).then(data => {
                    resolve(new ReidentifyTextResponse({
                        processedText: data.records.text
                    }));
                }).catch(error => {
                    reject(error)
                });

            } catch (error) {
                if (error instanceof Error)
                    printLog(removeSDKVersion(error.message), MessageType.ERROR, this.client.getLogLevel());
                reject(error);
            }
        });
    }

}

export default DetectController;
