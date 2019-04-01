import { apis } from "src/ts/config/apis";
import { ProductModel, ProductModelData } from "src/ts/models/ProductModel";
import { alertApiError } from "src/ts/utils/alertApiError";
import { Store } from "src/ts/store/Store";

const productCache: Map<string, ProductModel[]> = new Map();
let cachedCount: number = 0;

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchProductBatch(start: number, end: number, store: Store) {
    const cacheKey = `${start}${end}`;

    // If we have the current request cached, then simply return that!
    if (productCache.has(cacheKey)) {
        return {
            count: cachedCount,
            products: productCache.get(cacheKey),
        };
    }


    const token = localStorage.getItem("userJWT");

    if (!token) {
        return;
    }

    const endPoint = apis.products.getBatch.path.replace("{start}", String(start)).replace("{end}", String(end));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        // tslint:disable-next-line completed-docs
        const json: { count: number; list: ProductModelData[] } = await response.json();

        if (response.ok) {
            const productArray = json.list.map((productData) => ProductModel.CREATE(productData));
            productCache.set(cacheKey, productArray);
            cachedCount = json.count;

            return {
                count: json.count,
                products: productArray
            };
        } else {
            alertApiError(response.status, apis.products.getBatch.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchProductById(productId: number, store: Store) {
    const cacheKey = String(productId);

    if (productCache.has(cacheKey)) {
        return productCache.get(cacheKey);
    }

    const token = localStorage.getItem("userJWT");

    if (!token) {
        return;
    }

    const endPoint = apis.products.getById.path.replace("{productId}", String(productId));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const productsData: ProductModelData[] = await response.json();

        if (response.ok) {
            const productArray = productsData.map((productData) => ProductModel.CREATE(productData));
            productCache.set(cacheKey, productArray);

            return productArray;
        } else {
            alertApiError(response.status, apis.products.getById.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchProductByProducer(producerId: number, store: Store) {
    const cacheKey = `producer-${producerId}`;

    if (productCache.has(cacheKey)) {
        return productCache.get(cacheKey);
    }

    const token = localStorage.getItem("userJWT");

    if (!token) {
        return;
    }

    const endPoint = apis.products.getByProducer.path.replace("{producerId}", String(producerId));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const productsData: ProductModelData[] = await response.json();

        if (response.ok) {
            const productArray = productsData.map((productData) => ProductModel.CREATE(productData));
            productCache.set(cacheKey, productArray);

            return productArray;
        } else {
            alertApiError(response.status, apis.products.getByProducer.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Simple helper that invalidates part of the cache in case changes has been made
 * to it.
 */
export function invalidateCacheKey(key: string) {
    productCache.delete(key);
}