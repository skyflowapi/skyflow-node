import { pollRun, effectiveWaitTime, effectiveMaxAttempts } from '../../src/detect/internal/run-poller';
import GetRunResponse from '../../src/detect/model/response/get-run';
import { DetectRunStatus, POLL_OPTIONS } from '../../src/detect/types';

const run = (status, extra = {}) =>
    new GetRunResponse({ runId: 'run-1', status, outputType: null, output: [], metrics: null, message: null, ...extra });

/** A fetcher that returns the given statuses in order, then repeats the last one. */
function sequence(statuses) {
    let i = 0;
    const fetcher = jest.fn(async () => {
        const s = statuses[Math.min(i, statuses.length - 1)];
        i += 1;
        return s === null ? null : run(s);
    });
    return fetcher;
}

function fakeSleeper() {
    const sleeps = [];
    const sleeper = jest.fn(async (ms) => {
        sleeps.push(ms);
    });
    return { sleeper, sleeps };
}

describe('effective defaults', () => {
    test('fall back to the documented defaults', () => {
        expect(effectiveWaitTime(undefined)).toBe(POLL_OPTIONS.DEFAULT_WAIT_TIME_SECONDS);
        expect(effectiveMaxAttempts(undefined)).toBe(POLL_OPTIONS.DEFAULT_MAX_ATTEMPTS);
        expect(effectiveWaitTime({ waitTime: 5 })).toBe(5);
        expect(effectiveMaxAttempts({ maxAttempts: 2 })).toBe(2);
    });
});

describe('pollRun', () => {
    test('returns immediately on a terminal first lookup without sleeping', async () => {
        for (const terminal of [DetectRunStatus.SUCCESS, DetectRunStatus.FAILED, DetectRunStatus.UNKNOWN]) {
            const fetcher = sequence([terminal]);
            const { sleeper, sleeps } = fakeSleeper();
            const out = await pollRun('run-1', {}, fetcher, undefined, sleeper);
            expect(out.status).toBe(terminal);
            expect(fetcher).toHaveBeenCalledTimes(1);
            expect(sleeps).toEqual([]);
        }
    });

    test('backs off 1, 2, 4, 8, 16, 32, 32 seconds between lookups until terminal', async () => {
        const fetcher = sequence(['QUEUED', 'IN_PROGRESS', 'IN_PROGRESS', 'IN_PROGRESS', 'IN_PROGRESS', 'IN_PROGRESS', 'IN_PROGRESS', 'SUCCESS']);
        const { sleeper, sleeps } = fakeSleeper();
        const out = await pollRun('run-1', { waitTime: 300, maxAttempts: 23 }, fetcher, undefined, sleeper);
        expect(out.status).toBe(DetectRunStatus.SUCCESS);
        expect(fetcher).toHaveBeenCalledTimes(8);
        expect(sleeps).toEqual([1000, 2000, 4000, 8000, 16000, 32000, 32000]);
    });

    test('trims the last sleep so the total never exceeds waitTime, then returns the non-terminal run', async () => {
        const fetcher = sequence(['IN_PROGRESS']);
        const { sleeper, sleeps } = fakeSleeper();
        const out = await pollRun('run-1', { waitTime: 5, maxAttempts: 23 }, fetcher, undefined, sleeper);
        expect(out.status).toBe(DetectRunStatus.IN_PROGRESS);
        // 1 + 2 = 3 elapsed; next delay would be 4 but only 2 remain.
        expect(sleeps).toEqual([1000, 2000, 2000]);
        expect(fetcher).toHaveBeenCalledTimes(4);
    });

    test('stops after maxAttempts lookups', async () => {
        const fetcher = sequence(['QUEUED']);
        const { sleeper, sleeps } = fakeSleeper();
        const out = await pollRun('run-1', { waitTime: 300, maxAttempts: 3 }, fetcher, undefined, sleeper);
        expect(out.status).toBe(DetectRunStatus.QUEUED);
        expect(fetcher).toHaveBeenCalledTimes(3);
        expect(sleeps).toEqual([1000, 2000]);
    });

    test('a fetcher that returns nothing is treated as an UNKNOWN terminal run', async () => {
        const fetcher = sequence([null]);
        const { sleeper } = fakeSleeper();
        const out = await pollRun('run-1', {}, fetcher, undefined, sleeper);
        expect(out.status).toBe(DetectRunStatus.UNKNOWN);
        expect(out.runId).toBe('run-1');
    });

    test('propagates a fetcher failure', async () => {
        const fetcher = jest.fn(async () => {
            throw new Error('lookup failed');
        });
        const { sleeper } = fakeSleeper();
        await expect(pollRun('run-1', {}, fetcher, undefined, sleeper)).rejects.toThrow('lookup failed');
    });
});
