// Polls a Detect file run until it reaches a terminal status or the PollOptions budget is used up.
// Shared by every SDK: the caller supplies how a run is fetched, so each controller plugs in its
// own `getRun`.
//
// Backoff is exponential, 1, 2, 4, 8, 16 then 32 seconds between lookups, with the last sleep
// trimmed so the total never exceeds `waitTime`. The first lookup happens immediately after the
// submit. SUCCESS, FAILED and UNKNOWN are terminal; every other status keeps polling.
import { LogLevel, MessageType, parameterizedString, printLog } from "../../utils";
import logs from "../../utils/logs";
import { DetectRunStatus, POLL_OPTIONS, PollOptions } from "../types";
import GetRunResponse from "../model/response/get-run";

/** Fetches the current state of a run. @internal */
export type RunFetcher = (runId: string) => Promise<GetRunResponse>;

/** Pauses for the given number of milliseconds. Replaceable in tests. @internal */
export type Sleeper = (millis: number) => Promise<void>;

const defaultSleeper: Sleeper = (millis) => new Promise((resolve) => setTimeout(resolve, millis));

const TERMINAL = new Set<DetectRunStatus>([DetectRunStatus.SUCCESS, DetectRunStatus.FAILED, DetectRunStatus.UNKNOWN]);

/** @internal */
export function effectiveWaitTime(options: PollOptions | undefined): number {
    return options?.waitTime ?? POLL_OPTIONS.DEFAULT_WAIT_TIME_SECONDS;
}

/** @internal */
export function effectiveMaxAttempts(options: PollOptions | undefined): number {
    return options?.maxAttempts ?? POLL_OPTIONS.DEFAULT_MAX_ATTEMPTS;
}

/**
 * @param runId   run to poll
 * @param options wait time and attempt limit, defaults applied
 * @param fetcher how to look the run up
 * @returns the terminal run, or the last non-terminal run seen when the budget ran out
 * @throws SkyflowError if a lookup fails
 * @internal
 */
export async function pollRun(
    runId: string,
    options: PollOptions | undefined,
    fetcher: RunFetcher,
    logLevel: LogLevel = LogLevel.ERROR,
    sleeper: Sleeper = defaultSleeper,
): Promise<GetRunResponse> {
    const waitTime = effectiveWaitTime(options);
    const maxAttempts = effectiveMaxAttempts(options);
    printLog(
        parameterizedString(logs.infoLogs.POLL_RUN_STARTED, runId, String(waitTime), String(maxAttempts)),
        MessageType.LOG,
        logLevel,
    );

    let elapsedSeconds = 0;
    let delaySeconds = 1;
    let attempts = 0;
    for (;;) {
        let run = await fetcher(runId);
        attempts += 1;
        if (!run || !run.status) {
            // A fetcher that reports nothing is treated as an unknown, terminal state.
            run = new GetRunResponse({
                runId,
                status: DetectRunStatus.UNKNOWN,
                outputType: null,
                output: [],
                metrics: null,
                message: null,
            });
        }
        const status = run.status as DetectRunStatus;
        if (TERMINAL.has(status)) {
            printLog(
                parameterizedString(logs.infoLogs.POLL_RUN_TERMINAL, runId, status, String(attempts)),
                MessageType.LOG,
                logLevel,
            );
            return run;
        }
        if (attempts >= maxAttempts || elapsedSeconds >= waitTime) {
            printLog(
                parameterizedString(logs.infoLogs.POLL_RUN_BUDGET_EXHAUSTED, runId, status, String(attempts), String(elapsedSeconds)),
                MessageType.LOG,
                logLevel,
            );
            return run;
        }
        const sleepSeconds = Math.min(delaySeconds, waitTime - elapsedSeconds);
        await sleeper(sleepSeconds * 1000);
        elapsedSeconds += sleepSeconds;
        delaySeconds = Math.min(delaySeconds * 2, POLL_OPTIONS.MAX_DELAY_SECONDS);
    }
}
