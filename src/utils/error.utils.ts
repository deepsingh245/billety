import { GlobalUIService } from "./GlobalUIService";

export class AppError extends Error {
    public message: string;
    public originalError?: any;

    constructor(message: string, originalError?: any) {
        super(message);
        this.name = "AppError";
        this.message = message;
        this.originalError = originalError;
    }
}

export const handleError = (error: any, customMessage?: string) => {
    console.error(error);
    const message =
        customMessage || error?.message || "An unexpected error occurred.";
    GlobalUIService.showToast(message);
};
