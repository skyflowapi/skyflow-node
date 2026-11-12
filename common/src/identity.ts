export interface SdkIdentity {
    name: string;
    version: string;
}

// Default identity = legacy product. Layers (skyvault/flowvault) override via setSdkIdentity().
let current: SdkIdentity = { name: 'skyflow-node', version: '2.1.2' };

export function setSdkIdentity(id: SdkIdentity): void {
    current = { ...id };
}

export function getSdkIdentity(): SdkIdentity {
    return { ...current };
}
