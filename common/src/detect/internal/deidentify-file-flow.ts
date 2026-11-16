// Everything `deidentifyFile` does after the submit call, shared by every SDK: decide whether to
// poll, poll, merge the run into the response, and write outputs for local-file requests. Each
// controller performs the submit itself and hands the run id here.
import { LogLevel, MessageType, parameterizedString, printLog } from "../../utils";
import logs from "../../utils/logs";
import { DetectRunStatus } from "../types";
import DeidentifyFileRequest from "../model/request/deidentify-file";
import DeidentifyFileResponse from "../model/response/deidentify-file";
import { localFileName } from "./request-mapper";
import { submittedDeidentifyFileResponse, toDeidentifyFileResponse } from "./response-mapper";
import { pollRun, RunFetcher, Sleeper } from "./run-poller";
import { writeOutputs } from "./file-output-writer";

/** @internal */
export async function completeDeidentifyFile(
    request: DeidentifyFileRequest,
    runId: string | null,
    fetcher: RunFetcher,
    logLevel: LogLevel = LogLevel.ERROR,
    sleeper?: Sleeper,
): Promise<DeidentifyFileResponse> {
    if (!request.pollOptions || !runId) {
        printLog(
            parameterizedString(logs.infoLogs.DEIDENTIFY_FILE_RUN_SUBMITTED, String(runId)),
            MessageType.LOG,
            logLevel,
        );
        return submittedDeidentifyFileResponse(runId);
    }
    const run = await pollRun(runId, request.pollOptions, fetcher, logLevel, sleeper);
    const response = toDeidentifyFileResponse(runId, run);
    const inputName = localFileName(request);
    if (response.status === DetectRunStatus.SUCCESS && inputName) {
        await writeOutputs(response.output, response.outputType, inputName, request.outputDirectory, logLevel);
    }
    return response;
}
