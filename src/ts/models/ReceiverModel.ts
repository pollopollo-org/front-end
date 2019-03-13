import { DataProviders } from "../store/Store";
import { UserModel, UserModelData } from "./UserModel";

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
    /**
     * Helper that instantiates a user model, populated with required data.
     */
    public static async CREATE(dataProivder: DataProviders): Promise<ReceiverModel> {
        if (dataProivder === DataProviders.BACKEND) {
            // Fetch data from backend
            const data = await import("../../assets/dummy/receiverUser.json");
            return new ReceiverModel(data as ReceiverModelData);
        } else {
            // Use dummydata
            const data = await import("../../assets/dummy/receiverUser.json");
            return new ReceiverModel(data as ReceiverModelData);
        }
    }

    constructor(data: ReceiverModelData) {
        super(data);
    }
}