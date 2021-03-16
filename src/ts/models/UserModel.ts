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

export enum UserTypes {
    PRODUCER = "Producer",
    RECEIVER = "Receiver",
    DONOR = "Donor"
}

/**
 * Specifies what's available in a stored JWT token
 */
export type UserToken = {
    /**
     * Specifies the userId that the token is related to
     */
    nameid: string;

    /**
     * Specifies the email of the user the token is related to.
     */
    email: string;

    /**
     * Specifies the unqiue name of the user currently logged in
     */
    unique_name: string;
}

/**
 * Contains the path to the backend which is used to resolve images
 */
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

/**
 * Defines the data required to create a user model.
 *
 * The fields have been commented in length within the actual class
 */
// tslint:disable completed-docs
export type UserModelData = {
    userId: number;
    email: string;
    firstName: string;
    surName: string;
    country: string;
    description?: string;
    thumbnail?: string;
    userRole: UserTypes;
};
// tslint:enable completed-docs

/**
 * User model describing all content required on a user
 */
export class UserModel {
    /**
     * The id of the user
     */
    public readonly id: number;

    /**
     * The email adress of the user
     */
    public readonly email: string;

    /**
     * The first name of the user
     */
    public readonly firstName: string;

    /**
     * The surname of the user
     */
    public readonly surName: string;

    /**
     * The country the user lives in
     */
    public readonly country: string;

    /**
     * The description of the user
     */
    public readonly description?: string;

    /**
     * The path to the user's profile picture
     */
    private readonly thumbnail?: string;

    constructor(data: UserModelData) {
        this.id = data.userId;
        this.email = data.email;
        this.firstName = data.firstName;
        this.surName = data.surName;
        this.country = data.country;
        this.description = data.description;
        this.thumbnail = data.thumbnail;
    }

    /**
     * Internal helper that returns the absolute path to be rendered for a given
     * profile
     */
    public getThumbnail(): string | undefined {
        if (this.thumbnail) {
            return `${BACKEND_URL}/${this.thumbnail}`;
        } else {
            return;
        }
    }
}

/**
 * Method that'll post a password and an email to the backend in an attempt to log
 * the user in with the given credentials
 */
export async function logIn(data: LoginFormState, store: Store, history: History, path:string) {
    const endPoint = apis.user.authenticate.path;

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

            const { createUser } = await import("src/ts/utils/createUser");
            store.user = createUser(data.userDTO);

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

/**
 * Method that'll allow any user of the site to create a new user to the backend
 * while also reflecting the new user on the frontend
 */
export async function postUser(data: RegisterFormState, store: Store, history: History, redirectPath: string) {
    const endPoint = apis.user.create.path;

    try {
        const startedAt = performance.now();

        
        const body = JSON.stringify({
            firstName: data.firstName,
            surname: data.lastName,
            password: data.password,
            email: data.email,
            userRole: data.userType,
            country: data.country,
            street: data.street,
            streetNumber: data.streetNumber,
            zipcode: data.zipcode,
            city: data.city
        });
        

        const response = await fetch(endPoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
        });

        // In case everything goes well and the new user gets created on the
        // backend, then store the token for the new user in the local storage, 
        // and insert the user into the store.
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("userJWT", data.token);

            const { createUser } = await import("src/ts/utils/createUser");
            store.user = createUser(data.userDTO);

            await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));
            history.push(redirectPath);
        } else {
            alertApiError(response.status, apis.user.create.errors, store);
        }
    } catch (err) {
        store.currentErrorMessage = "Something went wrong while sending your request, please try again later.";
        console.log(err);
    }
}

/**
 * Internal method that'll attempt to fetch a given user in read only mode.
 */
export async function fetchUser(userId: string, store: Store) {
    const endPoint = apis.user.get.path.replace("{userId}", userId);

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const userData = await response.json();

        if (response.ok) {
            const { createUser } = await import("src/ts/utils/createUser");
            return createUser(userData);
        } else {
            alertApiError(response.status, apis.user.get.errors, store);
            return;
        }

    } catch (err) {
        return;
    }
}

/**
 * Internal method that'll attempt to log the user in once the page loads.
 * This will only be possible if the user has already logged in previously,
 * since it relies on a token being stored in the localStorage.
 */
export async function fetchSelf(): Promise<UserModel | undefined> {
    const token = localStorage.getItem("userJWT");

    // It is only possible to fetch self when a token is stored since that is
    // the unique identifier of what actually should be fetched
    if (!token) {
        return;
    }

    const endPoint = apis.user.self.path;

    try {
        const response = await fetch(endPoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const userData = await response.json();

        if (response.ok) {
            const { createUser } = await import("src/ts/utils/createUser");
            return createUser(userData);
        }

        return;
    } catch (err) {
        // Fail silently in case something goes wrong (i.e. the token expired..
        // in that case we simply won't log the user in.)
        return;
    }
}

/**
 * Method that should be called once a profile is being edited in order to submit
 * the edited data to the backend and properly reflect it on the frontend.
 */
export async function editProfile(data: EditProfileState, store: Store, history: History) {
    const endPoint = apis.user.put.path;

    try {
        const startedAt = performance.now();
        const token = localStorage.getItem("userJWT");

        // If either a user haven't been logged in or if we're currently missing
        // a token, then we cannot process this process, and hence we bail out.
        if (!store.user || !token) {
            return;
        }

        const result = await fetch(endPoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: data.userId,
                firstName: data.firstName,
                surName: data.lastName,
                email: store.user.email,
                country: data.country,
                userRole: data.userType,
                newPassword: data.repeatedPassword,
                password: data.oldPassword,
                wallet: data.wallet,
                description: data.description,
                street: data.street,
                streetNumber: data.streetNumber,
                zipcode: data.zipcode,
                city: data.city
            })
        });

        let imageResult: Response | undefined = undefined;

        // If the user has passed an image to our form, then we should attempt to 
        // upload that to the server as well.
        if (data.profilePicture) {
            const dataObject = {
                userId: String(data.userId),
                file: data.profilePicture,
            };

            imageResult = await fetch(apis.user.image.path, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: objectToFormData(dataObject),
            })
        }

        // Now that we've updated the user, ensure we also update the information
        // about ourselves on the UI!
        store.user = await fetchSelf();

        // Now, ensure we've waited for at least 500ms before resolving the request
        // in order to ensure throbber actually will be displayed, and that the 
        // UI want appear 'jumpy'
        await asyncTimeout(Math.max(0, 500 - (performance.now() - startedAt)));

        if (result.ok && (!imageResult || imageResult.ok)) {
            // If everything goes we'll, then simply take us back to our profile
            // page and display the updated data.
            history.push(routes.profile.path);
        } else {
            alertApiError(result.status, apis.user.put.errors, store);

            // In case we actually attempted to send an image, then log any errors
            // related to that.
            if (imageResult) {
                alertApiError(imageResult.status, apis.user.image.errors, store);
            }
        }
    } catch (err) {
        store.currentErrorMessage = "Something went wrong while attempting to update your profile, please try again later.";
    }
}