jest.mock('skyflow-common', () => {
  const actual = jest.requireActual('skyflow-common');
  return { ...actual, getBearerToken: jest.fn() };
});

import {
  AuthType,
  BaseDetectController,
  DeidentifySourceType,
  Env,
  GetRunRequest,
  LogLevel,
  ReidentifyFileRequest,
  ReidentifySourceType,
  Skyflow,
  getBearerToken,
} from '../../src';
import DetectController from '../../src/controller/detect';
import VaultClient from '../../src/client';
import { silenceConsole } from '../helpers';

silenceConsole();

const getBearerTokenMock = getBearerToken as unknown as jest.Mock;

describe('flowvault DetectController', () => {
  it('extends the shared BaseDetectController and exposes every Detect V2 method', () => {
    const client = new VaultClient('https://abc.skyvault.skyflowapis.com', 'vault123', { apiKey: 'sky-key' }, undefined, LogLevel.ERROR);
    const controller = new DetectController(client);
    expect(controller).toBeInstanceOf(BaseDetectController);
    for (const method of ['deidentifyString', 'deidentifyFile', 'reidentifyString', 'reidentifyFile', 'getRun', 'checkGuardrails']) {
      expect(typeof (controller as unknown as Record<string, unknown>)[method]).toBe('function');
    }
  });

  it('VaultClient.resolveAuthToken returns the token resolved by getToken', async () => {
    getBearerTokenMock.mockResolvedValue({ key: 'tok-1', type: AuthType.TOKEN });
    const client = new VaultClient('https://abc.skyvault.skyflowapis.com', 'vault123', { apiKey: 'sky-key' }, undefined, LogLevel.ERROR);
    await expect(client.resolveAuthToken()).resolves.toBe('tok-1');
    expect(getBearerTokenMock).toHaveBeenCalledTimes(1);
  });

  it('Skyflow.detect(id) and detect() return the DetectController of the vault', () => {
    const sky = new Skyflow({
      vaultConfigs: [
        { vaultId: 'vault123', clusterId: 'abc', env: Env.PROD, credentials: { apiKey: 'sky-key' } },
        { vaultId: 'vault456', clusterId: 'abc', env: Env.PROD, credentials: { apiKey: 'sky-key' } },
      ],
      logLevel: LogLevel.ERROR,
    });
    expect(sky.detect('vault123')).toBeInstanceOf(DetectController);
    expect(sky.detect('vault456')).toBeInstanceOf(DetectController);
    expect(sky.detect()).toBe(sky.detect('vault123'));
    expect(sky.detect('vault123')).not.toBe(sky.detect('vault456'));
  });

  it('ships the flowvault source enums: no SKYFLOW_ID for de-identification, none for re-identification', () => {
    expect(Object.values(DeidentifySourceType)).toEqual(['BASE64', 'PRESIGNED_URL']);
    expect(Object.values(ReidentifySourceType)).toEqual(['BASE64', 'PRESIGNED_URL']);
    expect((DeidentifySourceType as Record<string, string>).SKYFLOW_ID).toBeUndefined();
  });

  it('resolves run and re-identification output types onto the flowvault enums, unknown values to null', () => {
    const client = new VaultClient('https://abc.skyvault.skyflowapis.com', 'vault123', { apiKey: 'sky-key' }, undefined, LogLevel.ERROR);
    const controller = new DetectController(client) as unknown as {
      toDeidentifySource(value: string | null | undefined): DeidentifySourceType | null;
      toReidentifySource(value: string | null | undefined): ReidentifySourceType | null;
    };
    expect(controller.toDeidentifySource('BASE64')).toBe(DeidentifySourceType.BASE64);
    expect(controller.toDeidentifySource('PRESIGNED_URL')).toBe(DeidentifySourceType.PRESIGNED_URL);
    // A skyvault-only value is not something a flowvault user can be handed.
    expect(controller.toDeidentifySource('SKYFLOW_ID')).toBeNull();
    expect(controller.toDeidentifySource(null)).toBeNull();
    expect(controller.toReidentifySource('PRESIGNED_URL')).toBe(ReidentifySourceType.PRESIGNED_URL);
    expect(controller.toReidentifySource('SKYFLOW_ID')).toBeNull();
    expect(controller.toReidentifySource(undefined)).toBeNull();
  });

  it('getRun and reidentifyFile surface the resolved output type', async () => {
    const client = new VaultClient('https://abc.skyvault.skyflowapis.com', 'vault123', { apiKey: 'sky-key' }, undefined, LogLevel.ERROR);
    client.resolveAuthToken = jest.fn().mockResolvedValue('tok');
    const controller = new DetectController(client);
    const files = { getRunV2: jest.fn(), reidentifyFileV2: jest.fn() };
    (controller as unknown as { files(): unknown }).files = () => files;

    files.getRunV2.mockResolvedValue({ status: 'SUCCESS', outputType: 'PRESIGNED_URL', output: [] });
    const run = await controller.getRun(new GetRunRequest('run-1'));
    expect(run.outputType).toBe(DeidentifySourceType.PRESIGNED_URL);

    files.getRunV2.mockResolvedValue({ status: 'SUCCESS', outputType: 'SKYFLOW_ID', output: [] });
    expect((await controller.getRun(new GetRunRequest('run-2'))).outputType).toBeNull();

    files.reidentifyFileV2.mockResolvedValue({ status: 'SUCCESS', outputType: 'BASE64', output: [] });
    const reid = await controller.reidentifyFile(
      new ReidentifyFileRequest(ReidentifySourceType.BASE64, 'YWJj', { redactionLevel: [{ tokenGroupName: 'NAME', redactionPattern: 'mask1' }] }),
    );
    expect(reid.outputType).toBe(ReidentifySourceType.BASE64);
    expect(files.reidentifyFileV2.mock.calls[0][0].redactionLevel).toEqual([{ tokenGroupName: 'NAME', redactionPattern: 'mask1' }]);
  });
});
