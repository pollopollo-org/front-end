import { DataProviders, Store } from "src/ts/store/Store";

import countriesJson from "src/assets/countries.json";
import { CountryCodes } from "src/ts/models/CountryCodes";
import { apis } from "src/ts/config/apis";
import { alertApiError } from "src/ts/utils/alertApiError";


export enum ApplicationStatus {
    OPEN,
    PENDING,
    CLOSED
}

/**
 * Defines the data required to create an application model.
 *
 * the fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
type ApplicationModelData = {
    applicationId: number;
    receiverId: number;
    receiverName: string;
    country: CountryCodes;
    thumbnail: string;
    productTitle: string;
    productPrice: number;
    producerId: number;
    motivation: string;
    status: ApplicationStatus;
};
// tslint:enable completed-docs

/**
 * Exmaple of a model, and how to implement one.
 */
export class ApplicationModel {
    /**
     * Helper that instantiates a dummy model, populated with required data.
     */
    public static async CREATE_COLLECTION(dataProivder: DataProviders): Promise<ApplicationModel[]> {
        if (dataProivder === DataProviders.BACKEND) {
            const data = Array.from(<ApplicationModelData[]> (await import("../../assets/dummy/application.json")).default);
            const applications = [];

            for (const application of data) {
                applications.push(new ApplicationModel(application));
            }

            return applications;
        } else {
            const data = Array.from(<ApplicationModelData[]> (await import("../../assets/dummy/application.json")).default);
            const applications = [];

            for (const application of data) {
                applications.push(new ApplicationModel(application));
            }

            return applications;
        }
    }

    /**
     * Helper that instantiates a dummy model, populated with required data.
     
    public static async CREATE(dataProivder: DataProviders): Promise<ApplicationModel> {
        if (dataProivder === DataProviders.BACKEND) {
            const data = await import("../../assets/dummy/application.json");

            // Actually fetch data from backend.. :-)
            return new ApplicationModel(data[0]);
        } else {
            const data = await import("../../assets/dummy/application.json");

            return new ApplicationModel(data[0]);
        }
    }*/

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
    public readonly thumbnail: string;

    /**
     * Describes the product the receiver is apllying for
     */
    public readonly productTitle: string;

    /**
     * Describes the price of the produce being sold in dollars.
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
        this.producerId = data.producerId;
        this.motivation = data.motivation;
        this.status = data.status;
    }
}

/**
 * The application cache will contain products fetched from the backend in order to
 * avoid having to fetch them over and over again.
 */
const applicationCache: Map<string, ApplicationModel[]> = new Map();
//let cachedCount: number = 0;

/**
 * Method used to fetch all applications related to a specific receiver.
 * 
 * Users must be logged in to perform this request.
 */
export async function fetchApplicationByReceiver(receiverId: number, store: Store, status: ApplicationStatus) {
    
    const cacheKey = `receiver-${receiverId}-${status}`;
    // If we have a cache hit, then simply return the cached product!
    if (applicationCache.has(cacheKey)) {
        return applicationCache.get(cacheKey);
    }

    const token = localStorage.getItem("userJWT");

    // We NEED to be authorized to perform this request. Bail out if we aren't
    // logged in at the moment
    if (!token) {
        return;
    }

    //const applicationStatus = status === ApplicationStatus.OPEN;

    const endPoint = apis.application.getByReceiver.path
        .replace("{receiverId}", String(receiverId))
        .replace("{applicationStatus}", String(status));

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const applicationsData: ApplicationModelData[] = await response.json();

        // If everything goes well, then create a bunch of productModels from the
        // data and add them to the cache before returning output.
        if (response.ok) {
            const applicationArray = applicationsData.map((applicationData) => ApplicationModel.CREATE(applicationData));
            applicationCache.set(cacheKey, applicationArray);

            return applicationArray;
        } else {
            // ... else alert any errors that occurred to our users!
            alertApiError(response.status, apis.application.getByReceiver.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Helper for delting application
 */
export async function deleteApplication(applicationId: number, store: Store, callback?: () => void) {
    try {
        const token = localStorage.getItem("userJWT");

        // The user MUST be logged in in order to be able to toggle the product
        // availability. (furthermore the logged in user must be the owner of
        // the product, else the backend will throw errors).
        if (!token || !store.user) {
            return;
        }

        const result = await fetch(apis.application.delete.path.replace("{userId}", String(store.user.id)).replace("{applicationId}", String(applicationId)), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (result.ok) {
            applicationCache.delete(`receiver-${store.user.id}-0`);

            // In case we have a callback, then broadcast the newly updated product
            // to it.
            if (callback) {
                callback();
            }
        } else {
            alertApiError(result.status, apis.products.post.errors, store);
        }
    } catch (err) {
        // Show error message
        store.currentErrorMessage = "Something went wrong while attempting to update your product, please try again later.";
    } finally {
    }
}
