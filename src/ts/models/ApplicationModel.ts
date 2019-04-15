import { DataProviders } from "src/ts/store/Store";

import countriesJson from "src/assets/countries.json";
import { CountryCodes } from "src/ts/models/CountryCodes";


export enum ApplicationStatus {
    OPEN = "Open",
    PENDING = "Pending",
    CLOSED = "Closed"
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
     */
    public static async CREATE(dataProivder: DataProviders): Promise<ApplicationModel> {
        if (dataProivder === DataProviders.BACKEND) {
            const data = await import("../../assets/dummy/application.json");

            // Actually fetch data from backend.. :-)
            return new ApplicationModel(data[0]);
        } else {
            const data = await import("../../assets/dummy/application.json");

            return new ApplicationModel(data[0]);
        }
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
