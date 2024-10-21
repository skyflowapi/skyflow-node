//imports

class DeleteResponse {

    //fields

    deletedIds?: Array<string>;

    errors?: Object;

    constructor({ deletedIds, errors }: { deletedIds?: Array<string>, errors?: object }) {
        this.deletedIds = deletedIds;
        this.errors = errors;
    }

    //getters and setters

}

export default DeleteResponse;
