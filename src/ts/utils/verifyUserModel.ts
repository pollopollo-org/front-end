import { ProducerModel } from "src/ts/models/ProducerModel";
import { ReceiverModel } from "src/ts/models/ReceiverModel";
import { UserModel } from "src/ts/models/UserModel";
import { DonorModel } from "src/ts/models/DonorModel";

/**
 * Check if the user is a producer
 */
export function isProducerUser(model: UserModel | DonorModel): model is ProducerModel {
    return model instanceof ProducerModel;
}

/**
 * Check if the user is a receiver
 */
export function isReceiverUser(model: UserModel | DonorModel): model is ReceiverModel {
    return model instanceof ReceiverModel;
}


export function isDonorUser(model: UserModel | DonorModel): model is DonorModel {
    return model instanceof DonorModel;
}