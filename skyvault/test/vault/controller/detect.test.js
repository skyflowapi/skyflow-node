import DetectController from '../../../src/vault/controller/detect';
import VaultClient from '../../../src/vault/client';
import { DeidentifySourceType, ReidentifySourceType } from '../../../src/vault/detect/types';
import {
    AuthType,
    BaseDetectController,
    EntityType,
    GetRunRequest,
    LogLevel,
    RedactionType,
    ReidentifyFileRequest,
    getBearerToken,
} from 'skyflow-common';

jest.mock('skyflow-common', () => {
    const actual = jest.requireActual('skyflow-common');
    return {
        ...actual,
        printLog: jest.fn(),
        getBearerToken: jest.fn(),
    };
});

describe('skyvault DetectController', () => {
    test('extends the shared BaseDetectController and is built from a VaultClient', () => {
        const client = new VaultClient('https://abc.vault.skyflowapis.com', 'vault123', { apiKey: 'sky-key' }, undefined, LogLevel.ERROR);
        const controller = new DetectController(client);
        expect(controller).toBeInstanceOf(BaseDetectController);
        for (const method of ['deidentifyString', 'deidentifyFile', 'reidentifyString', 'reidentifyFile', 'getRun', 'checkGuardrails']) {
            expect(typeof controller[method]).toBe('function');
        }
    });

    test('VaultClient.resolveAuthToken resolves through getBearerToken and caches the auth info', async () => {
        getBearerToken.mockResolvedValue({ key: 'tok-abc', type: AuthType.API_KEY });
        const client = new VaultClient('https://abc.vault.skyflowapis.com', 'vault123', { apiKey: 'sky-key' }, undefined, LogLevel.ERROR);
        await expect(client.resolveAuthToken()).resolves.toBe('tok-abc');
        expect(getBearerToken).toHaveBeenCalledWith({ apiKey: 'sky-key' }, LogLevel.ERROR);
        expect(client.authInfo).toEqual({ key: 'tok-abc', type: AuthType.API_KEY });
        // The cached API key is reused on the next resolution.
        expect(client.getCredentials()).toEqual({ apiKey: 'tok-abc' });
    });

    test('ships the skyvault source enums: SKYFLOW_ID for de-identification only', () => {
        expect(Object.values(DeidentifySourceType)).toEqual(['BASE64', 'SKYFLOW_ID', 'PRESIGNED_URL']);
        expect(Object.values(ReidentifySourceType)).toEqual(['BASE64', 'PRESIGNED_URL']);
        expect(ReidentifySourceType.SKYFLOW_ID).toBeUndefined();
    });

    test('resolves run and re-identification output types onto the skyvault enums, unknown values to null', () => {
        const client = new VaultClient('https://abc.vault.skyflowapis.com', 'vault123', { apiKey: 'sky-key' }, undefined, LogLevel.ERROR);
        const controller = new DetectController(client);
        expect(controller.toDeidentifySource('SKYFLOW_ID')).toBe(DeidentifySourceType.SKYFLOW_ID);
        expect(controller.toDeidentifySource('BASE64')).toBe(DeidentifySourceType.BASE64);
        expect(controller.toDeidentifySource('FILE')).toBeNull();
        expect(controller.toDeidentifySource(null)).toBeNull();
        expect(controller.toReidentifySource('PRESIGNED_URL')).toBe(ReidentifySourceType.PRESIGNED_URL);
        expect(controller.toReidentifySource('SKYFLOW_ID')).toBeNull();
    });

    test('getRun and reidentifyFile surface the resolved output type', async () => {
        const client = new VaultClient('https://abc.vault.skyflowapis.com', 'vault123', { apiKey: 'sky-key' }, undefined, LogLevel.ERROR);
        client.resolveAuthToken = jest.fn().mockResolvedValue('tok');
        const controller = new DetectController(client);
        const files = { getRunV2: jest.fn(), reidentifyFileV2: jest.fn() };
        controller.files = () => files;

        files.getRunV2.mockResolvedValue({ status: 'SUCCESS', outputType: 'SKYFLOW_ID', output: [] });
        expect((await controller.getRun(new GetRunRequest('run-1'))).outputType).toBe(DeidentifySourceType.SKYFLOW_ID);

        files.reidentifyFileV2.mockResolvedValue({ status: 'SUCCESS', outputType: 'PRESIGNED_URL', output: [] });
        const reid = await controller.reidentifyFile(
            new ReidentifyFileRequest(ReidentifySourceType.PRESIGNED_URL, 'https://u', {
                redactionLevel: [{ entityName: EntityType.NAME, redactionType: RedactionType.MASKED }],
            }),
        );
        expect(reid.outputType).toBe(ReidentifySourceType.PRESIGNED_URL);
        expect(files.reidentifyFileV2.mock.calls[0][0].redactionLevel).toEqual([{ entityName: 'NAME', redactionType: 'MASKED' }]);
    });
});
