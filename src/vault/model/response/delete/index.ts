//imports

import { SkyflowRecordError } from "../../../../utils";

class DeleteResponse {

    //fields

    deletedIds: Array<string>;

    errors: Array<SkyflowRecordError> | null;

    /**
     * @deprecated Passing undefined for deletedIds is no longer supported. Pass empty array [] instead.
     */
    constructor({ deletedIds, errors }: { deletedIds: Array<string>, errors: Array<SkyflowRecordError> | null}) {
        this.deletedIds = deletedIds;
        this.errors = errors;
    }

    //getters and setters

}

export default DeleteResponse;
