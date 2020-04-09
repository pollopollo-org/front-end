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
    register: {
        path: "/register.html",
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
    editProfile: {
        path: "/profile/edit.html",
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
    aboutPage: {
        path: "/about.html",
        name: "About"
    },
    default404: {
        path: "*"
    }
}
