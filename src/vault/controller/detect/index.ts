//imports

import path from "path";
import { DeidentifyTextRequest as DeidentifyTextRequest2,DeidentifyAudioRequest, DeidentifyAudioRequestFileDataFormat, DeidentifyDocumentRequest, DeidentifyDocumentRequestFileDataFormat, DeidentifyFileRequestFileDataFormat, DeidentifyImageRequest, DeidentifyImageRequestFileDataFormat, DeidentifyImageRequestMaskingMethod, DeidentifyPdfRequest, DeidentifyPresentationRequest, DeidentifyPresentationRequestFileDataFormat, DeidentifySpreadsheetRequest, DeidentifySpreadsheetRequestFileDataFormat, DeidentifyStructuredTextRequest, DeidentifyStructuredTextRequestFileDataFormat, DetectedEntity, EntityType, GetRunRequest, Transformations, DeidentifyStatusResponse } from "../../../ _generated_/rest/api";
import { DeidentifyFileRequest as  DeidentifyFileRequest2} from "../../../ _generated_/rest/api";
import { generateSDKMetrics, getBearerToken, MessageType, parameterizedString, printLog, removeSDKVersion, SDK_METRICS_HEADER_KEY, TYPES, DeidenitfyFileRequestTypes } from "../../../utils";
import logs from "../../../utils/logs";
import { validateDeidentifyFileRequest, validateDeIdentifyText } from "../../../utils/validations";
import { validateDeIdentifyTextRequest, validateReidentifyTextRequest } from "../../../utils/validations";
import VaultClient from "../../client";
import DeidentifyFileOptions from "../../model/options/deidentify-file";
import DeidentifyTextOptions from "../../model/options/deidentify-text";
import ReidentifyTextOptions from "../../model/options/reidentify-text";
import DeidentifyFileRequest from "../../model/request/deidentify-file";
import DeidentifyTextRequest from "../../model/request/deidentify-text";
import ReidentifyTextRequest from "../../model/request/reidentify-text";
import DeidentifyFileResponse from "../../model/response/deidentify-file";
import DeidentifiedTextResponse from "../../model/response/deidentify-text";
import DeidentifyTextResponse from "../../model/response/deidentify-text";
import * as fs from 'fs';
import SkyflowError from "../../../error";
import SKYFLOW_ERROR_CODE from "../../../error/codes";

const mime = require('mime-types');

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
    private buildAudioRequest(baseRequest: DeidentifyFileRequest, options?: DeidentifyFileOptions): DeidentifyAudioRequest {
        var audioRequest : DeidentifyAudioRequest = {
            file: {
                base64: baseRequest.getFile().base64 as string,
                data_format: baseRequest.getFile().format as DeidentifyAudioRequestFileDataFormat,
            },
            vault_id: this.client.vaultId,
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenType()?.getDefault(),
                entity_only: options?.getTokenType()?.getEntityOnly(),
                entity_unq_counter: options?.getTokenType()?.getEntityUnqCounter(),
            },
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: options?.getTransformations() as Transformations,
            output_transcription: options?.getOutputTranscription(),
            output_processed_audio: options?.getOutputProcessedAudio(),
            bleep_gain: options?.getBleep()?.getGain(),
            bleep_frequency: options?.getBleep()?.getFrequency(),
            bleep_start_padding: options?.getBleep()?.getStartPadding(),
            bleep_stop_padding: options?.getBleep()?.getStopPadding(),
        }
        return audioRequest;
    }
    private buildTextFileRequest(baseRequest: DeidentifyFileRequest, options?: DeidentifyFileOptions): DeidentifyTextRequest2 {
        var textFileRequest: DeidentifyTextRequest2 = {
            vault_id: this.client.vaultId,
            file: {
                base64: baseRequest.getFile().base64 as string,
                data_format: "txt",
            },
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenType()?.getDefault(),
                entity_only: options?.getTokenType()?.getEntityOnly(),
                entity_unq_counter: options?.getTokenType()?.getEntityUnqCounter(),
            },
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: options?.getTransformations() as Transformations,
        }
        return textFileRequest;
    }
    
    private buildPdfRequest(baseRequest: DeidentifyFileRequest, options?: DeidentifyFileOptions): DeidentifyPdfRequest {
        var pdfRequest: DeidentifyPdfRequest = {
            file: {
                base64: baseRequest.getFile().base64 as string,
                data_format: "pdf",
            },
            vault_id: this.client.vaultId,
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenType()?.getDefault(),
                entity_only: options?.getTokenType()?.getEntityOnly(),
                entity_unq_counter: options?.getTokenType()?.getEntityUnqCounter(),
            },
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: options?.getTransformations() as Transformations,
            max_resolution: options?.getMaxResolution(),
            density: options?.getDensity(),
        }
        return pdfRequest; 
    }
    
    private buildImageRequest(baseRequest: DeidentifyFileRequest, options?: DeidentifyFileOptions): DeidentifyImageRequest {
        var imageRequest: DeidentifyImageRequest = {
            vault_id: this.client.vaultId,
            file: {
                base64: baseRequest.getFile().base64 as string,
                data_format: baseRequest.getFile().format as DeidentifyImageRequestFileDataFormat,
            },
            allow_regex: options?.getAllowRegexList(),
            entity_types: options?.getEntities() as EntityType[],
            masking_method: options?.getMaskingMethod() as DeidentifyImageRequestMaskingMethod,
            output_ocr_text: options?.getOutputOcrText(),
            output_processed_image: options?.getOutputProcessedImage(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: options?.getTransformations() as Transformations,
            token_type: {
                default: options?.getTokenType()?.getDefault(),
                entity_only: options?.getTokenType()?.getEntityOnly(),
                entity_unq_counter: options?.getTokenType()?.getEntityUnqCounter(),
            }
        };

        return imageRequest; 
    }
    
    private buildPptRequest(baseRequest: DeidentifyFileRequest, options?: DeidentifyFileOptions): DeidentifyPresentationRequest {
        var pptRequest: DeidentifyPresentationRequest = {
            vault_id: this.client.vaultId,
            file: {
                base64: baseRequest.getFile().base64 as string,
                data_format: baseRequest.getFile().format as DeidentifyPresentationRequestFileDataFormat,
            },
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenType()?.getDefault(),
                entity_only: options?.getTokenType()?.getEntityOnly(),
                entity_unq_counter: options?.getTokenType()?.getEntityUnqCounter(),
            },
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: options?.getTransformations() as Transformations,
        };
        return pptRequest;
    }
    
    private buildSpreadsheetRequest(baseRequest: DeidentifyFileRequest, options?: DeidentifyFileOptions): DeidentifySpreadsheetRequest {
        var spreadsheetRequest: DeidentifySpreadsheetRequest = {
            vault_id: this.client.vaultId,
            file: {
                base64: baseRequest.getFile().base64 as string,
                data_format: baseRequest.getFile().format as DeidentifySpreadsheetRequestFileDataFormat,
            },
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenType()?.getDefault(),
                entity_only: options?.getTokenType()?.getEntityOnly(),
                entity_unq_counter: options?.getTokenType()?.getEntityUnqCounter(),
            },
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: options?.getTransformations() as Transformations,
        };
        return spreadsheetRequest;
    }
    
    private buildStructuredTextRequest(baseRequest: DeidentifyFileRequest, options?: DeidentifyFileOptions): DeidentifyStructuredTextRequest {
        var structuredTextRequest: DeidentifyStructuredTextRequest = {
            vault_id: this.client.vaultId,
            file: {
                base64: baseRequest.getFile().base64 as string,
                data_format: baseRequest.getFile().format as DeidentifyStructuredTextRequestFileDataFormat,
            },
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenType()?.getDefault(),
                entity_only: options?.getTokenType()?.getEntityOnly(),
                entity_unq_counter: options?.getTokenType()?.getEntityUnqCounter(),
            },
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: options?.getTransformations() as Transformations,
        };
        return structuredTextRequest; 
    }
    
    private buildDocumentRequest(baseRequest: DeidentifyFileRequest, options?: DeidentifyFileOptions): DeidentifyDocumentRequest {
        var documentRequest: DeidentifyDocumentRequest = {
            vault_id: this.client.vaultId,
            file: {
                base64: baseRequest.getFile().base64 as string,
                data_format: baseRequest.getFile().format as DeidentifyDocumentRequestFileDataFormat,
            },
            entity_types: options?.getEntities() as EntityType[],
            token_type: {
                default: options?.getTokenType()?.getDefault(),
                entity_only: options?.getTokenType()?.getEntityOnly(),
                entity_unq_counter: options?.getTokenType()?.getEntityUnqCounter(),
            },
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: options?.getTransformations() as Transformations,
        };
        return documentRequest;
    }
    
    private buildGenericFileRequest(baseRequest: DeidentifyFileRequest, options?: DeidentifyFileOptions): DeidentifyFileRequest2 {
        var genericRequest: DeidentifyFileRequest2 = {
                vault_id: this.client.vaultId,
                file: {
                    base64: baseRequest.getFile().base64 as string,
                    data_format: baseRequest.getFile().format as DeidentifyAudioRequestFileDataFormat,
                },
                token_type: {
                    default: options?.getTokenType()?.getDefault(),
                    entity_only: options?.getTokenType()?.getEntityOnly(),
                    entity_unq_counter: options?.getTokenType()?.getEntityUnqCounter(),
                },
                allow_regex: options?.getAllowRegexList(),
                restrict_regex: options?.getRestrictRegexList(),
                transformations: options?.getTransformations() as Transformations,
                entity_types: options?.getEntities() as EntityType[],
        }
        return genericRequest;
    }

    private buildDeidentifyTextRequest(request: DeidentifyTextRequest, options?: DeidentifyTextOptions) {
        return {
            vault_id: this.client.vaultId,
            text: request.text,
            entity_types: options?.getEntities() as EntityType[],
            allow_regex: options?.getAllowRegexList(),
            restrict_regex: options?.getRestrictRegexList(),
            transformations: options?.getTransformations() as Transformations,
        };
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

    private processDeidentifyFileResponse(response: any, outputDirectory: string) {
        try {
            // Ensure the output directory exists
            if (!fs.existsSync(outputDirectory)) {
                fs.mkdirSync(outputDirectory, { recursive: true });
            }
    
            // Iterate over the output array in the response
            response.output.forEach((fileObject: any, index: number) => {
                const { processedFile, processedFileType, processedFileExtension } = fileObject;
    
                if (!processedFile || !processedFileExtension) {
                    return;
                }
    
                // Determine the output file name and path
                const outputFileName = `processed-file-${processedFileType}.${processedFileExtension}`;
                const outputFilePath = path.join(outputDirectory, outputFileName);
    
                // Handle JSON files
                if (processedFileExtension === 'json') {
                    const jsonData = Buffer.from(processedFile, 'base64').toString('utf-8');
                    fs.writeFileSync(outputFilePath, jsonData);
                } else {
                    // Handle other file types (e.g., images, PDFs, etc.)
                    this.decodeBase64AndSaveToFile(processedFile, outputFilePath);
                }
            });
            } catch (error) {
            throw error;
        }
    }
    
    // private getFileExtension(request: DeidentifyFileRequest): string {
    //     let fileType: string = '';
    
    //     // Check if path is present and base64 is not present
    //     if (request.getFile().path && !request.getFile().base64) {
    //         try {
    //             const fileBuffer = fs.readFileSync(request.getFile().path ?? '');
    
    //             // Extract file type from the file path
    //             const fileExtension = request.getFile().path?.split('.').pop() ?? '';
    //             if (fileExtension) {
    //                 fileType = fileExtension.toLowerCase();
    //             } else {
    //                 throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
    //             }
    
    //             // Convert file to base64
    //             request.getFile().base64 = fileBuffer.toString('base64');
    //         } catch (error) {
    //             throw new SkyflowError(SKYFLOW_ERROR_CODE.FILE_READ_ERROR);
    //         }
    //     } else if (request.getFile().base64) {
    //         // Extract file type from base64 header
    //         const base64Header = request.getFile().base64?.split(',')[0];
    //         const match = base64Header?.match(/data:(.*?);base64/);
    //         if (match && match[1]) {
    //             fileType = match[1].split('/')[1]; // Extract the file type (e.g., "png", "jpeg")
    //         } else {
    //             throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_BASE64_HEADER);
    //         }
    //     }
    
    //     if (!fileType) {
    //         throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
    //     }
    
    //     return fileType;
    // }
    private getFileExtension(file: File | Buffer): string {
        if (file instanceof File) {
            // Extract file extension from the File object
            const fileName = file.name;
            const fileExtension = fileName.split('.').pop();
            if (!fileExtension) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
            }
            return fileExtension.toLowerCase();
        } else if (file instanceof Buffer) {
            // Use mime-types to determine the file type from the Buffer
            const mimeType = mime.lookup(file);
            if (!mimeType) {
                throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
            }
            return mime.extension(mimeType) ?? '';
        }
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
    }
    private async convertFileToBase64(file: File | Buffer): Promise<string> {
        if (file instanceof File) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string).split(',')[1]); // Remove base64 header
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        } else if (file instanceof Buffer) {
            return file.toString('base64');
        }
        throw new SkyflowError(SKYFLOW_ERROR_CODE.INVALID_FILE_TYPE);
    }
    private getFileType(extension: string): string {
        const mimeType = mime.lookup(extension); // 'image/jpeg'
        console.log(`MIME type for .${extension}:`, mimeType);
        return mimeType;
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
                            case TYPES.DEIDENTIFY_FILE:
                                const req: GetRunRequest = {
                                    vault_id: this.client.vaultId,
                                }
                                // setTimeout(() => {
                                // }, 3000);
                                this.client.filesAPI.getRun(data.run_id, req).then((response: any) => {
                                    resolve(response);
                                }).catch((error: any) => {
                                    reject(error);
                                });    
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
            transformations: {
                shift_dates: {
                    max_days: options?.getTransformations()?.getShiftDays()?.max,
                    min_days: options?.getTransformations()?.getShiftDays()?.min,
                    entity_types: options?.getTransformations()?.getShiftDays()?.entities,
                }
            } as Transformations,
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
                    resolve(new DeidentifyTextResponse({
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
    deidentifyFile(request: DeidentifyFileRequest, options?: DeidentifyFileOptions): Promise<DeidentifyFileResponse> {
        return new Promise((resolve, reject) => {
            try {
                printLog(logs.infoLogs.DETECT_FILE_TRIGGERED, MessageType.LOG, this.client.getLogLevel());
                printLog(logs.infoLogs.VALIDATE_DETECT_FILE_INPUT, MessageType.LOG, this.client.getLogLevel());
                validateDeidentifyFileRequest(request, options, this.client.getLogLevel());
                var file: string = ""
                if (!request.getFile().format) {
                     request.getFile().format = this.getFileExtension(request);
                }
                if (request.getFile().path && !request.getFile().base64) {
                    request.getFile().base64 = fs.readFileSync(request.getFile().path ?? '').toString('base64');
                }
                // this.convertFileToBase64(file).then((base64) => {
                // }).catch((error) => {
                // });

                var reqType : DeidenitfyFileRequestTypes = this.getReqType(request.getFile().format ?? ''); 
                var promiseReq: Promise<any>;
                switch (reqType){
                    case DeidenitfyFileRequestTypes.AUDIO:
                        const audioReq = this.buildAudioRequest(request, options);
                        promiseReq = this.handleRequest(
                            () => this.client.filesAPI.deidentifyAudio(
                                audioReq
                            ).withRawResponse(),
                            TYPES.DEIDENTIFY_FILE)
                        break;
                    case DeidenitfyFileRequestTypes.TEXT:
                        const textFileReq = this.buildTextFileRequest(request, options);
                        promiseReq = this.handleRequest(
                            () => this.client.filesAPI.deidentifyText(
                                textFileReq
                            ).withRawResponse(),
                            TYPES.DEIDENTIFY_FILE)
                        break;    
                    case DeidenitfyFileRequestTypes.PDF:
                        const pdfReq = this.buildPdfRequest(request, options);
                        promiseReq = this.handleRequest(
                            () => this.client.filesAPI.deidentifyPdf(
                                pdfReq
                            ).withRawResponse(),
                            TYPES.DEIDENTIFY_FILE)
                        break;
                    case DeidenitfyFileRequestTypes.IMAGE:
                        const imageReq = this.buildImageRequest(request, options);
                        promiseReq = this.handleRequest(
                            () => this.client.filesAPI.deidentifyImage(
                                imageReq
                            ).withRawResponse(),
                            TYPES.DEIDENTIFY_FILE)
                        break;
                    case DeidenitfyFileRequestTypes.PPT:
                        const pptReq = this.buildPptRequest(request, options);
                        promiseReq = this.handleRequest(
                            () => this.client.filesAPI.deidentifyPresentation(
                                pptReq
                            ).withRawResponse(),
                            TYPES.DEIDENTIFY_FILE)
                        break;
                    case DeidenitfyFileRequestTypes.SPREADSHEET:
                        const spreadsheetReq = this.buildSpreadsheetRequest(request, options);
                        promiseReq = this.handleRequest(
                            () => this.client.filesAPI.deidentifySpreadsheet(
                                spreadsheetReq
                            ).withRawResponse(),
                            TYPES.DEIDENTIFY_FILE)
                        break;
                    case DeidenitfyFileRequestTypes.STRUCTURED_TEXT:
                        const structuredTextReq = this.buildStructuredTextRequest(request, options);
                        promiseReq = this.handleRequest(
                            () => this.client.filesAPI.deidentifyStructuredText(
                                structuredTextReq
                            ).withRawResponse(),
                            TYPES.DEIDENTIFY_FILE)
                        break;
                    case DeidenitfyFileRequestTypes.DOCUMENT:
                        const documentReq = this.buildDocumentRequest(request, options);
                        promiseReq = this.handleRequest(
                            () => this.client.filesAPI.deidentifyDocument(
                                documentReq
                            ).withRawResponse(),
                            TYPES.DEIDENTIFY_FILE)
                        break;
                    case DeidenitfyFileRequestTypes.FILE:
                        const genericReq = this.buildGenericFileRequest(request, options);
                        promiseReq = this.handleRequest(
                            () => this.client.filesAPI.deidentifyFile(
                                genericReq
                            ).withRawResponse(),
                            TYPES.DEIDENTIFY_FILE)
                        break;
                    default:
                        const defaultReq = this.buildGenericFileRequest(request, options);
                        promiseReq = this.handleRequest(
                            () => this.client.filesAPI.deidentifyFile(
                                defaultReq
                            ).withRawResponse(),
                            TYPES.DEIDENTIFY_FILE)
                        break;                    
                }

                promiseReq.then(data => {
                    
                    if (options?.getOutputDirectory() && data.status === "SUCCESS") {
                        this.processDeidentifyFileResponse(data, options.getOutputDirectory() as string);
                    }
                    console.log("response", data);
                    const deidentifiedFileResponse = new DeidentifyFileResponse(
                        {
                            file: data.output[0]?.processedFile ?? '',
                            type: data.output[0]?.processedFileType ?? '',
                            extension: data.output[0]?.processedFileExtension ?? '',
                            wordCount: data.wordCharacterCount?.wordCount ?? 0,
                            charCount: data.wordCharacterCount?.characterCount ?? 0,
                            sizeInKb: data.size ?? 0,
                            durationInSeconds: data.duration ?? 0,
                            pageCount: data.pages ?? 0,
                            slideCount: data.slides ?? 0,
                            entities: data.output
                                .filter((fileObject: any) => fileObject.processedFileType === 'entities') // Filter for 'entities'
                                .map((fileObject: any) => ({
                                    file: fileObject.processedFile,
                                    extension: fileObject.processedFileExtension,
                            })),
                        }
                    )
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
