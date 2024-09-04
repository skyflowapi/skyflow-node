//imports

class Management {

    constructor() {

    }

    static initialize() {
        //return management object
    }

    public createVault() {
        //return vault object using static func
        //cache - store the vault object in a list 
    }

    public createRole() {
        //return role object using static func
        //cache - store the role object in a list 
    }

    public createPolicy() {
        //return policy object using static func
        //cache - store the policy object in a list 
    }

    public vault(vaultId: string) {
        // return vault object from the cached list
    }

    public role(roleId: string) {
        // return role object from the cached list
    }

    public policy(policyId: string) {
        // return policy object from the cached list
    }
}

export default Management;
