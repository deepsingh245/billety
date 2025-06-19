// src/context/GlobalUIContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import { setUIController } from "../utils/GlobalUIService";
import Loader from "../components/Loader/Loader";

type GlobalUIContextType = {
  openModal: (content: ReactNode) => void;
  openAlert: (message: string, onClose?: () => void) => void;
  openPrompt: (message: string, onConfirm: (value: string) => void) => void;
  openDialog: (
    title: string,
    content: ReactNode,
    onConfirm?: () => void
  ) => void;
  showToast: (message: string) => void;
};

const GlobalUIContext = createContext<GlobalUIContextType | null>(null);

export const useGlobalUI = () => {
  const ctx = useContext(GlobalUIContext);
  if (!ctx)
    throw new Error("useGlobalUI must be used within a GlobalUIProvider");
  return ctx;
};

export const GlobalUIProvider = ({ children }: { children: ReactNode }) => {
  // MODAL
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  // ALERT
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertCallback, setAlertCallback] = useState<() => void>();

  const openAlert = (message: string, onClose?: () => void) => {
    setAlertMessage(message);
    setAlertOpen(true);
    setAlertCallback(() => onClose);
  };

  // PROMPT
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptMessage, setPromptMessage] = useState("");
  const [promptCallback, setPromptCallback] =
    useState<(value: string) => void>();
  const [promptValue, setPromptValue] = useState("");

  const openPrompt = (message: string, onConfirm: (value: string) => void) => {
    setPromptMessage(message);
    setPromptValue("");
    setPromptCallback(() => onConfirm);
    setPromptOpen(true);
  };

  // DIALOG
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState<ReactNode>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogCallback, setDialogCallback] = useState<() => void>();

  const openDialog = (
    title: string,
    content: ReactNode,
    onConfirm?: () => void
  ) => {
    setDialogTitle(title);
    setDialogContent(content);
    setDialogCallback(() => onConfirm);
    setDialogOpen(true);
  };

  // TOAST
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  //LOADER
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUIController({
      openModal,
      openAlert,
      openPrompt,
      openDialog,
      showToast,
      setLoading,
    });
  }, []);

  return (
    <GlobalUIContext.Provider
      value={{ openModal, openAlert, openPrompt, openDialog, showToast }}
    >
      {children}

      {/* Global Modal */}
      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogContent>{modalContent}</DialogContent>
      </Dialog>

      {/* Global Alert */}
      <Dialog open={alertOpen} onClose={() => setAlertOpen(false)}>
        <DialogTitle>Alert</DialogTitle>
        <DialogContent>{alertMessage}</DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setAlertOpen(false);
              alertCallback?.();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Prompt */}
      <Dialog open={promptOpen} onClose={() => setPromptOpen(false)}>
        <DialogTitle>Prompt</DialogTitle>
        <DialogContent>
          <p>{promptMessage}</p>
          <input
            type="text"
            value={promptValue}
            onChange={(e) => setPromptValue(e.target.value)}
            style={{ width: "100%", marginTop: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPromptOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              promptCallback?.(promptValue);
              setPromptOpen(false);
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              dialogCallback?.();
              setDialogOpen(false);
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Global Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        message={toastMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />

      {/* Loader */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      )}
    </GlobalUIContext.Provider>
  );
};
