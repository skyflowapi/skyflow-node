import { V1Vault } from "../model/V1Vault";

export class Vault extends V1Vault{
    constructor(data, client) {
        super(data, client)
      }

    update(vault) {
        // const {object , client} = this.destroyObjectAndCLient(vault) ;
        const {object,client} = this.destroyObjectAndCLient(this);
        const id = object.vault.ID;
        delete object.vault.type;
        delete object.vault.interfaces;
        delete object.vault.queries;
        delete object.vault.ID;
        return client.getVault(id)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

    delete() {
        return client.deleteVault(this.ID)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

}

