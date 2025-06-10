//imports

import { SkyflowRecordError } from "../../../../utils";

class DeleteResponse {

    //fields

    deletedIds?: Array<string>;

    errors: Array<SkyflowRecordError> | null;

    constructor({ deletedIds, errors }: { deletedIds: Array<string>, errors: Array<SkyflowRecordError> | null}) {
        this.deletedIds = deletedIds;
        this.errors = errors;
    }

    //getters and setters

}

export default DeleteResponse;
