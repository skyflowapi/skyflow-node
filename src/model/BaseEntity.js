export class BaseEntity {
    constructor(entity, client) {
        Object.assign(this, entity);
        this.client = client
      }

    setClient(client) {
        this.client = client;
        return this;
    }

    destroyObjectAndCLient(object) {
        let client;
        if (object.hasOwnProperty('client')){
            client = object.client;
            delete object.client

        }
        return {object,client};
    }
    
    updateObject(object, newObject = {}) {
        Object.keys(newObject).forEach(key => {
            object[key] = newObject[key]
        }); 
        return object;
    }
}