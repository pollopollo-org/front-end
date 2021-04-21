export type Route = {
    /**
     * Specifies the path of a route
     */
    path: string;

    /**
     * Specifies the name of the route to be displayed within the menu
     */
    name?: string;
}

/**
 * Specifies an object that exposes all the available routes within the application
 */
export const routes = {
    root: {
        path: "/",
        name: "Home",
    },
    aboutPage: {
        path: "/about.html",
        name: "About"
    },
    register: {
        path: "/register.html",
    },
    registerProducer: {
        path: "/registerproducer.html",
    },
    registerReceiver: {
        path: "/registerreceiver.html",
    },
    profile: {
        path: "/profile.html",
    },
    viewProfile: {
        path: "/profile/readonly/:userId",
    },
    login: {
        path: "/login.html",
    },
    loginRedirect: {
        path: "/loginredirect.html",
    },
    registerDonor: {
        path: "/registerdonor.html",
    },
    loginOrRegisterProducer: {
        path: "/loginorregisterproducer.html",
    },
    loginOrRegisterReceiver: {
        path: "/loginorregisterreceiver.html",
    },
    editProfile: {
        path: "/profile/edit.html",
    },
    withdrawBytes: {
        path: "/profile/withdrawbytes.html",
    },
    productsPage: {
        path: "/products.html",
        name: "Products",
    },
    createProduct: {
        path: "/products/create.html",
    },
    applicationsPage: {
        path: "/applications.html",
        name: "Applications",
    },
    CreateApplication: {
        path: "/applications/create.html",
    },
    default404: {
        path: "*"
    }
}
