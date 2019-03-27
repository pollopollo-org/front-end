import { DataProviders } from "src/ts/store/Store";

import countriesJson from "src/assets/countries.json";
import { CountryCodes } from "src/ts/models/CountryCodes";

/**
 * Defines the data required to create a producer model.
 *
 * the fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
type ProductModelData = {
    country: CountryCodes;
    description: string;
    title: string;
    price: number;
    isActive: boolean;
    thumbnail: string;
    producerId: number;
};
// tslint:enable completed-docs

/**
 *  Product model reflecting the data of a product
 */
export class ProductModel {
    /**
     * Helper that instantiates a model, populated with required data.
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
     * Helper that instantiates a model, populated with required data.
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
     * Defines the countryCode of the country that the producer is coming from
     */
    public readonly countryCode: CountryCodes;

    /**
     * Defines the country that the producer is coming from.
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
     * Defines whether the isActive of the product is active.
     */
    public readonly isActive: boolean;

    /**
     * Describes the PRODUCER who is selling the product
     */
    public readonly producerId: number;

    /**
     * Contains a thumbnail of the producer
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
        this.isActive = data.isActive;
        this.producerId = data.producerId;
        this.thumbnail = data.thumbnail;
    }
}
