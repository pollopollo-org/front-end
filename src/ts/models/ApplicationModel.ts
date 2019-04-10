import { DataProviders } from "src/ts/store/Store";

import countriesJson from "src/assets/countries.json";
import { CountryCodes } from "src/ts/models/CountryCodes";

/**
 * Defines the data required to create an application model.
 *
 * the fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
export type ApplicationModelData = {
    amount: number;
    country: CountryCodes;
    motivation: string;
    name: string;
    price: number;
    product: string;
    thumbnail: string;
};
// tslint:enable completed-docs

/**
 * Exmaple of a model, and how to implement one.
 */
export class ApplicationModel {
    /**
     * Helper that instantiates a dummy model, populated with required data.
     */
    public static async CREATE_COLLECTION(dataProvider: DataProviders): Promise<ApplicationModel[]> {
        if (dataProvider === DataProviders.BACKEND) {
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
    public static async CREATE(dataProvider: DataProviders): Promise<ApplicationModel> {
        if (dataProvider === DataProviders.BACKEND) {
            const data = await import("../../assets/dummy/application.json");

            // Actually fetch data from backend.. :-)
            return new ApplicationModel(data[0]);
        } else {
            const data = await import("../../assets/dummy/application.json");

            return new ApplicationModel(data[0]);
        }
    }

    /**
     * Specifies the amount of times the user wish to buy a given product
     */
    public readonly amount: number;

    /**
     * Defines the countryCode of the country that applicant is coming from
     */
    public readonly countryCode: CountryCodes;

    /**
     * Defines the country that the applicant is coming from.
     */
    public readonly country: string;

    /**
     * Motivation defines why the user has applied for the given product, in order
     * for potential doners determine
     */
    public readonly motivation: string;

    /**
     * Defines the name of the application applying for the product
     */
    public readonly name: string;

    /**
     * Describes the price of the produce being sold in dollars.
     */
    public readonly price: number;

    /**
     * Describes the product the PRODUCER is selling
     */
    public readonly product: string;

    /**
     * Contains a thumbnail of the applicant
     */
    public readonly thumbnail: string;

    constructor(data: ApplicationModelData) {
        // Parse the country from the supplied countryCode
        const country = countriesJson.find((c) => c.Code.toLowerCase() === data.country.toLowerCase());

        if (!country) {
            console.warn("Unable to find country from countryCode!");
            this.country = "";
        } else {
            this.country = country.Name;
        }

        this.amount = data.amount;
        this.countryCode = data.country;
        this.motivation = data.motivation;
        this.name = data.name;
        this.price = data.price;
        this.product = data.product;
        this.thumbnail = data.thumbnail;
    }
}
