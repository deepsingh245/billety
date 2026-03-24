// src/utils/GlobalUIService.ts
import { ReactNode } from "react";

type UIController = {
  openModal: (content: ReactNode) => void;
  openAlert: (message: string, onClose?: () => void) => void;
  openPrompt: (message: string, onConfirm: (value: string) => void) => void;
  openDialog: (title: string, content: ReactNode, onConfirm?: () => void) => void;
  showToast: (
    message: string,
    severity?: "success" | "error" | "warning" | "info",
    position?: { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" }
  ) => void;
  setLoading: (val: boolean) => void;
};

let controller: UIController | null = null;

export const setUIController = (c: UIController) => {
  controller = c;
};

export const GlobalUIService = {
  openModal: (content: ReactNode) => controller?.openModal(content),
  openAlert: (msg: string, cb?: () => void) => controller?.openAlert(msg, cb),
  openPrompt: (msg: string, cb: (val: string) => void) => controller?.openPrompt(msg, cb),
  openDialog: (title: string, content: ReactNode, cb?: () => void) =>
    controller?.openDialog(title, content, cb),

  showToast: (
    msg: string,
    severity: "success" | "error" | "warning" | "info" = "success",
    position: { vertical: "top" | "bottom"; horizontal: "left" | "center" | "right" } = { vertical: "top", horizontal: "right" }
  ) => controller?.showToast(msg, severity, position),

  showSuccess: (msg: string) => controller?.showToast(msg, "success"),
  showError: (msg: string) => controller?.showToast(msg, "error"),
  showWarning: (msg: string) => controller?.showToast(msg, "warning"),
  showInfo: (msg: string) => controller?.showToast(msg, "info"),

  setLoading: (val: boolean) => controller?.setLoading?.(val),
};
