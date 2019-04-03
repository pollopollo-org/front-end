import { ProducerModel } from "src/ts/models/ProducerModel";
import { ReceiverModel } from "src/ts/models/ReceiverModel";
import { UserModel } from "src/ts/models/UserModel";

/**
 * Check if the user is a producer
 */
export function isProducerUser(model: UserModel): model is ProducerModel {
    return model instanceof ProducerModel;
}

/**
 * Check if the user is a receiver
 */
export function isReceiverUser(model: UserModel): model is ReceiverModel {
    return model instanceof ReceiverModel;
}
