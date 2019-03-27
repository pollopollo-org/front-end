import { ReceiverModel, ReceiverModelData } from "src/ts/models/ReceiverModel";
import { apis } from "src/ts/config/apis";
import { alertApiError } from "src/ts/utils/alertApiError";

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchUser(userId: string) {
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
            // Determine whether we're dealing with a producer or a receiver
            // if (true) {
                return new ReceiverModel(<ReceiverModelData> userData);
            // } else {
            //     return new ProducerModel(userData as ProducerModelData);
            // }
        } else {
            alertApiError(response.status, apis.user.get.errors);
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
            // Determine whether we're dealing with a producer or a receiver
            // if (true) {
                return new ReceiverModel(<ReceiverModelData> userData);
            // } else {
            //     return new ProducerModel(userData as ProducerModelData);
            // }
        }
        
        return;
    } catch (err) {
        return;
    }
}