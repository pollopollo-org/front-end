import { apis } from "src/ts/config/apis";
import { Store } from "src/ts/store/Store";
import { alertApiError } from "src/ts/utils/alertApiError";

import { EditProfileState } from "src/ts/components/pages/EditProfile/EditProfile";
import { asyncTimeout } from "src/ts/utils";
import { routes } from "src/ts/config";
import { History } from "history";
import { objectToFormData } from "src/ts/utils/objectToFormData";
import { LoginFormState } from "src/ts/components/pages/LoginForm/LoginForm";
import { RegisterFormState } from "src/ts/components/pages/RegisterForm/RegisterForm";
import { stringify } from "querystring";

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

        // In case everything goes well and the user gets authenticated, then 
        // store the token in the local storage, and insert the user into the
        // store.
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("userJWT", data.token);

            const { createDonor } = await import("src/ts/utils/createDonor");
            store.donor = createDonor(data.DonorDTO);

            await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));

            // .. finally navigate the user back to the homepage, logged in.
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
            password: data.password,
            email: data.email,
            //AaAccount: Add the random string.
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
            store.donor = createDonor(data.DonorDTO);

            await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));
            history.push(redirectPath);
        } else {
            alertApiError(response.status, apis.donors.create.errors, store);
        }
    } catch (err) {
        store.currentErrorMessage = "Something went wrong while sending your request, please try again later.";
        console.log(err);
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
