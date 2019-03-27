import { UserModelData, UserTypes } from "src/ts/models/UserModel";
import { ProducerModel } from "src/ts/models/ProducerModel";
import { ReceiverModel } from "src/ts/models/ReceiverModel";

/**
 * Simple helper that create a new user based on the information passed
 */
export function createUser(userData: UserModelData) {
    if (userData.userType === UserTypes.PRODUCER) {
        return new ProducerModel(userData);
    } else {
        return new ReceiverModel(userData);
    }
}