import { apis } from "src/ts/config/apis";
import { ApplicationModel, ApplicationModelData } from "src/ts/models/ApplicationModel";
import { alertApiError } from "src/ts/utils/alertApiError";
import { Store } from "src/ts/store/Store";

const applicationCache: Map<string, ApplicationModel[]> = new Map();
let cachedCount: number = 0;

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchApplicationBatch(start: number, end: number, store: Store) {
    const cacheKey = `${start}${end}`;

    // If we have the current request cached, then simply return that!
    if (applicationCache.has(cacheKey)) {
        return {
            count: cachedCount,
            applications: applicationCache.get(cacheKey),
        };
    }

    const endPoint = apis.applications.getBatch.path.replace("{start}", String(start)).replace("{end}", String(end));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // tslint:disable-next-line completed-docs
        const json: { count: number; list: ApplicationModelData[] } = await response.json();

        if (response.ok) {
            const applicationArray = json.list.map((applicationData) => ApplicationModel.CREATE(applicationData));
            applicationCache.set(cacheKey, applicationArray);
            cachedCount = json.count;

            return {
                count: json.count,
                applications: applicationArray
            };
        } else {
            alertApiError(response.status, apis.applications.getBatch.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchApplicationById(applicationId: number, store: Store) {
    const cacheKey = String(applicationId);

    if (applicationCache.has(cacheKey)) {
        return applicationCache.get(cacheKey);
    }

    const token = localStorage.getItem("userJWT");

    if (!token) {
        return;
    }

    const endPoint = apis.applications.getById.path.replace("{applicationId}", String(applicationId));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const applicationsData: ApplicationModelData[] = await response.json();

        if (response.ok) {
            const applicationArray = applicationsData.map((applicationData) => ApplicationModel.CREATE(applicationData));
            applicationCache.set(cacheKey, applicationArray);

            return applicationArray;
        } else {
            alertApiError(response.status, apis.applications.getById.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchApplicationByReceiver(receiverId: number, store: Store) {
    const cacheKey = `receiver-${receiverId}`;

    if (applicationCache.has(cacheKey)) {
        return applicationCache.get(cacheKey);
    }

    const token = localStorage.getItem("userJWT");

    if (!token) {
        return;
    }

    const endPoint = apis.applications.getByReceiver.path.replace("{receiverId}", String(receiverId));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const applicationsData: ApplicationModelData[] = await response.json();

        if (response.ok) {
            const applicationArray = applicationsData.map((applicationData) => ApplicationModel.CREATE(applicationData));
            applicationCache.set(cacheKey, applicationArray);

            return applicationArray;
        } else {
            alertApiError(response.status, apis.applications.getByReceiver.errors, store);
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
    applicationCache.delete(key);
}