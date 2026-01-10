export const APP_CONSTANTS = {
    APP_NAME: "Billety",
    COLLECTIONS: {
        CLIENTS: "clients",
        INVOICES: "invoices",
        ITEMS: "items",
    },
    MESSAGES: {
        GENERIC_ERROR: "Something went wrong. Please try again.",
        SAVE_SUCCESS: "Saved successfully!",
        DELETE_SUCCESS: "Deleted successfully!",
        DELETE_CONFIRM: "Are you sure you want to delete this?",
    },
};

export const ChipVariant = {
    PAID: "Paid",
    UNPAID: "Unpaid",
    PENDING: "Pending",
    DRAFT: "Draft",
}

export const CHIP_VARIANT = {
    [ChipVariant.PAID]: {
        backgroundColor: "rgba(0, 128, 0, 0.1)",
        color: "green",
        borderColor: "green",
    },
    [ChipVariant.UNPAID]: {
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        color: "red",
        borderColor: "red",
    },
    [ChipVariant.PENDING]: {
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        color: "orange",
        borderColor: "orange",
    },
    [ChipVariant.DRAFT]: {
        backgroundColor: "rgba(255, 165, 0, 0.1)",
        color: "orange",
        borderColor: "orange",
    },
};
