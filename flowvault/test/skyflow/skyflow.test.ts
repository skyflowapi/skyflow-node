import {
  Skyflow,
  Env,
  LogLevel,
  SkyflowError,
  SKYFLOW_ERROR_CODE,
  getSdkIdentity,
  parameterizedString,
} from '../../src';
import VaultController from '../../src/controller/vault';
import { silenceConsole } from '../helpers';

silenceConsole();

const vaultConfig = (vaultId: string, clusterId = 'abc-cluster') => ({
  vaultId,
  clusterId,
  env: Env.PROD,
  credentials: { apiKey: 'sky-dummy-key' },
});

function newSkyflow(vaultIds: string[] = ['vault123'], logLevel: LogLevel = LogLevel.ERROR): Skyflow {
  return new Skyflow({ vaultConfigs: vaultIds.map((id) => vaultConfig(id)), logLevel });
}

/** Read the registry entry's VaultClient (private, accessed for assertions). */
function clientOf(sky: Skyflow, vaultId: string): { getLogLevel: () => LogLevel; skyflowCredentials?: unknown } {
  return (sky as unknown as { vaultClients: Record<string, { client: { getLogLevel: () => LogLevel; skyflowCredentials?: unknown } }> })
    .vaultClients[vaultId].client;
}

function expectCode(
  fn: () => void,
  code: { httpCode: number; message: string },
  args: (string | number)[] = [],
): void {
  let thrown: unknown;
  try {
    fn();
  } catch (e) {
    thrown = e;
  }
  expect(thrown).toBeInstanceOf(SkyflowError);
  // Parameterized messages (e.g. "%s1 is missing...") are substituted at throw time.
  const expected = args.length > 0 ? parameterizedString(code.message, ...args) : code.message;
  expect((thrown as SkyflowError).error?.message).toBe(expected);
}

describe('Skyflow facade — construction and vault()', () => {
  it('validates config: a config with neither vaultConfigs nor connectionConfigs throws', () => {
    expectCode(() => new Skyflow({} as never), SKYFLOW_ERROR_CODE.INVALID_SKYFLOW_CONFIG);
  });

  it('throws INVALID_LOG_LEVEL for an unknown log level', () => {
    expectCode(
      () => new Skyflow({ vaultConfigs: [vaultConfig('vault123')], logLevel: 'BOGUS' as never }),
      SKYFLOW_ERROR_CODE.INVALID_LOG_LEVEL,
    );
  });

  it('registers vaults; vault(id) and vault() (first) return a VaultController', () => {
    const sky = newSkyflow(['vault123', 'vault456']);
    expect(sky.vault('vault123')).toBeInstanceOf(VaultController);
    expect(sky.vault('vault456')).toBeInstanceOf(VaultController);
    expect(sky.vault()).toBe(sky.vault('vault123')); // no id -> first registered
  });

  it('vault() on an empty registry throws EMPTY_VAULT_CLIENTS', () => {
    const sky = new Skyflow({ vaultConfigs: [], logLevel: LogLevel.ERROR });
    expectCode(() => sky.vault(), SKYFLOW_ERROR_CODE.EMPTY_VAULT_CLIENTS);
  });

  it('vault(unknownId) throws VAULT_ID_NOT_IN_CONFIG_LIST', () => {
    const sky = newSkyflow();
    expectCode(() => sky.vault('nope'), SKYFLOW_ERROR_CODE.VAULT_ID_NOT_IN_CONFIG_LIST, ['nope']);
  });
});

describe('Skyflow facade — vault config management', () => {
  it('addVaultConfig registers a new vault and rejects a duplicate id', () => {
    const sky = newSkyflow();
    sky.addVaultConfig(vaultConfig('vault999'));
    expect(sky.vault('vault999')).toBeInstanceOf(VaultController);
    expectCode(() => sky.addVaultConfig(vaultConfig('vault999')), SKYFLOW_ERROR_CODE.VAULT_ID_EXITS_IN_CONFIG_LIST, ['vault999']);
  });

  it('addVaultConfig works with a minimal config (no env -> PROD, no credentials)', () => {
    const sky = newSkyflow();
    sky.addVaultConfig({ vaultId: 'vaultMinimal', clusterId: 'min-cluster' });
    expect(sky.vault('vaultMinimal')).toBeInstanceOf(VaultController);
    expect(sky.getVaultConfig('vaultMinimal').vaultId).toBe('vaultMinimal');
  });

  it('updateVaultConfig updates an existing config and rejects an unknown id', () => {
    const sky = newSkyflow();
    sky.updateVaultConfig({ vaultId: 'vault123', clusterId: 'new-cluster' });
    expect(sky.getVaultConfig('vault123').clusterId).toBe('new-cluster');
    expectCode(() => sky.updateVaultConfig({ vaultId: 'nope', clusterId: 'c' }), SKYFLOW_ERROR_CODE.VAULT_ID_NOT_IN_CONFIG_LIST, ['nope']);
  });

  it('getVaultConfig: empty id and unknown id each throw their own error', () => {
    const sky = newSkyflow();
    expect(sky.getVaultConfig('vault123').vaultId).toBe('vault123');
    expectCode(() => sky.getVaultConfig(''), SKYFLOW_ERROR_CODE.EMPTY_VAULT_ID_VALIDATION);
    expectCode(() => sky.getVaultConfig('nope'), SKYFLOW_ERROR_CODE.VAULT_ID_NOT_IN_CONFIG_LIST, ['nope']);
  });

  it('removeVaultConfig removes a vault; a later access and removing an unknown id throw', () => {
    // Two vaults so the registry stays non-empty after one removal (otherwise
    // resolveVaultEntry hits the empty-registry guard first).
    const sky = newSkyflow(['vault123', 'vault456']);
    sky.removeVaultConfig('vault123');
    expect(sky.vault('vault456')).toBeInstanceOf(VaultController); // the other remains
    expectCode(() => sky.vault('vault123'), SKYFLOW_ERROR_CODE.VAULT_ID_NOT_IN_CONFIG_LIST, ['vault123']);
    expectCode(() => sky.removeVaultConfig('vault123'), SKYFLOW_ERROR_CODE.VAULT_ID_NOT_IN_CONFIG_LIST, ['vault123']);
  });

  it('emptying the registry via removeVaultConfig makes vault() throw EMPTY_VAULT_CLIENTS', () => {
    const sky = newSkyflow();
    sky.removeVaultConfig('vault123');
    expectCode(() => sky.vault('vault123'), SKYFLOW_ERROR_CODE.EMPTY_VAULT_CLIENTS);
  });
});

describe('Skyflow facade — log level and credentials', () => {
  it('setLogLevel / updateLogLevel propagate to the vault clients; updateLogLevel returns the facade', () => {
    const sky = newSkyflow(['vault123', 'vault456']);
    sky.setLogLevel(LogLevel.WARN);
    expect(sky.getLogLevel()).toBe(LogLevel.WARN);
    expect(clientOf(sky, 'vault123').getLogLevel()).toBe(LogLevel.WARN);

    const returned = sky.updateLogLevel(LogLevel.DEBUG);
    expect(returned).toBe(sky);
    expect(sky.getLogLevel()).toBe(LogLevel.DEBUG);
    expect(clientOf(sky, 'vault456').getLogLevel()).toBe(LogLevel.DEBUG);
  });

  it('setLogLevel rejects an invalid log level', () => {
    const sky = newSkyflow();
    expectCode(() => sky.setLogLevel('NOPE' as never), SKYFLOW_ERROR_CODE.INVALID_LOG_LEVEL);
  });

  it('updateSkyflowCredentials: null throws EMPTY_CREDENTIALS; valid creds propagate and are returned', () => {
    const sky = newSkyflow();
    expectCode(() => sky.updateSkyflowCredentials(null as never), SKYFLOW_ERROR_CODE.EMPTY_CREDENTIALS);

    sky.updateSkyflowCredentials({ apiKey: 'sky-new-common' } as never);
    expect(sky.getSkyflowCredentials()).toEqual({ apiKey: 'sky-new-common' });
    expect(clientOf(sky, 'vault123').skyflowCredentials).toEqual({ apiKey: 'sky-new-common' });
  });
});

describe('Skyflow facade — SDK identity', () => {
  it('stamps the FlowVault SDK identity on import', () => {
    expect(getSdkIdentity()).toEqual({ name: 'skyflow-flowvault-node', version: '1.0.0' });
  });
});
