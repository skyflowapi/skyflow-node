export default function InvalidServiceAccountException() {
    return new Error('Unable to parse service account object');
}

InvalidServiceAccountException.prototype = Object.create(Error.prototype);