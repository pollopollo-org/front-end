import { apis } from "src/ts/config/apis";
import { ProductModel, ProductModelData } from "src/ts/models/ProductModel";
import { alertApiError } from "src/ts/utils/alertApiError";

const productCache: Map<string, ProductModel[]> = new Map();

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchProductBatch(start: number, end: number) {
    const cacheKey = `${start}${end}`;

    // If we have the current request cached, then simply return that!
    if (productCache.has(cacheKey)) {
        return productCache.get(cacheKey);
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

        const productsData: ProductModelData[] = await response.json();

        if (response.ok) {
            const productArray = productsData.map((productData) => ProductModel.CREATE(productData));
            productCache.set(cacheKey, productArray);

            return productArray;
        } else {
            alertApiError(response.status, apis.products.getBatch.errors);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchProductById(productId: number) {
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
            alertApiError(response.status, apis.products.getById.errors);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchProductByProducer(producerId: number) {
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
            alertApiError(response.status, apis.products.getByProducer.errors);
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