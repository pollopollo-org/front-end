import { DataProviders } from "../store/createStore.js";

/**
 * Defines the data required to create an application model.
 *
 * the fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
type ApplicationModelData = {
    amount: number;
    country: string;
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
    public static async CREATE(dataProivder: DataProviders): Promise<ApplicationModel> {
        if (dataProivder === DataProviders.BACKEND) {
            const data = await import("../../assets/dummy/application.json");

            // Actually fetch data from backend.. :-)
            return new ApplicationModel(data);
        } else {
            const data = await import("../../assets/dummy/application.json");

            return new ApplicationModel(data);
        }
    }

    /**
     * Specifies the amount of times the user wish to buy a given product
     */
    public readonly amount: number;

    /**
     * Defines the country the applicant is coming from
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
        this.amount = data.amount;
        this.country = data.country;
        this.motivation = data.motivation;
        this.name = data.name;
        this.price = data.price;
        this.product = data.product;
        this.thumbnail = data.thumbnail;
    }
}
