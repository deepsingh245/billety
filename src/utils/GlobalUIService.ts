// src/utils/GlobalUIService.ts
import { ReactNode } from "react";

type UIController = {
  openModal: (content: ReactNode) => void;
  openAlert: (message: string, onClose?: () => void) => void;
  openPrompt: (message: string, onConfirm: (value: string) => void) => void;
  openDialog: (title: string, content: ReactNode, onConfirm?: () => void) => void;
  showToast: (message: string) => void;
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
  showToast: (msg: string) => controller?.showToast(msg),
  setLoading: (val: boolean) => controller?.setLoading?.(val),
};
