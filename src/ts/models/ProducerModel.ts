import { UserModel, UserModelData } from "src/ts/models/UserModel";
import { ProductModel } from "src/ts/models/ProductModel";

/**
 * Defines the data required to create a producer model.
 *
 * The fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
export type ProducerModelData = {
    wallet?: string;
    pairingLink?: string;
    street: string;
    streetNumber: string;
    zipcode?: string;
    city: string;
} & UserModelData;
// tslint:enable completed-docs

/**
 * User model for a producer
 */
export class ProducerModel extends UserModel {
    /**
     * The Obyte wallet of the user
     */
    public readonly wallet?: string;

    /**
     * The pairing code of the user
     */
    public readonly pairingLink?: string;

    /**
     * The street the user lives on
     */
    public readonly street: string;

    /**
     * The street number the user lives in
     */
    public readonly streetNumber: string;

    /**
     * The zipcode the user lives in
     */
    public readonly zipcode?: string;

    /**
     * The city the user lives in
     */
    public readonly city: string;

    /**
     * Contains a collection of all products available to a producer
     */
    public readonly products?: ProductModel[];

    constructor(data: ProducerModelData) {
        super(data);
        this.wallet = data.wallet;
        this.pairingLink = data.pairingLink;
        this.street = data.street;
        this.streetNumber = data.streetNumber;
        this.zipcode = data.zipcode;
        this.city = data.city;
    }
}
