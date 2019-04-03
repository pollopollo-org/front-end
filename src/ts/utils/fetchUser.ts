import { apis } from "src/ts/config/apis";
import { alertApiError } from "src/ts/utils/alertApiError";
import { createUser } from "src/ts/utils/createUser";
import { Store } from "src/ts/store/Store";

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchUser(userId: string, store: Store) {
    const token = localStorage.getItem("userJWT");

    if (!token) {
        return;
    }

    const endPoint = apis.user.get.path.replace("{userId}", userId);

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const userData = await response.json();

        if (response.ok) {
            return createUser(userData);
        } else {
            alertApiError(response.status, apis.user.get.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Internal method that'll attempt to log the user in once the page loads.
 * This will only be possible if the user has already logged in previously,
 * since it relies on a token being stored in the localStorage.
 */
export async function fetchSelf() {
    const token = localStorage.getItem("userJWT");

    if (!token) {
        return;
    }

    const endPoint = apis.user.self.path;

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const userData = await response.json();

        if (response.ok) {
            return createUser(userData);
        }
        
        return;
    } catch (err) {
        return;
    }
}