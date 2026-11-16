// Detect V2 types whose values depend on the vault type. These are the flowvault versions; the
// skyvault SDK ships its own. The shared request and response models in skyflow-common are typed
// against the contracts `DeidentifyFileSource`, `ReidentifyFileSource` and `RedactionRule`, which
// these satisfy.
import type { RedactionRule } from 'skyflow-common';

/**
 * How the input file of `deidentifyFile` is supplied, and how a run delivers its outputs.
 * Flowvault vaults accept a base64 string or a presigned URL; a skyflow id is not a source on
 * flowvault. A local `file` or `filePath` is always sent as `BASE64`.
 */
export enum DeidentifySourceType {
  BASE64 = 'BASE64',
  PRESIGNED_URL = 'PRESIGNED_URL',
}

/** How the input file of `reidentifyFile` is supplied, and how its outputs are delivered. */
export enum ReidentifySourceType {
  BASE64 = 'BASE64',
  PRESIGNED_URL = 'PRESIGNED_URL',
}

/**
 * One redaction rule for `reidentifyString` and `reidentifyFile` on a flowvault vault: the
 * token group the rule applies to and the name of a redaction pattern configured in the vault.
 * Both fields are optional on the API; the server rejects combinations it does not support.
 */
export interface RedactionLevel extends RedactionRule {
  /** Token group the rule applies to. */
  tokenGroupName?: string;
  /** Name of a redaction pattern configured in the vault. */
  redactionPattern?: string;
  entityName?: never;
  redactionType?: never;
}
