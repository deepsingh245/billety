import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import {
  FormLabel,
  OutlinedInput,
  FormHelperText,
  Button,
  FormControl,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { Client } from "../../interfaces/client.interface";
import { createDocument } from "../../firebase/firebaseUtils";
import { GlobalUIService } from "../../utils/GlobalUIService";
import { useAuth } from "../../context/AuthContext";
import { getUserCollectionPath } from "../../utils/firestorePath.utils";
import { APP_CONSTANTS } from "../../constants/app.constants";

interface AddClientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddClientForm({ onSuccess, onCancel }: AddClientFormProps) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Client>();

  const onSubmit = async (data: Client) => {
    GlobalUIService.setLoading(true);
    try {
      if (!user) return;
      await createDocument(getUserCollectionPath(user.uid, APP_CONSTANTS.COLLECTIONS.CLIENTS), data);
      GlobalUIService.setLoading(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error creating client:", error);
      GlobalUIService.setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={!!errors.name}>
            <FormLabel required sx={{ color: 'text.secondary', mb: 1 }}>Name</FormLabel>
            <OutlinedInput
              size="small"
              placeholder="John Doe"
              {...register("name", { required: "Name is required" })}
              sx={{ bgcolor: 'background.paper' }}
            />
            {errors.name && (
              <FormHelperText>{errors.name.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={!!errors.email}>
            <FormLabel required sx={{ color: 'text.secondary', mb: 1 }}>Email</FormLabel>
            <OutlinedInput
              size="small"
              type="email"
              placeholder="john@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                },
              })}
              sx={{ bgcolor: 'background.paper' }}
            />
            {errors.email && (
              <FormHelperText>{errors.email.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={!!errors.phone}>
            <FormLabel required sx={{ color: 'text.secondary', mb: 1 }}>Phone</FormLabel>
            <OutlinedInput
              size="small"
              placeholder="123-456-7890"
              {...register("phone", { required: "Phone number is required" })}
              sx={{ bgcolor: 'background.paper' }}
            />
            {errors.phone && (
              <FormHelperText>{errors.phone.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={!!errors.company}>
            <FormLabel required sx={{ color: 'text.secondary', mb: 1 }}>Company</FormLabel>
            <OutlinedInput
              size="small"
              placeholder="Example Inc."
              {...register("company", { required: "Company is required" })}
              sx={{ bgcolor: 'background.paper' }}
            />
            {errors.company && (
              <FormHelperText>{errors.company.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth error={!!errors.receivables}>
            <FormLabel required sx={{ color: 'text.secondary', mb: 1 }}>Receivables</FormLabel>
            <OutlinedInput
              size="small"
              type="number"
              placeholder="10000"
              {...register("receivables", {
                required: "Receivables is required",
                valueAsNumber: true,
              })}
              sx={{ bgcolor: 'background.paper' }}
            />
            {errors.receivables && (
              <FormHelperText>{errors.receivables.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Stack direction="row" spacing={2} sx={{ width: '100%', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="outlined" color="primary" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" sx={{ color: 'white' }}>
            Submit Client
          </Button>
        </Stack>
      </Grid>
    </form>
  );
}
