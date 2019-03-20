const basePath = "https://api.pollopollo.org/api";

export const apis = {
    user: {
        create: `${basePath}/users/`,
        get: `${basePath}/users/{userId}`,
        put: `${basePath}/users/`,
        authenticate: `${basePath}/users/authenticate`
    },
    application: {
        getRecent: `${basePath}/applications/recent`,
    }
}
