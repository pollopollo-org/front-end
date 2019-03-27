const basePath = "https://api.pollopollo.org/api";

export type Errors = {
    [key: number]: string;
}

export const apis = {
    user: {
        create: {
            path: `${basePath}/users/`,
            errors: {
                400: "Invalid information passed, please correct your data and try again",
                409: "A user with the given email already exists, please log in instead.",
            }
        },
        get: {
            path: `${basePath}/users/{userId}`,
            errors: {
                404: "Requested user doesn't exist!",
            }
        },
        self: {
            path: `${basePath}/users/me`,
            errors: {
                404: "No user exists with the associated token!",
            }
        },
        put: {
            path: `${basePath}/users/`,
            errors: {
                400: "Invalid information passed, please correct your data and try again",
                403: "You are not authorized to edit this user!",
            }
        },
        authenticate: {
            path: `${basePath}/users/authenticate`,
            errors: {
                400: "Failed to authenticate user."
            }
        }
    },
    application: {
        getRecent: `${basePath}/applications/recent`,
    },
    products: {
        post: {
            path: `${basePath}/products`,
            errors: {
                400: "Invalid information passed, please correct your data and try again",
                409: "A product with the given information already exists."
            }
        }
    }
}
