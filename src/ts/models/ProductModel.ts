import { CountryCodes } from "src/ts/models/CountryCodes";
import countriesJson from "src/assets/countries.json";

/**
 * Defines the data required to create a producer model.
 *
 * the fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
export type ProductModelData = {
    productId: number;
    country: CountryCodes;
    description: string;
    title: string;
    price: number;
    available: boolean;
    userId: number;
    thumbnail: string;
};
// tslint:enable completed-docs

/**
 * Contains the path to the backend which is used to resolve images
 */
const BACKEND_URL = "https://api.pollopollo.org";

/**
 *  Product model reflecting the data of a product
 */
export class ProductModel {
    /**
     * Helper that instantiates a model, populated with required data.
     */
    public static CREATE(productData: ProductModelData): ProductModel {
        return new ProductModel(productData);
    }

    /**
     * Specifies the id of the current product
     */
    public readonly id: number;

    /**
     * Defines the location where the product is being sold
     */
    public readonly location: string;

    /**
     * Defines the countryCode of the country that applicant is coming from
     */
    public readonly countryCode: CountryCodes;

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
    public readonly thumbnail?: string;

    constructor(data: ProductModelData) {
        // Parse the country from the supplied countryCode
        const country = countriesJson.find((c) => !data.country ? false : c.Code.toLowerCase() === data.country.toLowerCase());

        if (!country) {
            console.warn("Unable to find country from countryCode!");
            this.location = "";
        } else {
            this.location = country.Name;
        }

        this.id = data.productId;
        this.description = data.description;
        this.countryCode = data.country;
        this.title = data.title;
        this.price = data.price;
        this.description = data.description;
        this.isActive = data.available;
        this.producerId = data.userId;
        this.thumbnail = data.thumbnail ? `${BACKEND_URL}/${data.thumbnail}` : undefined;
    }
}
