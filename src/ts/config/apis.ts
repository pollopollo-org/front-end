const basePath = "https://api.pollopollo.org";

export const apis = {
    user: {
        create: `${basePath}/users/`,
        get: `${basePath}/users/{userId}`,
        authenticate: `${basePath}/users/`
    },
    application: {
        getRecent: `${basePath}/applications/recent`
    }
}
