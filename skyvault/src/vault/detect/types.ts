// Detect V2 types whose values depend on the vault type. These are the skyvault versions; the
// flowvault SDK ships its own. The shared request and response models in skyflow-common are typed
// against the contracts `DeidentifyFileSource`, `ReidentifyFileSource` and `RedactionRule`, which
// these satisfy.
import type { EntityType, RedactionRule, RedactionType } from "skyflow-common";

/**
 * How the input file of `deidentifyFile` is supplied, and how a run delivers its outputs.
 * Skyvault vaults accept a base64 string, the skyflow id of a file already stored in the vault,
 * or a presigned URL. A local `file` or `filePath` is always sent as `BASE64`.
 */
export enum DeidentifySourceType {
    BASE64 = "BASE64",
    SKYFLOW_ID = "SKYFLOW_ID",
    PRESIGNED_URL = "PRESIGNED_URL",
}

/**
 * How the input file of `reidentifyFile` is supplied, and how its outputs are delivered.
 * Re-identification does not accept a skyflow id as the source.
 */
export enum ReidentifySourceType {
    BASE64 = "BASE64",
    PRESIGNED_URL = "PRESIGNED_URL",
}

/**
 * One redaction rule for `reidentifyString` and `reidentifyFile` on a skyvault vault: the entity
 * type the rule applies to and how its value is rendered. Both fields are optional on the API;
 * the server rejects combinations it does not support.
 */
export interface RedactionLevel extends RedactionRule {
    /** Entity type the rule applies to. */
    entityName?: EntityType;
    /** How the value is rendered. */
    redactionType?: RedactionType;
    tokenGroupName?: never;
    redactionPattern?: never;
}
