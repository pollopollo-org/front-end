import { ApplicationModel } from "src/ts/models/ApplicationModel";
import { DataProviders, Store } from "src/ts/store/Store";

import { apis } from "src/ts/config/apis";

import jwtDecode from "jwt-decode";
import { ProductModel } from "src/ts/models/ProductModel";
import { ReceiverModel, ReceiverModelData } from "src/ts/models/ReceiverModel";
import { UserToken } from "src/ts/models/UserModel";

/**
 * Cache used to prevent re-creating a store over and over again.
 */
let cache: Promise<Store>;

/**
 * Helper that'll create a new instance of the Store by fetching data required
 * to populate the Models.
 */
export const createStore = () => {
    if (!cache) {
        cache = new Promise<Store>(async (resolve, reject) => {
            try {
                // For now we really don't have that much to the store, simply create
                // it and resolve immediately :-)
                const applications = await ApplicationModel.CREATE_COLLECTION(DataProviders.DUMMY);
                const user = await fetchUser();
                const products = await ProductModel.CREATE_COLLECTION(DataProviders.DUMMY);

                resolve(new Store({applications, user, products}));
            } catch (err) {
                reject(err);
            }
        });
    }

    return cache;
}

/**
 * Internal method that'll attempt to log the user in once the page loads.
 * This will only be possible if the user has already logged in previously,
 * since it relies on a token being stored in the localStorage.
 */
export async function fetchUser(userId?: string) {
    const token = localStorage.getItem("userJWT");

    if (!token) {
        return;
    }

    const parsedToken = <UserToken> jwtDecode(token);

    const endPoint = apis.user.get.replace("{userId}", userId || parsedToken.nameid);

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
            return;
        }

    } catch (err) {
        return;
    }
}

