import { DummyModel } from "../models/DummyModel";
import { Store } from "./Store";

/**
 * Specifies where the created models should fetch their data from.
 */
export enum DataProviders {
    DUMMY = "dummy",
    BACKEND = "backend",
};

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
                const dummyModel = await DummyModel.CREATE(DataProviders.DUMMY);

                resolve(new Store({dummyModel}));
            } catch (err) {
                reject(err);
            }
        });
    }

    return cache;
}
