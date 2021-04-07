import { UserModelData, UserTypes } from "src/ts/models/UserModel";
import { ProducerModel, ProducerModelData } from "src/ts/models/ProducerModel";
import { ReceiverModel } from "src/ts/models/ReceiverModel";
import { DonorModel, DonorModelData } from "src/ts/models/DonorModel";

/**
 * Simple helper that create a new user based on the information passed
 */
export function createUser(userData: UserModelData | ProducerModelData) {
    if (userData.userRole === UserTypes.PRODUCER) {
        let data = <ProducerModelData> userData;
        return new ProducerModel(data);
    }
    else {
        return new ReceiverModel(userData);
    }
}
export function createDonor(userData: DonorModelData) {
    let data = <DonorModelData> userData;
    return new DonorModel(data);
}