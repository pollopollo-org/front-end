import { DataProviders } from "../store/Store";
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
     * Helper that instantiates a user model, populated with required data.
     */
    public static async CREATE(dataProivder: DataProviders): Promise<ProducerModel> {
        if (dataProivder === DataProviders.BACKEND) {
            // Fetch data from backend
            const data = await import("../../assets/dummy/user.json");
            return new ProducerModel(data as ProducerModelData);
        } else {
            // Use dummydata
            const data = await import("../../assets/dummy/user.json");
            return new ProducerModel(data as ProducerModelData);
        }
    }

    /**
     * The Obyte wallet of the user
     */
    public readonly wallet: string;

    constructor(data: ProducerModelData) {
        super(data);
        this.wallet = data.wallet;
    }
}