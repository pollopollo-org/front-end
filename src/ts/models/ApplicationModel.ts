import { Store } from "src/ts/store/Store";

import countriesJson from "src/assets/countries.json";
import { CountryCodes } from "src/ts/models/CountryCodes";
import { apis } from "src/ts/config/apis";
import { alertApiError } from "src/ts/utils/alertApiError";
import { convertNumberToApplicationStatus } from "src/ts/utils/convertNumberToApplicationStatus";
import { CreateApplicationState } from "src/ts/components/pages/CreateApplication/CreateApplication";
import { asyncTimeout } from "src/ts/utils/index";
import { routes } from "src/ts/config/index";
import { History } from "history";


export enum ApplicationStatus {
    OPEN = "Open",
    LOCKED = "Locked",
    PENDING = "Pending",
    COMPLETED = "Completed",
    UNAVAILABLE = "Unavailable",
}

/**
 * Contains the path to the backend which is used to resolve images
 */
const BACKEND_URL = "https://api.pollopollo.org";

/**
 * Defines the data required to create an application model.
 *
 * the fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
export type ApplicationModelData = {
    applicationId: number;
    receiverId: number;
    receiverName: string;
    country: CountryCodes;
    thumbnail?: string;
    productId: number;
    productTitle: string;
    productPrice: number;
    producerId: number;
    motivation: string;
    status: number;
    creationDate: string;
    dateOfDonation?: string;
};
// tslint:enable completed-docs

/**
 * Exmaple of a model, and how to implement one.
 */
export class ApplicationModel {
    /**
     * Helper that instantiates a model, populated with required data.
     */
    public static CREATE(data: ApplicationModelData): ApplicationModel {
        return new ApplicationModel({
            ...data,
        });
    }

    /**
     * Contains the id of the application
     */
    public readonly applicationId: number;

    /**
     * Contains the id of the receiver
     */
    public readonly receiverId: number;

    /**
     * Specifies the id of the product related to the applications
     */
    public readonly productId: number;

    /**
     * Defines the name of the receiver applying for the product
     */
    public readonly receiverName: string;

    /**
     * Defines the countryCode of the country that applicant is coming from
     */
    public readonly countryCode: CountryCodes;

    /**
     * Defines the country that the applicant is coming from.
     */
    public readonly country: string;

    /**
     * Contains a thumbnail of the applicant
     */
    private readonly thumbnail?: string;

    /**
     * Describes the product the receiver is applying for
     */
    public readonly productTitle: string;

    /**
     * Describes the price of the product being sold in dollars.
     */
    public readonly productPrice: number;

    /**
     * Contains the id of the producer selling the product
     */
    public readonly producerId: number;

    /**
     * Motivation defines why the user has applied for the given product, in order
     * for potential doners determine
     */
    public readonly motivation: string;

    /**
     * Contains the status of the application
     */
    public readonly status: ApplicationStatus;

    /**
     * The date the application was created
     */
    public readonly creationDate: string;

    /**
     * The date money was donated to the application (if money has been donated)
     */
    public readonly dateOfDonation?: string;

    constructor(data: ApplicationModelData) {
        // Parse the country from the supplied countryCode
        const country = countriesJson.find((c) => c.Code.toLowerCase() === data.country.toLowerCase());

        if (!country) {
            console.warn("Unable to find country from countryCode!");
            this.country = "";
        } else {
            this.country = country.Name;
        }

        this.applicationId = data.applicationId;
        this.receiverId = data.receiverId;
        this.receiverName = data.receiverName;
        this.countryCode = data.country;
        this.thumbnail = data.thumbnail;
        this.productTitle = data.productTitle;
        this.productPrice = data.productPrice;
        this.productId = data.productId;
        this.producerId = data.producerId;
        this.motivation = data.motivation;
        this.status = convertNumberToApplicationStatus(data.status);
        this.creationDate = data.creationDate;
        this.dateOfDonation = data.dateOfDonation;
    }

    /**
     * Internal helper that returns the absolute path to be rendered for a given
     * profile
     */
    public getThumbnail(): string | undefined {
        if (this.thumbnail) {
            return `${BACKEND_URL}/${this.thumbnail}`;
        } else {
            return;
        }
    }
}

/**
 * The application cache will contain applications fetched from the backend in order to
 * avoid having to fetch them over and over again.
 */
const applicationCache: Map<string, ApplicationModel[]> = new Map();
let cachedCount: number = 0;

/**
 * Method that'll post a new application to the backend
 */
export async function postApplication(data: CreateApplicationState, store: Store, history: History) {
    try {
        const startedAt = performance.now();
        const token = localStorage.getItem("userJWT");

        // If either a user haven't been logged in or if we're currently missing
        // a token, then we cannot process this process, and hence we bail out.
        if (!store.user || !token) {
            return;
        }

        const result = await fetch(apis.applications.post.path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: store.user.id,
                productId: store.product.id,
                motivation: data.motivation,
            }),
        });

        // Now, ensure we've waited for at least 500ms before resolving the request
        // in order to ensure throbber actually will be displayed, and that the
        // UI want appear 'jumpy'
        await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));

        if (result.ok) {
            // If everything goes well, then we should invalidate the cache for
            // the given producer, in order to ensure that the newly created application
            // will be properly fetched with all data needed, the next time the
            // user profile is visited
            applicationCache.delete(`receiver-${store.user.id}-Open`);

            // ... and finally navigate the user back to his/hers own profile
            history.push(routes.profile.path);
        } else {
            alertApiError(result.status, apis.applications.post.errors, store);
        }
    } catch (err) {
        store.currentErrorMessage = "Something went wrong while attempting to create your application, please try again later.";
    }
}

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchApplicationBatch(offset: number, amount: number, store?: Store) {
    const cacheKey = `${offset}${amount}`;

    // If we have the current request cached, then simply return that!
    if (applicationCache.has(cacheKey)) {
        return {
            count: cachedCount,
            applications: applicationCache.get(cacheKey),
        };
    }

    const endPoint = apis.applications.getBatch.path.replace("{offset}", String(offset)).replace("{amount}", String(amount));

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
            if (store) {
                alertApiError(response.status, apis.applications.getBatch.errors, store);
            }
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Internal method that'll attempt to fetch a specifict application.
 */
export async function fetchApplicationById(applicationId: number, store: Store, useCache: boolean = true) {
    const cacheKey = String(applicationId);

    if (useCache && applicationCache.has(cacheKey)) {
        return applicationCache.get(cacheKey);
    }

    const endPoint = apis.applications.getById.path.replace("{applicationId}", String(applicationId));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        const applicationsData: ApplicationModelData = await response.json();
        if (response.ok) {
            const applicationArray =  [ApplicationModel.CREATE(applicationsData)];
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
 * Method used to fetch all applications related to a specific receiver.
 *
 * Users must be logged in to perform this request.
 */
export async function fetchApplicationByReceiver(receiverId: number, store: Store, status: ApplicationStatus) {
    const cacheKey = `receiver-${receiverId}-${status}`;
    // If we have a cache hit, then simply return the cached application!
    if (applicationCache.has(cacheKey)) {
        return applicationCache.get(cacheKey);
    }

    //const applicationStatus = status === ApplicationStatus.OPEN;

    const endPoint = apis.applications.getByReceiver.path
        .replace("{receiverId}", String(receiverId))
        .replace("{applicationStatus}", String(status));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const applicationsData: ApplicationModelData[] = await response.json();

        // If everything goes well, then create a bunch of applicationModels from the
        // data and add them to the cache before returning output.
        if (response.ok) {
            const applicationArray = applicationsData.map((applicationData) => ApplicationModel.CREATE(applicationData));
            applicationCache.set(cacheKey, applicationArray);

            return applicationArray;
        } else {
            // ... else alert any errors that occurred to our users!
            alertApiError(response.status, apis.applications.getByReceiver.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Helper for deleting application
 */
export async function deleteApplication(applicationId: number, store: Store, callback?: () => void) {
    try {
        const token = localStorage.getItem("userJWT");

        // The user MUST be logged in in order to be able to delete the application!
        // (furthermore the logged in user must be the owner of
        // the application, else the backend will throw errors).
        if (!token || !store.user) {
            return;
        }

        const result = await fetch(apis.applications.delete.path.replace("{userId}", String(store.user.id)).replace("{applicationId}", String(applicationId)), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (result.ok) {
            applicationCache.delete(`receiver-${store.user.id}-Open`);

            if (callback) {
                callback();
            }
        } else {
            alertApiError(result.status, apis.applications.post.errors, store);
        }
    } catch (err) {
        // Show error message
        store.currentErrorMessage = "Something went wrong while attempting to delete your application, please try again later.";
    }
}

/**
 * Helper for initiating donation
 */
export async function initiateDonation(applicationId: number, callback?: () => void) {
    //Redirect to the chatbot in wallet
    window.location.href = `byteball:AymLnfCdnKSzNHwMFdGnTmGllPdv6Qxgz1fHfbkEcDKo@obyte.org/bb#${applicationId}`;
    if (callback) {
        callback();
    }
}

/**
 * Helper that confirms completion of application
 */
export async function confirmReceival(application: ApplicationModel, store: Store, callback?: (newApplication: ApplicationModel) => void) {
    try {
        const token = localStorage.getItem("userJWT");

        // The user MUST be logged in in order to be able to confirm the receival
        // (furthermore the logged in user must be the owner of the application, else 
        // the backend will throw errors).
        if (!token || !store.user) {
            return;
        }

        const result = await fetch(apis.applications.postConfirm.path.replace("{userId}", String(application.receiverId)).replace("{id}", String(application.applicationId)), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (result.ok) {

            // In case we have a callback, then broadcast the newly updated application
            // to it.
            if (callback) {
                const newApplication = ApplicationModel.CREATE({
                    ...application,
                    country: <CountryCodes>application.country,
                    // Completed application status
                    status: 3
                });
                callback(newApplication);
            }
        } else {
            alertApiError(result.status, apis.products.post.errors, store);
        }
    } catch (err) {
        // Show error message
        store.currentErrorMessage = "Something went wrong while attempting to update your application, please try again later.";
    } finally {
    }
}

/**
 * Helper that locks the status of an application
 */
export async function updateStatus(application: ApplicationModel, statusNumber: number, store: Store, callback?: (newApplication: ApplicationModel) => void) {
    try {
        const result = await fetch(apis.applications.update.path, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                applicationId: application.applicationId,
                // application status equal to enum number
                status: statusNumber
            })
        });

        if (result.ok) {
        } else {
            alertApiError(result.status, apis.applications.update.errors, store);
        }
    } catch (err) {
        // Show error message
        store.currentErrorMessage = "Something went wrong while attempting to update your application, please try again later.";
    } finally {
    }
}
