import { BaseDetectController } from 'skyflow-common';
import VaultClient from '../../client';
import { DeidentifySourceType, ReidentifySourceType } from '../../detect/types';

/**
 * Skyflow Detect operations for a flowvault vault, returned by `Skyflow.detect()`
 * and `Skyflow.detect(vaultId)`. Every Detect V2 method (`deidentifyString`,
 * `deidentifyFile`, `reidentifyString`, `reidentifyFile`, `getRun`,
 * `checkGuardrails`) is inherited from the shared `BaseDetectController` in
 * `skyflow-common`; the flowvault `VaultClient` supplies the vault URL, vault
 * id, credentials, log level and the per-vault timeout / retry overrides.
 *
 * This layer owns the vault-specific types: `deidentifyFile` takes the flowvault
 * `DeidentifySourceType` (`BASE64` or `PRESIGNED_URL`; no skyflow id), and a run's or
 * re-identification's `outputType` is resolved to the same enums, so a value the flowvault
 * SDK does not offer comes back as `null`. A `VAULT_TOKEN` entity's `destination` is a token
 * group name, and `RedactionLevel` rules use `tokenGroupName` and `redactionPattern`.
 */
class DetectController extends BaseDetectController<VaultClient> {
  constructor(client: VaultClient) {
    super(client);
  }

  protected toDeidentifySource(value: string | null | undefined): DeidentifySourceType | null {
    return BaseDetectController.enumOrNull(DeidentifySourceType, value);
  }

  protected toReidentifySource(value: string | null | undefined): ReidentifySourceType | null {
    return BaseDetectController.enumOrNull(ReidentifySourceType, value);
  }
}

export default DetectController;
