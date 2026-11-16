// Stand-ins for the vault-specific Detect types that each SDK (skyvault, flowvault) ships. The
// common layer only knows the contracts, so its tests use these the way a module would: a
// source enum per operation and a controller that resolves wire output types onto them.
import { BaseDetectController } from '../../src/detect/controller';

export const TestDeidentifySourceType = Object.freeze({
    BASE64: 'BASE64',
    SKYFLOW_ID: 'SKYFLOW_ID',
    PRESIGNED_URL: 'PRESIGNED_URL',
});

export const TestReidentifySourceType = Object.freeze({
    BASE64: 'BASE64',
    PRESIGNED_URL: 'PRESIGNED_URL',
});

/** A module-style controller: the base class plus the two source resolvers every SDK provides. */
export class TestDetectController extends BaseDetectController {
    toDeidentifySource(value) {
        return BaseDetectController.enumOrNull(TestDeidentifySourceType, value);
    }

    toReidentifySource(value) {
        return BaseDetectController.enumOrNull(TestReidentifySourceType, value);
    }
}

export const resolveDeidentifySource = (value) => BaseDetectController.enumOrNull(TestDeidentifySourceType, value);
export const resolveReidentifySource = (value) => BaseDetectController.enumOrNull(TestReidentifySourceType, value);
