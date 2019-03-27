import { UserModel, UserModelData } from "src/ts/models/UserModel";

/**
 * Defines the data required to create a receiver model.
 *
 * The fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
export type ReceiverModelData = {

} & UserModelData;
// tslint:enable completed-docs

/**
 * User model for a producer
 */
export class ReceiverModel extends UserModel {
    constructor(data: ReceiverModelData) {
        super(data);
    }
}
