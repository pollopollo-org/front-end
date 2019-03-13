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
        name: "Profile"
    }
}
