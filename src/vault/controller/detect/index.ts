//imports

import path from "path";
import { DeidentifyTextRequest as DeidentifyTextRequest2,DeidentifyAudioRequest, DeidentifyDocumentRequest, DeidentifyDocumentRequestFileDataFormat, DeidentifyFileRequestFileDataFormat, DeidentifyImageRequest, DeidentifyImageRequestFileDataFormat, DeidentifyImageRequestMaskingMethod, DeidentifyPdfRequest, DeidentifyPresentationRequest, DeidentifyPresentationRequestFileDataFormat, DeidentifySpreadsheetRequest, DeidentifySpreadsheetRequestFileDataFormat, DeidentifyStructuredTextRequest, DeidentifyStructuredTextRequestFileDataFormat, DetectedEntity, EntityType, GetRunRequest, Transformations as GeneratedTransformations, TokenTypeWithoutVault, DeidentifyStringResponse, DeidentifyStatusResponse, DeidentifyAudioRequestFileDataFormat } from "../../../ _generated_/rest/api";
import { DeidentifyFileRequest as  DeidentifyFileRequest2} from "../../../ _generated_/rest/api";

import { TokenType } from "../../../ _generated_/rest/api";
import { DeidenitfyFileRequestTypes, generateSDKMetrics, getBearerToken, MessageType, parameterizedString, printLog, removeSDKVersion, SDK_METRICS_HEADER_KEY, TYPES } from "../../../utils";
import logs from "../../../utils/logs";
import { validateDeIdentifyTextRequest, validateReidentifyTextRequest, validateDeidentifyFileRequest, validateGetDetectRunRequest } from "../../../utils/validations";
import VaultClient from "../../client";
import DeidentifyTextOptions from "../../model/options/deidentify-text";
import ReidentifyTextOptions from "../../model/options/reidentify-text";
import DeidentifyTextRequest from "../../model/request/deidentify-text";
import ReidentifyTextRequest from "../../model/request/reidentify-text";
import DeidentifiedTextResponse from "../../model/response/deidentify-text";
import DeidentifyTextResponse from "../../model/response/deidentify-text";
import ReidentifyTextResponse from "../../model/response/reidentify-text";
import DeidentifyFileOptions from "../../model/options/deidentify-file";
import DeidentifyFileRequest from "../../model/request/deidentify-file";
import DeidentifyFileResponse from "../../model/response/deidentify-file";
import * as fs from 'fs';
import SkyflowError from "../../../error";
import SKYFLOW_ERROR_CODE from "../../../error/codes";
import GetDetectRunRequest from "../../model/request/get-detect-run";
import Transformations from "../../model/options/deidentify-text/transformations";
import { SkyflowAllError } from "../../types";
import { DeidentifyFileDetectRunResponse, DeidentifyFileOutput, DetectTextResponse, DetectFileResponse } from "../../types";

class DetectController {

    private client: VaultClient;
    
    private waitTime: number = 64;

    constructor(client: VaultClient) {
        this.client = client;
    }

    private createSdkHeaders() {
        return { [SDK_METRICS_HEADER_KEY]: JSON.stringify(generateSDKMetrics()) };
    }

    private async getFileFromRequest(request: DeidentifyFileRequest): Promise<File> {
        const fileType = request.getFile();
    
        if ('file' in fileType && fileType.file) {
            // Already a File or Buffer
            return fileType.file as File;
        } else if ('filePath' in fileType && fileType.filePath) {
            const filePath = fileType.filePath;
            const buffer = fs.readFileSync(filePath);
            return new File([buffer], filePath);
        }
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_REQUEST);
    }

    private async getBase64FileContent(file: File){
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = buffer.toString('base64');
        return base64String;
    }

    private getTransformations(options?: DeidentifyFileOptions | DeidentifyTextOptions) {
        const transformations = options?.getTransformations() as Transformations | undefined;
        return {
            shift_dates: {
                max_days: transformations?.getShiftDays()?.max,
                min_days: transformations?.getShiftDays()?.min,
                entity_types: transformations?.getShiftDays()?.entities,
            }
        };
    }

    private async buildAudioRequest(baseRequest: File, options?: DeidentifyFileOptions, fileExtension?: string): Promise<DeidentifyAudioRequest> {
        const base64String = await this.getBase64FileContent(baseRequest);
        var audioRequest : DeidentifyAudioRequest = {
            file: {
                base64: base64String as string,
                data_format: fileExtension as DeidentifyAudioRequestFileDataFormat,
            },
            vault_id: this.client.vaultId,
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenFormat()?.getDefault(),
                entity_unq_counter: options?.getTokenFormat()?.getEntityUniqueCounter(),
                entity_only: options?.getTokenFormat()?.getEntityOnly(),
            } as TokenTypeWithoutVault,
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: this.getTransformations(options) as GeneratedTransformations,
            output_transcription: options?.getOutputTranscription(),
            output_processed_audio: options?.getOutputProcessedAudio(),
            bleep_gain: options?.getBleep()?.getGain(),
            bleep_frequency: options?.getBleep()?.getFrequency(),
            bleep_start_padding: options?.getBleep()?.getStartPadding(),
            bleep_stop_padding: options?.getBleep()?.getStopPadding(),
        }
        return audioRequest;
    }
    private async buildTextFileRequest(baseRequest: File, options?: DeidentifyFileOptions): Promise<DeidentifyTextRequest2> {
        const base64String = await this.getBase64FileContent(baseRequest);
        
        var textFileRequest: DeidentifyTextRequest2 = {
            vault_id: this.client.vaultId,
            file: {
                base64: base64String,
                data_format: "txt",
            },
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenFormat()?.getDefault(),
                entity_unq_counter: options?.getTokenFormat()?.getEntityUniqueCounter(),
                entity_only: options?.getTokenFormat()?.getEntityOnly(),
            } as TokenTypeWithoutVault,
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: this.getTransformations(options) as GeneratedTransformations,
        }
        return textFileRequest;
    }
    private async buildPdfRequest(baseRequest: File, options?: DeidentifyFileOptions): Promise<DeidentifyPdfRequest> {
        const base64String = await this.getBase64FileContent(baseRequest);
        var pdfRequest: DeidentifyPdfRequest = {
            file: {
                base64: base64String as string,
                data_format: "pdf",
            },
            vault_id: this.client.vaultId,
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenFormat()?.getDefault(),
                entity_unq_counter: options?.getTokenFormat()?.getEntityUniqueCounter(),
                entity_only: options?.getTokenFormat()?.getEntityOnly(),
            } as TokenTypeWithoutVault,
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            max_resolution: options?.getMaxResolution(),
            density: options?.getPixelDensity(),
        }
        return pdfRequest; 
    }

    private async buildImageRequest(baseRequest: File, options?: DeidentifyFileOptions, fileExtension?: string): Promise<DeidentifyImageRequest> {
        const base64String = await this.getBase64FileContent(baseRequest);
        var imageRequest: DeidentifyImageRequest = {
            vault_id: this.client.vaultId,
            file: {
                base64: base64String as string,
                data_format: fileExtension as DeidentifyImageRequestFileDataFormat,
            },
            allow_regex: options?.getAllowRegexList(),
            entity_types: options?.getEntities() as EntityType[],
            masking_method: options?.getMaskingMethod() as DeidentifyImageRequestMaskingMethod,
            output_ocr_text: options?.getOutputOcrText(),
            output_processed_image: options?.getOutputProcessedImage(),
            restrict_regex: options?.getRestrictRegexList(),
            token_type: {
                default: options?.getTokenFormat()?.getDefault(),
                entity_unq_counter: options?.getTokenFormat()?.getEntityUniqueCounter(),
                entity_only: options?.getTokenFormat()?.getEntityOnly(),
            } as TokenTypeWithoutVault,
        };

        return imageRequest; 
    }

    private async buildPptRequest(baseRequest: File, options?: DeidentifyFileOptions, fileExtension?: string): Promise<DeidentifyPresentationRequest> {
        const base64String = await this.getBase64FileContent(baseRequest);
        var pptRequest: DeidentifyPresentationRequest = {
            vault_id: this.client.vaultId,
            file: {
                base64: base64String as string,
                data_format: fileExtension as DeidentifyPresentationRequestFileDataFormat,
            },
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenFormat()?.getDefault(),
                entity_unq_counter: options?.getTokenFormat()?.getEntityUniqueCounter(),
                entity_only: options?.getTokenFormat()?.getEntityOnly(),
            } as TokenTypeWithoutVault,
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
        };
        return pptRequest;
    }

    private async buildSpreadsheetRequest(baseRequest: File, options?: DeidentifyFileOptions, fileExtension?: string): Promise<DeidentifySpreadsheetRequest> {
        const base64String = await this.getBase64FileContent(baseRequest);
        var spreadsheetRequest: DeidentifySpreadsheetRequest = {
            vault_id: this.client.vaultId,
            file: {
                base64: base64String as string,
                data_format: fileExtension as DeidentifySpreadsheetRequestFileDataFormat,
            },
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenFormat()?.getDefault(),
                entity_unq_counter: options?.getTokenFormat()?.getEntityUniqueCounter(),
                entity_only: options?.getTokenFormat()?.getEntityOnly(),
            } as TokenTypeWithoutVault,
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
        };
        return spreadsheetRequest;
    }

    private async buildStructuredTextRequest(baseRequest: File, options?: DeidentifyFileOptions, fileExtension?: string): Promise<DeidentifyStructuredTextRequest> {
        const base64String = await this.getBase64FileContent(baseRequest);
        var structuredTextRequest: DeidentifyStructuredTextRequest = {
            vault_id: this.client.vaultId,
            file: {
                base64: base64String as string,
                data_format: fileExtension as DeidentifyStructuredTextRequestFileDataFormat,
            },
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenFormat()?.getDefault(),
                entity_unq_counter: options?.getTokenFormat()?.getEntityUniqueCounter(),
                entity_only: options?.getTokenFormat()?.getEntityOnly(),
            } as TokenTypeWithoutVault,
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: this.getTransformations(options) as GeneratedTransformations,
        };
        return structuredTextRequest; 
    }

    private async buildDocumentRequest(baseRequest: File, options?: DeidentifyFileOptions, fileExtension?: string): Promise<DeidentifyDocumentRequest> {
        const base64String = await this.getBase64FileContent(baseRequest);
        var documentRequest: DeidentifyDocumentRequest = {
            vault_id: this.client.vaultId,
            file: {
                base64: base64String as string,
                data_format: fileExtension as DeidentifyDocumentRequestFileDataFormat,
            },
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenFormat()?.getDefault(),
                entity_unq_counter: options?.getTokenFormat()?.getEntityUniqueCounter(),
                entity_only: options?.getTokenFormat()?.getEntityOnly(),
            } as TokenTypeWithoutVault,
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
        };
        return documentRequest;
    }

    private async buildGenericFileRequest(baseRequest: File, options?: DeidentifyFileOptions, fileExtension?: string): Promise<DeidentifyFileRequest2> {
        const base64String = await this.getBase64FileContent(baseRequest);
        var genericRequest: DeidentifyFileRequest2 = {
                vault_id: this.client.vaultId,
                file: {
                    base64: base64String as string,
                    data_format: fileExtension as DeidentifyAudioRequestFileDataFormat,
                },
                token_type: {
                    default: options?.getTokenFormat()?.getDefault(),
                    entity_unq_counter: options?.getTokenFormat()?.getEntityUniqueCounter(),
                    entity_only: options?.getTokenFormat()?.getEntityOnly(),
                } as TokenTypeWithoutVault,
                allow_regex: options?.getAllowRegexList(),
                restrict_regex: options?.getRestrictRegexList(),
                transformations: this.getTransformations(options) as GeneratedTransformations,
                entity_types: options?.getEntities() as EntityType[],
        }
        return genericRequest;
    }

    private decodeBase64AndSaveToFile(base64Data: string, outputFilePath: string) {
        try {
            // Decode the base64 string
            const buffer = Buffer.from(base64Data, 'base64');

            // Write the decoded data to the specified file
            fs.writeFileSync(outputFilePath, buffer);
        } catch (error) {
            throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_DEIDENTIFY_FILE_REQUEST);

        }
    }

    private processDeidentifyFileResponse(response: DeidentifyFileDetectRunResponse, outputDirectory: string, fileBaseName: string) {
        try {
            // Ensure the output directory exists
            if (!fs.existsSync(outputDirectory)) {
                fs.mkdirSync(outputDirectory, { recursive: true });
            }

            // Iterate over the output array in the response
            response.output.forEach((fileObject: DeidentifyFileOutput, index: number) => {
                const { processedFile, processedFileExtension } = fileObject;

                if (!processedFile || !processedFileExtension) {
                    return;
                }

                // Determine the output file name and path
                const outputFileName = `processed-${fileBaseName}.${processedFileExtension}`;
                const outputFilePath = path.join(outputDirectory, outputFileName);

                // Handle JSON files
                if (processedFileExtension === 'json') {
                    const jsonData = Buffer.from(processedFile, 'base64').toString('utf-8');
                    fs.writeFileSync(outputFilePath, jsonData);
                } else if ( processedFileExtension === 'mp3' || processedFileExtension === 'wav') {
                    const mp3Data = Buffer.from(processedFile, 'base64');
                    fs.writeFileSync(outputFilePath, mp3Data, { encoding: 'binary' });
                } else {
                    // Handle other file types (e.g., images, PDFs, etc.)
                    this.decodeBase64AndSaveToFile(processedFile, outputFilePath);
                }
            });
            } catch (error) {
            throw error;
        }
    }

    private getReqType(format: string): DeidenitfyFileRequestTypes{
        var reqType: DeidenitfyFileRequestTypes
        if (Object.values(DeidentifyAudioRequestFileDataFormat).includes(format as DeidentifyAudioRequestFileDataFormat)){
            reqType = DeidenitfyFileRequestTypes.AUDIO;
        } else if (format.includes('pdf')){
            reqType = DeidenitfyFileRequestTypes.PDF
        } else if (format.includes('txt')){
            reqType = DeidenitfyFileRequestTypes.TEXT
        } else if (Object.values(DeidentifyImageRequestFileDataFormat).includes(format as DeidentifyImageRequestFileDataFormat)){
            reqType = DeidenitfyFileRequestTypes.IMAGE;
        } else if (Object.values(DeidentifyPresentationRequestFileDataFormat).includes(format as DeidentifyPresentationRequestFileDataFormat)){
            reqType = DeidenitfyFileRequestTypes.PPT;
        } else if (Object.values(DeidentifySpreadsheetRequestFileDataFormat).includes(format as DeidentifySpreadsheetRequestFileDataFormat)){
            reqType = DeidenitfyFileRequestTypes.SPREADSHEET;
        }  else if (Object.values(DeidentifyStructuredTextRequestFileDataFormat).includes(format as DeidentifyStructuredTextRequestFileDataFormat)){
            reqType = DeidenitfyFileRequestTypes.STRUCTURED_TEXT;
        }  else if (Object.values(DeidentifyDocumentRequestFileDataFormat).includes(format as DeidentifyDocumentRequestFileDataFormat)){
            reqType = DeidenitfyFileRequestTypes.DOCUMENT;
        }  else if (Object.values(DeidentifyFileRequestFileDataFormat).includes(format as DeidentifyFileRequestFileDataFormat)){
            reqType = DeidenitfyFileRequestTypes.FILE
        } else {
            reqType = DeidenitfyFileRequestTypes.FILE
        }
        return reqType;
    }

    private pollForProcessedFile(runId: string, req: GetRunRequest, maxWaitTime: number, resolve: Function, reject: Function): void {
        let currentWaitTime = 1; // Start with 1 second
    
        const poll = () => {
            this.client.filesAPI.getRun(runId, req)
                .then((response: DeidentifyStatusResponse) => {
                    if (response.status?.toUpperCase() === 'IN_PROGRESS'
) {
                        if (currentWaitTime >= maxWaitTime) {
                            resolve({ runId }); // Resolve with runId if max wait time is exceeded
                        } else {
                            const nextWaitTime = currentWaitTime * 2;
                            let waitTime = 0;
                            if (nextWaitTime >= maxWaitTime) {
                                waitTime = maxWaitTime - currentWaitTime;
                                currentWaitTime = maxWaitTime;
                            } else {
                                waitTime = nextWaitTime;
                                currentWaitTime = nextWaitTime;
                            }
                            setTimeout(() => {
                                poll();
                            }, waitTime * 1000);
                        }
                    } else if (response.status?.toUpperCase() === 'SUCCESS') {
                        resolve([response, runId]); // Resolve with the processed file response and runId
                    }
                    else if (response.status?.toUpperCase() === 'FAILED') {
                        reject(new SkyflowError(SKYFLOW_ERROR_CODE.INTERNAL_SERVER_ERROR, [response.message]));
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        };
    
        poll(); // Start polling
    }
    private handleRequest<T>(apiCall: Function, requestType: string): Promise<T> {
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
                            case TYPES.DEIDENTIFY_TEXT:
                            case TYPES.REIDENTIFY_TEXT:
                                resolve({records: data, requestId} as T)
                                break;
                            case TYPES.DEIDENTIFY_FILE:
                                const req: GetRunRequest = {
                                    vault_id: this.client.vaultId,
                                }

                                const maxWaitTime = this.waitTime;

                                this.pollForProcessedFile(data?.run_id, req, maxWaitTime, resolve, reject); // Call the extracted polling function
                                break; 
                            case TYPES.DETECT_RUN:
                                resolve({data, requestId} as T)
                                break;

                        }
                    }).catch((error: SkyflowAllError) => {
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
            transformations: this.getTransformations(options) as GeneratedTransformations,
        };
    }

    private parseDeidentifyTextResponse(records: DeidentifyStringResponse) {
        return {
            processedText: records.processed_text,
            entities: records?.entities.map((entity: DetectedEntity) => ({
                token: entity?.token,
                value: entity?.value,
                textIndex: {
                    start: entity?.location?.start_index,
                    end: entity?.location?.end_index,
                },
                processedIndex: {
                    start: entity?.location?.start_index_processed,
                    end: entity?.location?.end_index_processed,
                },
                entity: entity?.entity_type,
                scores: entity?.entity_scores,
            })),
            wordCount: records.word_count,
            charCount: records.character_count,
        };
    }

    private parseDeidentifyFileResponse(data: DeidentifyFileDetectRunResponse, runId?: string, status?: string): DeidentifyFileResponse {
        const base64String = data.output?.[0]?.processedFile ?? '';
        const extension = data.output?.[0]?.processedFileExtension ?? '';
        
        let file: File | undefined = undefined;

        if (base64String && extension) {
            const buffer = Buffer.from(base64String, 'base64');
            const fileName = `deidentified.${extension}`;
            file = new File([buffer], fileName);
        }

        return new DeidentifyFileResponse({
            fileBase64: base64String,
            file: file,
            type: data.output?.[0]?.processedFileType ?? data.outputType ?? "",
            extension: extension,
            wordCount: data.wordCharacterCount?.wordCount ?? 0,
            charCount: data.wordCharacterCount?.characterCount ?? 0,
            sizeInKb: data.size ?? 0,
            durationInSeconds: data.duration ?? 0,
            pageCount: data.pages ?? 0,
            slideCount: data.slides ?? 0,
            entities: (data.output || [])
                .filter((fileObject: DeidentifyFileOutput) => fileObject.processedFileType === 'entities')
                .map((fileObject: DeidentifyFileOutput) => ({
                    file: fileObject.processedFile as string,
                    extension: fileObject.processedFileExtension as string,
                })),
            runId: data.runId ?? data.runId ?? runId,
            status: status,
        });
    }

    deidentifyText(request: DeidentifyTextRequest, options?: DeidentifyTextOptions): Promise<DeidentifiedTextResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.DEIDENTIFY_TEXT_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_DEIDENTIFY_TEXT_INPUT, MessageType.LOG, this.client.getLogLevel());

                validateDeIdentifyTextRequest(request, options, this.client.getLogLevel());

                const requestBody = this.buildDeidentifyTextRequest(request, options);
                this.handleRequest<DetectTextResponse<DeidentifyStringResponse>>(
                    () => this.client.stringsAPI.deidentifyString(
                        requestBody
                    ).withRawResponse(),
                    TYPES.DEIDENTIFY_TEXT
                ).then(data => {
                    const parsedResponse = new DeidentifyTextResponse(this.parseDeidentifyTextResponse(data.records))
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
                this.handleRequest<DetectTextResponse<Record<string, string>>>(
                    () => this.client.stringsAPI.reidentifyString(
                        requestBody
                    ).withRawResponse(),
                    TYPES.REIDENTIFY_TEXT
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

    getDetectRun(request: GetDetectRunRequest): Promise<DeidentifyFileResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.GET_DETECT_RUN_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_GET_DETECT_RUN_INPUT, MessageType.LOG, this.client.getLogLevel());
                validateGetDetectRunRequest(request, this.client.getLogLevel());

                const req: GetRunRequest = {
                    vault_id: this.client.vaultId
                }

                this.handleRequest<DetectFileResponse<DeidentifyFileDetectRunResponse>>(
                    () => this.client.filesAPI.getRun(
                        request.runId,
                        req
                    ).withRawResponse(),
                    TYPES.DETECT_RUN
                ).then(response => {
                    const deidentifiedFileResponse = this.parseDeidentifyFileResponse(response.data, request.runId, response.data.status);
                    resolve(deidentifiedFileResponse);
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

    deidentifyFile(request: DeidentifyFileRequest, options?: DeidentifyFileOptions): Promise<DeidentifyFileResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                printLog(logs.infoLogs.DETECT_FILE_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_DETECT_FILE_INPUT, MessageType.LOG, this.client.getLogLevel());
                validateDeidentifyFileRequest(request, options, this.client.getLogLevel());

                const fileObj = await this.getFileFromRequest(request);

                const fileName = fileObj.name;
                const fileBaseName = path.parse(fileName).name;
                const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1); 

                this.waitTime = options?.getWaitTime() ?? this.waitTime; 

                var reqType : DeidenitfyFileRequestTypes = this.getReqType(fileExtension); 
                var promiseReq: Promise<[DeidentifyFileDetectRunResponse, string]>;
                switch (reqType){
                    case DeidenitfyFileRequestTypes.AUDIO:
                        promiseReq = this.buildAudioRequest(fileObj, options, fileExtension)
                            .then((audioReq) => {
                                return this.handleRequest(
                                    () => this.client.filesAPI.deidentifyAudio(
                                        audioReq
                                    ).withRawResponse(),
                                    TYPES.DEIDENTIFY_FILE
                                );
                            });
                        break;
                    case DeidenitfyFileRequestTypes.TEXT:
                        promiseReq = this.buildTextFileRequest(fileObj, options)
                            .then((textFileReq) => {
                                return this.handleRequest(
                                    () => this.client.filesAPI.deidentifyText(
                                        textFileReq
                                    ).withRawResponse(),
                                    TYPES.DEIDENTIFY_FILE
                                );
                            });
                        break;  
                    case DeidenitfyFileRequestTypes.PDF:
                        promiseReq = this.buildPdfRequest(fileObj, options)
                            .then((pdfReq) => {
                                return this.handleRequest(
                                    () => this.client.filesAPI.deidentifyPdf(
                                        pdfReq
                                    ).withRawResponse(),
                                    TYPES.DEIDENTIFY_FILE
                                );
                            });
                        break;
                    case DeidenitfyFileRequestTypes.IMAGE:
                        promiseReq = this.buildImageRequest(fileObj, options, fileExtension)
                            .then((imageReq) => {
                                return this.handleRequest(
                                    () => this.client.filesAPI.deidentifyImage(
                                        imageReq
                                    ).withRawResponse(),
                                    TYPES.DEIDENTIFY_FILE
                                );
                            });
                        break;
                    case DeidenitfyFileRequestTypes.PPT:
                        promiseReq = this.buildPptRequest(fileObj, options, fileExtension)
                            .then((pptReq) => {
                                return this.handleRequest(
                                    () => this.client.filesAPI.deidentifyPresentation(
                                        pptReq
                                    ).withRawResponse(),
                                    TYPES.DEIDENTIFY_FILE
                                );
                            });
                        break;
                    case DeidenitfyFileRequestTypes.SPREADSHEET:
                        promiseReq = this.buildSpreadsheetRequest(fileObj, options, fileExtension)
                            .then((spreadsheetReq) => {
                                return this.handleRequest(
                                    () => this.client.filesAPI.deidentifySpreadsheet(
                                        spreadsheetReq
                                    ).withRawResponse(),
                                    TYPES.DEIDENTIFY_FILE
                                );
                            });
                        break;
                    case DeidenitfyFileRequestTypes.STRUCTURED_TEXT:
                        promiseReq = this.buildStructuredTextRequest(fileObj, options, fileExtension)
                            .then((structuredTextReq) => {
                                return this.handleRequest(
                                    () => this.client.filesAPI.deidentifyStructuredText(
                                        structuredTextReq
                                    ).withRawResponse(),
                                    TYPES.DEIDENTIFY_FILE
                                );
                            });
                        break;
                    case DeidenitfyFileRequestTypes.DOCUMENT:
                        promiseReq = this.buildDocumentRequest(fileObj, options, fileExtension)
                            .then((documentReq) => {
                                return this.handleRequest(
                                    () => this.client.filesAPI.deidentifyDocument(
                                        documentReq
                                    ).withRawResponse(),
                                    TYPES.DEIDENTIFY_FILE
                                );
                            });
                        break;
                    default:
                        promiseReq = this.buildGenericFileRequest(fileObj, options, fileExtension)
                            .then((defaultReq) => {
                                return this.handleRequest(
                                    () => this.client.filesAPI.deidentifyFile(
                                        defaultReq
                                    ).withRawResponse(),
                                    TYPES.DEIDENTIFY_FILE
                                );
                            });
                        break;                    
                }

                promiseReq.then(([data, runId])  => {
                    if(runId && data.status === "IN_PROGRESS") {
                        resolve(new DeidentifyFileResponse({
                            runId: runId,
                            status: data.status,
                        }));
                    }
                    if (options?.getOutputDirectory() && data.status === "SUCCESS") {
                        this.processDeidentifyFileResponse(data, options.getOutputDirectory() as string, fileBaseName);
                    }
                    const deidentifiedFileResponse = this.parseDeidentifyFileResponse(data, runId, data.status);
                    resolve(deidentifiedFileResponse);
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
