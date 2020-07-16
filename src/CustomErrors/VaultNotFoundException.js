export default function VaultNotFoundException() {
    const error = new Error('Unable to fetch notebook. Please check the vault id.');
    return error;
  }
  
  VaultNotFoundException.prototype = Object.create(Error.prototype);