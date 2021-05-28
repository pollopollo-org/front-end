import { apis } from "src/ts/config/apis";
import { Store } from "src/ts/store/Store";
import { alertApiError } from "src/ts/utils/alertApiError";
// import { EditProfileState } from "src/ts/components/pages/EditProfile/EditProfile";
import { asyncTimeout } from "src/ts/utils";
// import { routes } from "src/ts/config";
import { History } from "history";
// import { objectToFormData } from "src/ts/utils/objectToFormData";
import { LoginFormState } from "src/ts/components/pages/LoginForm/LoginForm";
import { RegisterFormState } from "src/ts/components/pages/RegisterForm/RegisterForm";
// import { stringify } from "querystring";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// tslint:disable-next-line:completed-docs
export type DonorModelData = {
    id : number;
    aaAccount : string;
    uid : string;
    Password: string;
    email : string;
    firstName: string;
    surName: string;
    DeviceAddress : string;
    WalletAddress : string;
    description: string;
    thumbnail? : string;
    country: string;
    userRole: "Donor";
}
//Class to transfer the data of the donor around between various front-end functionality components.
export class DonorModel {
    public readonly id : number;
    public readonly AaAccount : string;
    public readonly UID : string;
    public readonly Password: string;
    public readonly email : string;
    public readonly DeviceAddress? : string;
    public readonly WalletAddress? : string;
    public readonly firstName: string;
    public readonly surName: string;
    public readonly country: string;
    public readonly description: string;
    private readonly thumbnail? : string;


    constructor(data: DonorModelData) {
        console.log(data);
        //Never used, only to support typescript polymorphism.
        this.id = 0;

        this.AaAccount = data.aaAccount;
        this.UID = data.uid;
        this.Password = data.Password;
        this.email = data.email;
        this.DeviceAddress = data.DeviceAddress;
        this.WalletAddress = data.WalletAddress;
        this.firstName = data.firstName;
        this.surName = data.surName;
        this.country = data.country;
        this.description = data.description;
        this.thumbnail = data.thumbnail;
    }
    public getThumbnail(): string | undefined {
        if (this.thumbnail) {
            return `${BACKEND_URL}/${this.thumbnail}`;
        } else {
            return;
        }
    }
}


export async function logIn(data: LoginFormState, store: Store, history: History, path:string) {
    const endPoint = apis.donors.authenticate.path;

    try {
        const startedAt = performance.now();

        const response = await fetch(endPoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password: data.password,
                email: data.email,
            })
        });

        // In case everything goes well and the donor gets authenticated, then 
        // store the token in the local storage, and insert the donor into the
        // store.
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("userJWT", data.token);

            const { createDonor } = await import("src/ts/utils/createDonor");
            store.donor = createDonor(data);

            await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));

            // .. finally navigate the donor back to the homepage, logged in.
            //history.push(routes.root.path);
            history.push(path);
        } else {
            alertApiError(response.status, apis.user.authenticate.errors, store);
        }
    } catch (err) {
        store.currentErrorMessage = "Something with your request went wrong, please try again later";
    }
}

export async function postDonor(data: RegisterFormState, store: Store, history: History, redirectPath: string) {
    const endPoint = apis.donors.create.path;
    try {
        const startedAt = performance.now();
       

        const body = JSON.stringify({ 
            email: data.email,
            password: data.password,
            aaAccount: ""
        });        

        const response = await fetch(endPoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
        });

        // In case everything goes well and the new donor gets created on the
        // backend, then store the token for the new donor in the local storage, 
        // and insert the donor into the store.
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("donorJWT", data.token);
            
            const { createDonor } = await import("src/ts/utils/createDonor");
            store.donor = createDonor(data);

            await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));
            history.push(redirectPath);
        } else {
            alertApiError(response.status, apis.donors.create.errors, store);
        }
    } catch (err) {
        store.currentErrorMessage = "Something went wrong while sending your request, please try again later.";
    }
}

/**
 * Internal method that'll attempt to fetch a given donor in read only mode.
 */
export async function fetchUser(AaAccount: string, store: Store) {
    const endPoint = apis.donors.get.path.replace("{AaAccount}", AaAccount);

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const donorData = await response.json();

        if (response.ok) {
            const { createDonor } = await import("src/ts/utils/createDonor");
            return createDonor(donorData);
        } else {
            alertApiError(response.status, apis.donors.get.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}


export async function fetchAvailableFunds(AaAccount: string, store: Store) {
    const endPoint = apis.donors.getBalance.path.replace("{aaDonorAccount}", AaAccount);

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if(response.ok) {
            return await response.json();
        } else {
            alertApiError(response.status, apis.donors.get.errors, store);
            return;
        }
    } catch (err) {
        return;
    }
}
