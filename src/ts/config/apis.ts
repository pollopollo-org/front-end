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
        getRecent: `${basePath}/applications/recent`,
        post: {
            path: `${basePath}/applications`,
            errors: {
                400: "Invalid information passed, please correct your data and try again.",
                409: "A product with the given information already exists."
            }
        },
        getBatch: {
            path: `${basePath}/applications?first={start}&last={end}`,
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
        delete: {
            path: `${basePath}/applications/{userId}/{applicationId}`,
            errors: {
                404: "The requested application could not be found. Please try again later.",
            },
        }
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
        getByProducer: {
            path: `${basePath}/products/producer/{producerId}?active={productStatus}`,
            errors: {},
        },
    }
}
