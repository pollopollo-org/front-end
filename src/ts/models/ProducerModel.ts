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
     * Contains a collection of all products available to a producer
     */
    public readonly products?: ProductModel[];

    constructor(data: ProducerModelData) {
        super(data);
        this.wallet = data.wallet;
    }
}
