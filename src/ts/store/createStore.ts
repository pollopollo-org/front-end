import { Store } from "src/ts/store/Store";

import { fetchSelf } from "src/ts/models/UserModel";


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

                const user = await fetchSelf();

                resolve(new Store({ user }));

            } catch (err) {
                reject(err);
            }
        });
    }

    return cache;
}

