import { DataProviders } from "src/ts/store/Store";

import countriesJson from "src/assets/countries.json";
import { CountryCodes } from "src/ts/models/CountryCodes";

/**
 * Defines the data required to create an application model.
 *
 * the fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
type ProductModelData = {
    country: CountryCodes;
    description: string;
    title: string;
    price: number;
    thumbnail: string;
    producerId: number;
};
// tslint:enable completed-docs

/**
 * Example of a model, and how to implement one.
 */
export class ProductModel {
    /**
     * Helper that instantiates a dummy model, populated with required data.
     */
    public static async CREATE_COLLECTION(dataProivder: DataProviders): Promise<ProductModel[]> {
        if (dataProivder === DataProviders.BACKEND) {
            const data = Array.from(<ProductModelData[]> (await import("../../assets/dummy/product.json")).default);
            const products = [];

            for (const product of data) {
                products.push(new ProductModel(product));
            }

            return products;
        } else {
            const data = Array.from(<ProductModelData[]> (await import("../../assets/dummy/product.json")).default);
            const products = [];

            for (const product of data) {
                products.push(new ProductModel(product));
            }

            return products;
        }
    }

    /**
     * Helper that instantiates a dummy model, populated with required data.
     */
    public static async CREATE(dataProivder: DataProviders): Promise<ProductModel> {
        if (dataProivder === DataProviders.BACKEND) {
            const data = await import("../../assets/dummy/product.json");

            // Actually fetch data from backend.. :-)
            return new ProductModel(data[0]);
        } else {
            const data = await import("../../assets/dummy/product.json");

            return new ProductModel(data[0]);
        }
    }

    /**
     * Defines the countryCode of the country that applicant is coming from
     */
    public readonly countryCode: CountryCodes;

    /**
     * Defines the country that the applicant is coming from.
     */
    public readonly country: string;

    /**
     * Description defines the product in detail, in order
     * for potential receivers determine
     */
    public readonly description: string;


    /**
     * Defines the title to shortly define the product
     */
    public readonly title: string;

    /**
     * Describes the price of the product being sold in dollars.
     */
    public readonly price: number;

    /**
     * Describes the PRODUCER who is selling the product
     */
    public readonly producerId: number;

    /**
     * Contains a thumbnail of the applicant
     */
    public readonly thumbnail: string;

    constructor(data: ProductModelData) {
        // Parse the country from the supplied countryCode
        const country = countriesJson.find((c) => c.Code.toLowerCase() === data.country.toLowerCase());

        if (!country) {
            console.warn("Unable to find country from countryCode!");
            this.country = "";
        } else {
            this.country = country.Name;
        }

        this.countryCode = data.country;
        this.description = data.description;
        this.title = data.title;
        this.price = data.price;
        this.producerId = data.producerId;
        this.thumbnail = data.thumbnail;
    }
}
