import { DataProviders } from "src/ts/store/Store";
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
    /**
     * Helper that instantiates a user model, populated with required data.
     */
    public static async CREATE(dataProivder: DataProviders): Promise<ReceiverModel | undefined> {
        if (dataProivder === DataProviders.BACKEND) {
            const token = localStorage.getItem("userJWT");

            // Bail out if no token is available since we cannot create a user
            // without knowledge of the user
            if (!token) {
                return;
            }

            // // Extract content out of information and prepare request to backend
            // const parsedToken = jwtDecode(token);
            // const endPoint = apis.user.get.replace("{userId}", "2");

            // const userData = await fetch(apis.user.get.replace("{userId}", "2"), {
            //     method: "GET",
            //     headers: {
            //         "Authorization": token,
            //     }
            // });

            // TODO: parse response?

            // // Fetch data from backend
            // return new ProducerModel(userData as ProducerModelData);
            return;
        } else {
            // Use dummydata
            const data = await import("../../assets/dummy/receiverUser.json");
            return new ReceiverModel(<ReceiverModelData> data);
        }
    }

    constructor(data: ReceiverModelData) {
        super(data);
    }
}
