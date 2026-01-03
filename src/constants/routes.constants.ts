export const ROUTES = {
    LOGIN: "/login",
    SIGNUP: "/signup",
    DASHBOARD: {
        ROOT: "/dashboard",
        HOME: "home",
        CLIENTS: "clients",
        ITEMS: "items",
        PROFILE: "profile",
        SETTINGS: "settings",
        INVOICES: {
            ROOT: "invoices",
            CREATE: "invoices/create",
            DETAIL: (id: string) => `invoices/${id}`,
            DETAIL_PATH: "invoices/:id",
        },
    },
    WILDCARD: "*",
};
