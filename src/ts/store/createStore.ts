import { ApplicationModel } from "src/ts/models/ApplicationModel";
import { DataProviders, Store } from "src/ts/store/Store";

import { ProductModel } from "src/ts/models/ProductModel";
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
                const products = await ProductModel.CREATE_COLLECTION(DataProviders.DUMMY);

                resolve(new Store({applications, user, products}));
            } catch (err) {
                reject(err);
            }
        });
    }

    return cache;
}

