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

export function getWorkspace(workspaceUrl) {
    let workspaceUrlAsArray = workspaceUrl.split('.');
    if(workspaceUrlAsArray.length != 5) {
        return {valid : false}
    }

    return {
        accountName : workspaceUrlAsArray[0],
        workspace : workspaceUrlAsArray[1],
        valid : true
    }

}