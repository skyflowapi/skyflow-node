import { GuardrailsValidation } from "../../../types";

/** Response of `detect().checkGuardrails()`. Passed through exactly as the API returned it. */
class CheckGuardrailsResponse {
    /** The screened text. */
    readonly text: string | null;

    /** `PASSED` or `FAILED`; `UNKNOWN` for a value this SDK version does not know. */
    readonly validation: GuardrailsValidation;

    /** Whether the text was judged toxic; `null` when the check did not run. */
    readonly toxic: boolean | null;

    /** Whether a denied topic was found; `null` when no topics were supplied. */
    readonly deniedTopic: boolean | null;

    constructor(input: {
        text: string | null;
        validation: GuardrailsValidation;
        toxic: boolean | null;
        deniedTopic: boolean | null;
    }) {
        this.text = input.text;
        this.validation = input.validation;
        this.toxic = input.toxic;
        this.deniedTopic = input.deniedTopic;
    }
}

export default CheckGuardrailsResponse;
