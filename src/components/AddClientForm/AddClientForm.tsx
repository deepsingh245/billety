import { useForm } from "react-hook-form";
import Grid from "@mui/material/Grid";
import {
  //   Grid,
  FormLabel,
  OutlinedInput,
  FormHelperText,
  Button,
  FormControl,
} from "@mui/material";
import { Client } from "../../interfaces/client.interface";
import { createDocument } from "../../firebase/firebaseUtils";
import { GlobalUIService } from "../../utils/GlobalUIService";

export default function AddClientForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Client>();

  const onSubmit = async (data: Client) => {
    GlobalUIService.setLoading(true);
    console.log(JSON.stringify(data, null, 2));
    await createDocument("clients", data);
    GlobalUIService.setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <FormControl fullWidth error={!!errors.name}>
            <FormLabel required>Name</FormLabel>
            <OutlinedInput
              size="small"
              placeholder="John Doe"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <FormHelperText>{errors.name.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={!!errors.email}>
            <FormLabel required>Email</FormLabel>
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
            />
            {errors.email && (
              <FormHelperText>{errors.email.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={!!errors.phone}>
            <FormLabel required>Phone</FormLabel>
            <OutlinedInput
              size="small"
              placeholder="123-456-7890"
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && (
              <FormHelperText>{errors.phone.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth error={!!errors.company}>
            <FormLabel required>Company</FormLabel>
            <OutlinedInput
              size="small"
              placeholder="Example Inc."
              {...register("company", { required: "Company is required" })}
            />
            {errors.company && (
              <FormHelperText>{errors.company.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <FormControl fullWidth error={!!errors.receivables}>
            <FormLabel required>Receivables</FormLabel>
            <OutlinedInput
              size="small"
              type="number"
              placeholder="10000"
              {...register("receivables", {
                required: "Receivables is required",
                valueAsNumber: true,
              })}
            />
            {errors.receivables && (
              <FormHelperText>{errors.receivables.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item size={{ xs: 12 }}>
          <Button type="submit" variant="contained" color="primary">
            Submit Client
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
