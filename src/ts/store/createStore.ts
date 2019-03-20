import { ApplicationModel } from "../models/ApplicationModel";
import { ProducerModel, ProducerModelData } from "../models/ProducerModel";
import { DataProviders, Store } from "./Store";

import { apis } from "../config/apis";

import jwt_decode from "jwt-decode";
import { ReceiverModel, ReceiverModelData } from "../models/ReceiverModel";
import { UserToken } from "../models/UserModel";

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

                resolve(new Store({applications, user}));
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

    const parsedToken = jwt_decode(token) as UserToken;

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
            if (true) {
                return new ReceiverModel(userData as ReceiverModelData);
            } else {
                return new ProducerModel(userData as ProducerModelData);
            }
        } else {
            return;
        }

    } catch (err) {
        return;
    }
}

