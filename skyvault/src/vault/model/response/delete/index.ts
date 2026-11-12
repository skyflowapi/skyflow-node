//imports

import { SkyflowRecordError } from "skyflow-common";
import { BaseDeleteResponse } from "skyflow-common";

class DeleteResponse extends BaseDeleteResponse {

    //fields

    deletedIds: Array<string>;

    errors: Array<SkyflowRecordError> | null;

    /**
     * @deprecated Passing undefined for deletedIds is no longer supported. Pass empty array [] instead.
     */
    constructor({ deletedIds, errors }: { deletedIds: Array<string>, errors: Array<SkyflowRecordError> | null}) {
        super();
        this.deletedIds = deletedIds;
        this.errors = errors;
    }

    //getters and setters

}

export default DeleteResponse;
