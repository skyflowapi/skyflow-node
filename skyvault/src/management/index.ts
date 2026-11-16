//imports

class Management {

    constructor() {

    }

    static initialize() {
        //return management object
    }

    createVault() {
        //return vault object using static func
        //cache - store the vault object in a list 
    }

    createRole() {
        //return role object using static func
        //cache - store the role object in a list 
    }

    createPolicy() {
        //return policy object using static func
        //cache - store the policy object in a list 
    }

    vault(vaultId: string) {
        // return vault object from the cached list
    }

    role(roleId: string) {
        // return role object from the cached list
    }

    policy(policyId: string) {
        // return policy object from the cached list
    }
}

export default Management;
