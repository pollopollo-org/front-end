export type DonorModelData = {
    AaAccount : string;
    UID : string;
    Password: string;
    email : string;
    DeviceAddress? : string;
    WalletAddress? : string;
    userRole: "Donor";
}
export class DonorModel {
    
    public readonly AaAccount : string;
    public readonly UID : string;
    public readonly Password: string;
    public readonly email : string;
    public readonly DeviceAddress? : string;
    public readonly WalletAddress? : string;

    constructor(data: DonorModelData) {
        this.AaAccount =data.AaAccount;
        this.UID =data.UID;
        this.Password = data.Password;
        this.email = data.email;
        this.DeviceAddress = data.DeviceAddress;
        this.WalletAddress = data.WalletAddress;
    
    }
}
