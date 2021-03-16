const basePath = process.env.REACT_APP_BACKEND_URL;

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
        image: {
            path: `${basePath}/users/image`,
            errors: {
                413: "The image that you're attempting to upload is too large. Please upload a smaller image."
            },
        },
        authenticate: {
            path: `${basePath}/users/authenticate`,
            errors: {
                400: "Failed to authenticate user."
            }
        }
    },
    applications: {
        confirm: {
            path: `${basePath}/applications/{receiverId}/{applicationId}`,
        },
        withdraw: {
            path: `${basePath}/applications/withdraw/{producerId}/{applicationId}`,
        },
        post: {
            path: `${basePath}/applications`,
            errors: {
                400: "Invalid information passed, please correct your data and try again.",
                409: "An application with the given information already exists."
            }
        },
        update: {
            path: `${basePath}/applications`,
            errors: {
                400: "Invalid information passed, please correct your data and try again.",
                403: "Forbidden access.",
                404: "The application could not be found. Nothing was updated.",
            }
        },
        postConfirm: {
            path: `${basePath}/applications/{userId}/{id}`,
            errors: {
                404: "An application with the given id could not be found.",
                422: "The application is not pending and can therefore not be confirmed.",
                500: "Something went wrong."
            }
        },
        getBatchOpen: {
            path: `${basePath}/applications?offset={offset}&amount={amount}`,
            errors: {
                404: "The requested applications could not be found. Please try again later.",
            }
        },
        getBatchCompleted: {
            path: `${basePath}/applications/completed?offset={offset}&amount={amount}`,
            errors: {
                404: "The requested applications could not be found. Please try again later.",
            }
        },
        getFilteredBatch: {
            path: `${basePath}/applications/filtered?offset={offset}&amount={amount}&country={country}&city={city}`,
            errors: {
                404: "The requested applications could not be found. Please try again later.",
            }
        },
        getById: {
            path: `${basePath}/applications/{applicationId}`,
            errors: {
                404: "The requested applications could not be found. Please try again later.",
            }
        },
        getByReceiver: {
            path: `${basePath}/applications/receiver/{receiverId}?status={applicationStatus}`,
            errors: {},
        },
        getWithdrawableByProducer: {
            path: `${basePath}/applications/producer/{producerId}`,
            errors: {},
        },
        delete: {
            path: `${basePath}/applications/{userId}/{applicationId}`,
            errors: {
                404: "The requested application could not be found. Please try again later.",
            },
        },
        getCountries: {
            path: `${basePath}/applications/countries`,
            errors: {}
        },
        getCities: {
            path: `${basePath}/applications/cities?country={country}`,
            errors: {}
        },
    },
    products: {
        post: {
            path: `${basePath}/products`,
            errors: {
                400: "Invalid information passed, please correct your data and try again.",
                409: "A product with the given information already exists."
            }
        },
        postImage: {
            path: `${basePath}/products/image`,
            errors: {
                403: "You are not authorized to upload an image to this product.",
                413: "The image that you're attempting to upload is too large. Please upload a smaller image."
            },
        },
        put: {
            path: `${basePath}/products/{productId}`,
            errors: {
                400: "Invalid information passed, please correct your data and try again.",
                404: "The product you are attempting to update has not been created yet.",
            },
        },
        getById: {
            path: `${basePath}/products/{productId}`,
            errors: {
                404: "The requested products could not be found. Please try again later.",
            }
        },
        getBatch: {
            path: `${basePath}/products?offset={offset}&amount={amount}`,
            errors: {
                404: "The requested products could not be found. Please try again later.",
            }
        },
        getFilteredBatch: {
            path: `${basePath}/products/filtered?offset={offset}&amount={amount}&country={country}&city={city}`,
            errors: {
                404: "The requested products could not be found. Please try again later.",
            }
        },
        getByProducer: {
            path: `${basePath}/products/producer/{producerId}?status={productStatus}`,
            errors: {},
        },
        getCountries: {
            path: `${basePath}/products/countries`,
            errors: {}
        },
        getCities: {
            path: `${basePath}/products/cities?country={country}`,
            errors: {}
        },
    }
}
