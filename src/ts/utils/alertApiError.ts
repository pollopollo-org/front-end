import { Errors } from "src/ts/config/apis";

/**
 * Simple helper that'll alert the user with an appropriate message once an error
 * from the API is returned
 */
export function alertApiError(statusCode: number, errors: Errors): void {
    if (statusCode === 429) {
        alert("You've exceeded the rate limit. Please wait a while and then try again");

        return;
    }

    const supportedErrors = Object.keys(errors);

    const errorKey = supportedErrors.find(code => Number(code) === statusCode);

    // If we've specified an error message for the given error, then alert it
    // to the user!
    if (errorKey) {
        alert(errors[errorKey]);
    }
}