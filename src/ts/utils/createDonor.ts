import { DonorModel, DonorModelData } from "src/ts/models/DonorModel";

/**
 * Simple helper that create a new user based on the information passed
 */
export function createDonor(userData: DonorModelData) {
    let data = <DonorModelData> userData;
    return new DonorModel(data);
}