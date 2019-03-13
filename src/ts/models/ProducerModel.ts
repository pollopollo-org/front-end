import { UserModel, UserModelData } from "./UserModel";

/**
 * Defines the data required to create a producer model.
 *
 * The fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
export type ProducerModelData = {
    wallet: string;
} & UserModelData;
// tslint:enable completed-docs

/**
 * User model for a producer
 */
export class ProducerModel extends UserModel {
    /**
     * The Obyte wallet of the user
     */
    public readonly wallet: string;

    constructor(data: ProducerModelData) {
        super(data);
        this.wallet = data.wallet;
    }
}