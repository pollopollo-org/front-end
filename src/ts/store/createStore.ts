import { ApplicationModel } from "src/ts/models/ApplicationModel";
import { DataProviders, Store } from "src/ts/store/Store";

import { fetchSelf } from "src/ts/utils/fetchUser";

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
                const user = await fetchSelf();

                resolve(new Store({applications, user}));
            } catch (err) {
                reject(err);
            }
        });
    }

    return cache;
}

