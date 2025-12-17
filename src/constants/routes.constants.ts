export const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: {
        ROOT: "/dashboard",
        HOME: "home",
        CLIENTS: "clients",
        ITEMS: "items",
        INVOICES: {
            ROOT: "invoices",
            CREATE: "invoices/create",
            DETAIL: (id: string) => `invoices/${id}`,
            DETAIL_PATH: "invoices/:id", // for route definition
        },
    },
    WILDCARD: "*",
};
