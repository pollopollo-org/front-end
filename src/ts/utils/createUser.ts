import { UserModelData, UserTypes } from "src/ts/models/UserModel";
import { ProducerModel, ProducerModelData } from "src/ts/models/ProducerModel";
import { ReceiverModel } from "src/ts/models/ReceiverModel";
import { DonorModel, DonorModelData } from "src/ts/models/DonorModel";


// Function for use when Donor users gets refactored correctly
//
// export function createUser(userData: UserModelData | DonorModelData | ProducerModelData) {
//     switch(userData.userRole) {
//         case UserTypes.PRODUCER :
//             return new ProducerModel(userData as ProducerModelData);
//
//         case UserTypes.Donor :
//             return new DonorModel(userData as DonorModelData);
//         
//         case UserTypes.RECEIVER :
//         default :
//             return new ReceiverModel(userData as ReceiverModelData);
//     }
// }

/**
 * Simple helper that create a new user based on the information passed
 */

export function createUser(userData: UserModelData | ProducerModelData) {
  if (userData.userRole === UserTypes.PRODUCER) {
    return new ProducerModel(<ProducerModelData>userData);
  } else {
    return new ReceiverModel(userData);
  }
}

export function createDonor(userData: DonorModelData) {
  return new DonorModel(<DonorModelData>userData);
}
