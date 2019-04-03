import { Errors } from "src/ts/config/apis";
import { Store } from "src/ts/store/Store";

/**
 * Simple helper that'll alert the user with an appropriate message once an error
 * from the API is returned
 */
export function alertApiError(statusCode: number, errors: Errors, store: Store): void {
    if (statusCode === 429) {
        store.currentErrorMessage = "You've exceeded the rate limit. Please wait a while and then try again";

        return;
    }

    if (statusCode === 500) {
        store.currentErrorMessage = "Something went wrong while trying to process your request. Please try again later.";

        return;
    }

    const supportedErrors = Object.keys(errors);

    const errorKey = supportedErrors.find(code => Number(code) === statusCode);

    // If we've specified an error message for the given error, then alert it
    // to the user!
    if (errorKey) {
        store.currentErrorMessage = errors[errorKey];
    }
}