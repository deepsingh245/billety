import { useMemo } from "react";
import { Button, Stack } from "@mui/material";
import { Client } from "../../interfaces/client.interface";
import { createDocument } from "../../firebase/firebaseUtils";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { useAuth } from "../../context/AuthContext";
import { getUserCollectionPath } from "../../utils/firestorePath.utils";
import { APP_CONSTANTS } from "../../constants/app.constants";
import FormRenderer, { FormConfig } from "../FormRenderer/FormRenderer";

interface AddClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddClientForm({ onSuccess, onCancel }: AddClientFormProps) {
  const { user } = useAuth();

  const config: FormConfig = useMemo(() => ({
    id: "add-client-form",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Name",
        required: true,
        placeholder: "John Doe",
        colSpan: 6,
        props: { size: "small" }
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        required: true,
        placeholder: "john@example.com",
        colSpan: 3,
        validation: {
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Invalid email address",
          }
        },
        props: { size: "small" }
      },
      {
        id: "phone",
        type: "text",
        label: "Phone",
        required: true,
        placeholder: "123-456-7890",
        colSpan: 3,
        props: { size: "small" }
      },
      {
        id: "company",
        type: "text",
        label: "Company",
        required: true,
        placeholder: "Example Inc.",
        colSpan: 3,
        props: { size: "small" }
      },
      {
        id: "receivables",
        type: "number",
        label: "Receivables",
        required: true,
        placeholder: "10000",
        colSpan: 3,
        props: { size: "small" }
      }
    ],
    layout: {
      type: 'flat',
      columns: 12,
      gap: 3
    },
    submit: {
      label: "Submit Client",
      render: ({ label }: any) => (
        <Stack direction="row" spacing={2} sx={{ width: '100%', justifyItems: 'flex-end', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="outlined" color="primary" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ color: 'white' }}>
            {label}
          </Button>
        </Stack>
      ),
      onSubmit: async (data: Client) => {
        GlobalUIService.setLoading(true);
        try {
          if (!user) return;
          await createDocument(getUserCollectionPath(user.uid, APP_CONSTANTS.COLLECTIONS.CLIENTS), data);
          GlobalUIService.setLoading(false);
          if (onSuccess) onSuccess();
        } catch (error) {
          console.error("Error creating client:", error);
          GlobalUIService.setLoading(false);
          throw error;
        }
      }
    }
  }), [user, onSuccess, onCancel]);

  return <FormRenderer config={config} />;
}
