// SK-2963: beta-build-in-prod warning.
//
// Mocking package.json (rather than just unit-testing isNonGaVersion/anyVaultIsProd in
// isolation, as utils.test.js does) lets us exercise the real end-to-end wiring in the
// Skyflow constructor against a fake non-GA version, which Java's equivalent test can't
// do against its own real (immutable, statically-filtered) SDK_VERSION constant.
jest.mock('../../../package.json', () => ({
    name: 'skyflow-node',
    version: '99.0.0-beta.1',
}));

import { LogLevel, Skyflow, Env } from '../../../src';

describe('Skyflow beta-build-in-prod warning (SK-2963)', () => {
    const credentials = { apiKey: "sky-key" };

    beforeEach(() => {
        jest.clearAllMocks();
        global.console = {
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
        };
    });

    test('warns when a non-GA build has a vault defaulting to PROD', () => {
        new Skyflow({
            vaultConfigs: [{ vaultId: 'v1', clusterId: 'c1', credentials }],
            logLevel: LogLevel.WARN,
        });

        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining('beta/pre-release build')
        );
    });

    test('warns when a non-GA build has an explicit PROD vault among others', () => {
        new Skyflow({
            vaultConfigs: [
                { vaultId: 'v1', clusterId: 'c1', credentials, env: Env.SANDBOX },
                { vaultId: 'v2', clusterId: 'c2', credentials, env: Env.PROD },
            ],
            logLevel: LogLevel.WARN,
        });

        expect(console.warn).toHaveBeenCalledWith(
            expect.stringContaining('beta/pre-release build')
        );
    });

    test('does not warn when every vault is non-PROD', () => {
        new Skyflow({
            vaultConfigs: [{ vaultId: 'v1', clusterId: 'c1', credentials, env: Env.SANDBOX }],
            logLevel: LogLevel.WARN,
        });

        expect(console.warn).not.toHaveBeenCalledWith(
            expect.stringContaining('beta/pre-release build')
        );
    });

    test('does not warn when the log level suppresses WARN', () => {
        new Skyflow({
            vaultConfigs: [{ vaultId: 'v1', clusterId: 'c1', credentials, env: Env.PROD }],
            logLevel: LogLevel.ERROR,
        });

        expect(console.warn).not.toHaveBeenCalled();
    });
});
