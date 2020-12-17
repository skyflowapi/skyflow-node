import fs from 'fs';
import InvalidServiceAccountException from '../CustomErrors/InvalidServiceAccount'
export function getServiceAccount(serviceAccount) {
    let serviceAccountObject = serviceAccount;
    try {
        if (typeof serviceAccount === "string") {
            serviceAccountObject = JSON.parse(fs.readFileSync(params.store.serviceAccountFile))
        }
    } 
    catch(e) {
        throw new InvalidServiceAccountException()
    }
    return serviceAccountObject;
}